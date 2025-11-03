import { DojoProvider, DojoCall } from "@dojoengine/core";
import { Account, AccountInterface, BigNumberish, CairoOption, CairoCustomEnum } from "starknet";
import * as models from "./models.gen";

export function setupWorld(provider: DojoProvider) {

	const build_actions_mine_calldata = (tile: BigNumberish): DojoCall => {
		return {
			contractName: "actions",
			entrypoint: "mine",
			calldata: [tile],
		};
	};

	const actions_mine = async (snAccount: Account | AccountInterface, tile: BigNumberish) => {
		try {
			return await provider.execute(
				snAccount,
				build_actions_mine_calldata(tile),
				"dojo_starter",
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
				"dojo_starter",
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