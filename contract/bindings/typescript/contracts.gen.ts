import { DojoProvider, DojoCall } from "@dojoengine/core";
import { Account, AccountInterface, BigNumberish, CairoOption, CairoCustomEnum } from "starknet";
import * as models from "./models.gen";

export function setupWorld(provider: DojoProvider) {

	const build_actions_mine_calldata = (tile: BigNumberish, randomNo: BigNumberish): DojoCall => {
		return {
			contractName: "actions",
			entrypoint: "mine",
			calldata: [tile, randomNo],
		};
	};

	const actions_mine = async (snAccount: Account | AccountInterface, tile: BigNumberish, randomNo: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_actions_mine_calldata(tile, randomNo),
				"exca",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};

	const build_actions_spawn_calldata = (): DojoCall => {
		return {
			contractName: "actions",
			entrypoint: "spawn",
			calldata: [],
		};
	};

	const actions_spawn = async (snAccount: Account | AccountInterface) => {
		try {
			return await provider.execute(
				snAccount,
				build_actions_spawn_calldata(),
				"exca",
			);
		} catch (error) {
			console.error(error);
			throw error;
		}
	};



	return {
		actions: {
			mine: actions_mine,
			buildMineCalldata: build_actions_mine_calldata,
			spawn: actions_spawn,
			buildSpawnCalldata: build_actions_spawn_calldata,
		},
	};
}