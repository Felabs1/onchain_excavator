import { manifest } from "./config/manifest";

export const GAME_CONTRACT = manifest.contracts.find(
  (contract) => contract.tag === "exca-actions"
)?.address as any;

export const CONTRACT_ADDRESS_GAME = GAME_CONTRACT;
export const VRF_PROVIDER_ADDRESS = '0x051fea4450da9d6aee758bdeba88b2f665bcbf549d2c61421aa724e9ac0ced8f';
