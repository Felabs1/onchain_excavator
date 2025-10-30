import { useState, useCallback } from "react";
import { useAccount } from "@starknet-react/core";
import { useDojoSDK } from "@dojoengine/sdk/react";
import { Account } from "starknet";
import useAppStore from "../../zustand/store";

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
  const {
    player,
    updatePlayerHealth,
    updatePlayerDigs,
    updatePlayerCommon,
    updatePlayerRare,
    updatePlayerEpic,
    updatePlayerLegendary,
    tile,
    updateExcavated,
    updateHasTrap,
    updateTreasure,
  } = useAppStore();

  const [mineState, setMineState] = useState<MineActionState>({
    isLoading: false,
    error: null,
    txHash: null,
    txStatus: null,
  });

  const isConnected = status === "connected";
  const hasPlayer = player !== null;
  const hasEnoughHealth = (player?.health || 0) > 5;
  const canMine =
    isConnected && hasPlayer && hasEnoughHealth && !mineState.isLoading;

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

        const tx = await client.actions.mine(
          account as Account,
          tileId,
          randomNo
        );
        console.log("📥 Mine transaction response:", tx);

        if (tx?.transaction_hash) {
          setMineState((prev) => ({ ...prev, txHash: tx.transaction_hash }));
        }

        if (tx && tx.code === "SUCCESS") {
          console.log("✅ Mine transaction successful!");

          // Optimistic update: +5 coins, -5 health
          // updatePlayerCoins((player?.coins || 0) + 5);
          // updatePlayerHealth(Math.max(0, (player?.health || 100) - 5));
          updatePlayerDigs((player?.digs || 0) + 5);

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
    [canMine, account, client.game, player, updatePlayerHealth, hasEnoughHealth]
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
