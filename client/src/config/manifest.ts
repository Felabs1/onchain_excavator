import localhost from "../../../contract/manifest_dev.json"; // local development manifest
import sepolia from "../../../contract/manifest_sepolia.json"; // sepolia manifest
import mainnet from "../../../contract/manifest_dev.json"; // change for the right mainnet manifest
import slot from "../../../contract/manifest_dev.json"; // change for the right slot manifest

// Define valid deploy types
type DeployType = keyof typeof manifests;

// Create the manifests object
const manifests = {
  localhost,
  mainnet,
  sepolia,
  slot,
};

const VITE_PUBLIC_DEPLOY_TYPE = "sepolia" as string;
// Get deployment type from environment with fallback
// const deployType = import.meta.env.VITE_PUBLIC_DEPLOY_TYPE as string;
const deployType = VITE_PUBLIC_DEPLOY_TYPE;

// Export the appropriate manifest with a fallback
export const manifest =
  deployType in manifests ? manifests[deployType as DeployType] : sepolia;

export type Manifest = typeof manifest;
