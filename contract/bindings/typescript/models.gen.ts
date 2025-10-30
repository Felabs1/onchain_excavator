import type { SchemaType as ISchemaType } from "@dojoengine/sdk";

import { BigNumberish } from 'starknet';

// Type definition for `dojo_starter::models::Player` struct
export interface Player {
	playerAddress: string;
	health: BigNumberish;
	energy: BigNumberish;
	digs: BigNumberish;
	treasures: BigNumberish;
	value: BigNumberish;
	common: BigNumberish;
	rare: BigNumberish;
	epic: BigNumberish;
	legendary: BigNumberish;
}

// Type definition for `dojo_starter::models::PlayerRank` struct
export interface PlayerRank {
	playerAddress: string;
	playerValue: BigNumberish;
	treasuresCollected: BigNumberish;
}

// Type definition for `dojo_starter::models::Tile` struct
export interface Tile {
	id: BigNumberish;
	playerAddress: string;
	excavated: boolean;
	treasure: BigNumberish;
	hasTrap: boolean;
}

// Type definition for `dojo_starter::systems::actions::actions::Mined` struct
export interface Mined {
	player: string;
	tile: Tile;
}

export interface SchemaType extends ISchemaType {
	dojo_starter: {
		Player: Player,
		PlayerRank: PlayerRank,
		Tile: Tile,
		Mined: Mined,
	},
}
export const schema: SchemaType = {
	dojo_starter: {
		Player: {
			playerAddress: "",
		health: 0,
		energy: 0,
		digs: 0,
		treasures: 0,
		value: 0,
		common: 0,
		rare: 0,
		epic: 0,
		legendary: 0,
		},
		PlayerRank: {
			playerAddress: "",
		playerValue: 0,
		treasuresCollected: 0,
		},
		Tile: {
			id: 0,
			playerAddress: "",
			excavated: false,
			treasure: 0,
			hasTrap: false,
		},
		Mined: {
			player: "",
		tile: { id: 0, playerAddress: "", excavated: false, treasure: 0, hasTrap: false, },
		},
	},
};
export enum ModelsMapping {
	Player = 'dojo_starter-Player',
	PlayerRank = 'dojo_starter-PlayerRank',
	Tile = 'dojo_starter-Tile',
	Mined = 'dojo_starter-Mined',
}