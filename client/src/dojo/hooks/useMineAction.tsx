import { useState, useCallback } from "react";
import { useAccount } from "@starknet-react/core";
import { useDojoSDK } from "@dojoengine/sdk/react";
import { Account } from "starknet";
import useAppStore from "../../zustand/store";
import { CONTRACT_ADDRESS_GAME, VRF_PROVIDER_ADDRESS } from "../../constants";

interface MineActionState {
  isLoading: boolean;
  error: string | null;
  txHash: string | null;
  txStatus: "PENDING" | "SUCCESS" | "REJECTED" | null;
}

interface UseMineActionReturn {
  mineState: MineActionState;
  executeMine: (tileId: number, randomNo: number) => Promise<void>;
  canMine: boolean;
  resetMineState: () => void;
}

export const useMineAction = (): UseMineActionReturn => {
  const { account, status } = useAccount();
  const { client } = useDojoSDK();
  const { player, updatePlayerHealth, updatePlayerDigs } = useAppStore();

  const [mineState, setMineState] = useState<MineActionState>({
    isLoading: false,
    error: null,
    txHash: null,
    txStatus: null,
  });

  const isConnected = status === "connected";
  const hasPlayer = player !== null;
  const hasEnoughHealth = (player?.health || 0) > 5;
  const canMine = isConnected && !mineState.isLoading;

  const executeMine = useCallback(
    async (tileId: number, randomNo: number) => {
      if (!canMine || !account) {
        const errorMsg = !account
          ? "Please connect your controller"
          : !hasEnoughHealth
          ? "Not enough health to mine (need >5 HP)"
          : "Cannot mine right now";

        setMineState((prev) => ({ ...prev, error: errorMsg }));
        return;
      }

      try {
        setMineState({
          isLoading: true,
          error: null,
          txHash: null,
          txStatus: "PENDING",
        });

        console.log("📤 Executing mine transaction...");
        console.log("client actions ", client.actions);

          const tx1 = await account.execute([
          {
            contractAddress: VRF_PROVIDER_ADDRESS,
            entrypoint: 'request_random',
            calldata: [CONTRACT_ADDRESS_GAME, '0', account.address],
          },
          {
            contractAddress: CONTRACT_ADDRESS_GAME,
            entrypoint: 'mine',
            calldata: [tileId],
          },
        ]);

        // const tx = await client.actions.mine(
        //   account as Account,
        //   tileId
        // );
        console.log("📥 Mine transaction response:", tx1);

        if (tx1) {
          setMineState((prev) => ({ ...prev, txHash: tx1.transaction_hash }));
        }

        if (tx1) {
          console.log("✅ Mine transaction successful!");

          // Optimistic update: +5 coins, -5 health
          // updatePlayerCoins((player?.coins || 0) + 5);
          // updatePlayerHealth(Math.max(0, (player?.health || 100) - 5));
          updatePlayerDigs((player?.digs || 0) + 1);

          setMineState((prev) => ({
            ...prev,
            txStatus: "SUCCESS",
            isLoading: false,
          }));

          // Auto-clear after 3 seconds
          setTimeout(() => {
            setMineState({
              isLoading: false,
              error: null,
              txHash: null,
              txStatus: null,
            });
          }, 3000);
        } else {
          throw new Error(
            `Mine transaction failed with code: ${tx?.code || "unknown"}`
          );
        }
      } catch (error) {
        console.error("❌ Error executing mine:", error);

        setMineState({
          isLoading: false,
          error: error instanceof Error ? error.message : "Unknown error",
          txHash: null,
          txStatus: "REJECTED",
        });

        // Auto-clear error after 5 seconds
        setTimeout(() => {
          setMineState({
            isLoading: false,
            error: null,
            txHash: null,
            txStatus: null,
          });
        }, 5000);
      }
    },
    [
      canMine,
      account,
      client.actions,
      player,
      updatePlayerHealth,
      hasEnoughHealth,
    ]
  );

  const resetMineState = useCallback(() => {
    setMineState({
      isLoading: false,
      error: null,
      txHash: null,
      txStatus: null,
    });
  }, []);

  return {
    mineState,
    executeMine,
    canMine,
    resetMineState,
  };
};
