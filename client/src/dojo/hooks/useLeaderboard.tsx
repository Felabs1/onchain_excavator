import { useEffect, useState, useMemo } from "react";
import { useAccount } from "@starknet-react/core";
import { addAddressPadding } from "starknet";
import { dojoConfig } from "../dojoConfig";
import { PlayerRank } from "../../zustand/store";
import useAppStore from "../../zustand/store";

interface UsePlayerRankReturn {
  playerRank: PlayerRank[] | null;
  statePlayerRank: PlayerRank[] | null;
  isLoading: boolean;
  error: Error | null;
  refetch: () => Promise<void>;
}

const TORII_URL = dojoConfig.toriiUrl + "/graphql";

const PLAYER_QUERY = `
    query GetPlayer {
        onchainexcaPlayerRankModels {
            edges {
                node {
                   playerAddress
                    playerValue
                    treasuresCollected  
                }
            }
            totalCount
        }
    }
`;

const hexToNumber = (hexValue: string | number): number => {
  if (typeof hexValue === "number") return hexValue;

  if (typeof hexValue === "string" && hexValue.startsWith("0x")) {
    return parseInt(hexValue, 16);
  }

  if (typeof hexValue === "string") {
    return parseInt(hexValue, 10);
  }

  return 0;
};

const fetchPlayerRankData = async (): Promise<PlayerRank[] | null> => {
  try {
    console.log("🔍 ranking players:");

    const response = await fetch(TORII_URL, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        query: PLAYER_QUERY,
      }),
    });

    const result = await response.json();
    console.log("📡 GraphQL response:", result);

    if (!result.data?.onchainexcaPlayerRankModels?.edges?.length) {
      console.log("❌ No player found in response");
      return null;
    }

    // Extract player data
    const edges = result.data.onchainexcaPlayerRankModels.edges;
    console.log("📄 Raw player data:", edges);

    const rawPlayerData: PlayerRank[] = edges.map((edge: any) => {
      const node = edge.node;
      return {
        playerAddress: node.playerAddress,
        playerValue: hexToNumber(node.playerValue),
        treasuresCollected: hexToNumber(node.treasuresCollected),
      };
    });

    console.log("✅ Player data after conversion:", rawPlayerData);
    return rawPlayerData;
  } catch (error) {
    console.error("❌ Error fetching player:", error);
    throw error;
  }
};

export const useLeaderboard = (): UsePlayerRankReturn => {
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<Error | null>(null);
  const { account } = useAccount();
  const [statePlayers, setStatePlayers] = useState([]);

  const storePlayer = useAppStore((state) => state.playerRank);
  const setPlayer = useAppStore((state) => state.setPlayerRank);

  const userAddress = useMemo(
    () => (account ? addAddressPadding(account.address).toLowerCase() : ""),
    [account]
  );

  const refetch = async () => {
    if (!userAddress) {
      setIsLoading(false);
      return;
    }

    try {
      setIsLoading(true);
      setError(null);

      const playerData = await fetchPlayerRankData();
      console.log("🎮 Player data fetched:", playerData);

      //   setPlayer(playerData);
      setStatePlayers(playerData);

      const updatedPlayer = useAppStore.getState().playerRank;
      console.log("💾 Players in store after update:", updatedPlayer);
    } catch (err) {
      const error =
        err instanceof Error ? err : new Error("Unknown error occurred");
      console.error("❌ Error in refetch:", error);
      setError(error);
      setPlayer(null);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    if (userAddress) {
      console.log("🔄 Address changed, refetching player data");
      refetch();
    }
  }, [userAddress]);

  useEffect(() => {
    if (!account) {
      console.log("❌ No account, clearing player data");
      setPlayer(null);
      setError(null);
      setIsLoading(false);
    }
  }, [account, setPlayer]);

  return {
    playerRank: storePlayer,
    statePlayerRank: statePlayers,
    isLoading,
    error,
    refetch,
  };
};
