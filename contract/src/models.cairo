use starknet::ContractAddress;
const TRAP_SPAWN_RATE: u256 = 15;
const TREASURE_SPAWN_RATE_LEGENDARY: u256 = 2;
const TREASURE_SPAWN_RATE_RARE: u256 = 25;
const TREASURE_SPAWN_RATE_EPIC: u256 = 25;
const TREASURE_SPAWN_RATE_COMMON: u256 = 40;

#[derive(Copy, Drop, Serde, Debug)]
#[dojo::model]
pub struct Tile {
    #[key]
    pub id: u32,
    #[key]
    pub playerAddress: ContractAddress,
    pub excavated: bool,
    pub treasure: felt252,
    pub hasTrap: bool,
}

#[derive(Copy, Drop, Serde, Debug)]
#[dojo::model]
pub struct Mine {
    #[key]
    pub id: u64,
    #[key]
    pub player_address: ContractAddress,
    pub rand_value: u256,
    
}



#[derive(Copy, Drop, Serde, Debug)]
#[dojo::model]
pub struct Player {
    #[key]
    pub playerAddress: ContractAddress,
    pub health: u256,
    pub energy: u256,
    pub digs: u256,
    pub treasures: u256,
    pub value: u256,
    pub common: u256,
    pub rare: u256,
    pub epic: u256,
    pub legendary: u256,
}

#[derive(Copy, Drop, Serde, Debug)]
#[dojo::model]
pub struct PlayerRank {
    #[key]
    pub playerAddress: ContractAddress,
    pub playerValue: u256,
    pub treasuresCollected: u256,
}


#[generate_trait]
pub impl PlayerImpl of PlayerTrait {
    fn can_dig(self: Player) -> bool {
        if self.energy > 0 && self.health > 0 {
            return true;
        } else {
            return false;
        }
    }
}

#[generate_trait]
pub impl TileImpl of TileTrait {
    fn fill_in_tile(ref self: Tile, random_no: u256) {
        let has_trap: bool = random_no < TRAP_SPAWN_RATE;
        let treasure: felt252 = if random_no < TREASURE_SPAWN_RATE_LEGENDARY {
            'legendary'
        } else if random_no < TREASURE_SPAWN_RATE_LEGENDARY + TREASURE_SPAWN_RATE_EPIC {
            'epic'
        } else if random_no < TREASURE_SPAWN_RATE_LEGENDARY
            + TREASURE_SPAWN_RATE_EPIC
            + TREASURE_SPAWN_RATE_RARE {
            'rare'
        } else if random_no < TREASURE_SPAWN_RATE_COMMON
            + TREASURE_SPAWN_RATE_EPIC
            + TREASURE_SPAWN_RATE_LEGENDARY
            + TREASURE_SPAWN_RATE_RARE {
            'common'
        } else {
            'null'
        };

        self.treasure = treasure;
        self.hasTrap = has_trap;
    }
}
