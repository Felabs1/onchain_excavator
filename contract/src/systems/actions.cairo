// use exca::models::{, Position};
use starknet::ContractAddress;


// define the interface
#[starknet::interface]
pub trait IActions<T> {
    fn spawn(ref self: T);
    fn mine(ref self: T, tile: u32);
}

#[derive(Drop, Copy, Clone, Serde)]
pub enum Source {
    Nonce: ContractAddress,
    Salt: felt252,
}

#[starknet::interface]
trait IVrfProvider<T> {
    fn request_random(self: @T, caller: ContractAddress, source: Source);
    fn consume_random(ref self: T, source: Source) -> felt252;
}

// dojo decorator
#[dojo::contract]
pub mod actions {
    use starknet::get_block_timestamp;
use dojo::event::EventStorage;
    use dojo::model::ModelStorage;
    use exca::models::{Player, PlayerRank, PlayerTrait, Tile, TileTrait,Mine};
    use starknet::{ContractAddress, get_caller_address};
    use super::{IActions, IVrfProviderDispatcher, IVrfProviderDispatcherTrait, Source};

    const VRF_PROVIDER_ADDRESS: felt252 = 0x15f542e25a4ce31481f986888c179b6e57412be340b8095f72f75a328fbb27b;

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
        fn mine(ref self: ContractState, tile: u32) {
            // Get the address of the current caller, possibly the player's address.

            let mut world = self.world_default();

            let player_address = get_caller_address();

            let timestamp = get_block_timestamp();

            let mut player: Player = world.read_model(player_address);

            let vrf_provider = IVrfProviderDispatcher { contract_address: VRF_PROVIDER_ADDRESS.try_into().unwrap() };
            let random_value: u256 = vrf_provider.consume_random(Source::Nonce(player_address)).into();

             let constrained_random = random_value % 101;
          

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

            tile.fill_in_tile(constrained_random);

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

            world.write_model(@Mine {
            id: timestamp,
            player_address: player_address,
            rand_value: random_value,
            });

            world.emit_event(@Mined { player: get_caller_address(), tile });
        }
    }

    #[generate_trait]
    impl InternalImpl of InternalTrait {
        /// Use the default namespace "exca". This function is handy since the ByteArray
        /// can't be const.
        fn world_default(self: @ContractState) -> dojo::world::WorldStorage {
            self.world(@"exca")
        }
    }
}

