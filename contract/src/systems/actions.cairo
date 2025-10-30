// use dojo_starter::models::{, Position};

// define the interface
#[starknet::interface]
pub trait IActions<T> {
    fn spawn(ref self: T);
    fn mine(ref self: T, tile: u32, random_no: u32);
}

// dojo decorator
#[dojo::contract]
pub mod actions {
    use dojo::event::EventStorage;
    use dojo::model::ModelStorage;
    use dojo_starter::models::{Player, PlayerRank, PlayerTrait, Tile, TileTrait};
    use starknet::{ContractAddress, get_caller_address};
    use super::IActions;

    #[derive(Copy, Drop, Serde)]
    #[dojo::event]
    pub struct Mined {
        #[key]
        pub player: ContractAddress,
        pub tile: Tile,
    }

    #[abi(embed_v0)]
    impl ActionsImpl of IActions<ContractState> {
        fn spawn(ref self: ContractState) {
            // Get the default world.
            let mut world = self.world_default();

            let player: Player = Player {
                playerAddress: get_caller_address(),
                health: 100,
                energy: 50,
                digs: 0,
                treasures: 0,
                value: 0,
                common: 0,
                rare: 0,
                epic: 0,
                legendary: 0,
            };

            world.write_model(@player);
        }

        // Implementation of the move function for the ContractState struct.
        fn mine(ref self: ContractState, tile: u32, random_no: u32) {
            // Get the address of the current caller, possibly the player's address.

            let mut world = self.world_default();

            let player_address = get_caller_address();

            let mut player: Player = world.read_model(player_address);

            if !player.can_dig() {
                return;
            }

            let mut tile: Tile = Tile {
                id: tile,
                playerAddress: get_caller_address(),
                excavated: true,
                treasure: '',
                hasTrap: false,
            };

            tile.fill_in_tile(random_no);

            if tile.hasTrap == true {
                player.health -= 25;
            }

            if tile.treasure != 'null' {
                player.treasures += 1;
                if tile.treasure == 'legendary' {
                    player.value += 500;
                    player.legendary += 1;
                } else if tile.treasure == 'rare' {
                    player.value += 50;
                    player.rare += 1;
                } else if tile.treasure == 'epic' {
                    player.value += 150;
                    player.epic += 1;
                } else if tile.treasure == 'common' {
                    player.value += 10;
                    player.common += 1;
                }
            }

            player.digs += 1;

            if player.health == 0 {
                let mut player_rank: PlayerRank = world.read_model(player_address);
                player_rank.playerValue += player.value;
                player_rank.treasuresCollected += player.treasures;
                world.write_model(@player_rank);
            }

            world.write_model(@player);
            world.write_model(@tile);

            world.emit_event(@Mined { player: get_caller_address(), tile });
        }
    }

    #[generate_trait]
    impl InternalImpl of InternalTrait {
        /// Use the default namespace "dojo_starter". This function is handy since the ByteArray
        /// can't be const.
        fn world_default(self: @ContractState) -> dojo::world::WorldStorage {
            self.world(@"dojo_starter")
        }
    }
}

