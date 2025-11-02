import { createDojoConfig } from "@dojoengine/core";

import { manifest } from "../config/manifest";

// const {
//     VITE_PUBLIC_NODE_URL,
//     VITE_PUBLIC_TORII,
//     VITE_PUBLIC_MASTER_ADDRESS,
//     VITE_PUBLIC_MASTER_PRIVATE_KEY,
//   } = import.meta.env;

const VITE_PUBLIC_NODE_URL = "http://localhost:5050" as string;
const VITE_PUBLIC_TORII = "http://127.0.0.1:8080" as string;
const VITE_PUBLIC_MASTER_ADDRESS = "";
const VITE_PUBLIC_MASTER_PRIVATE_KEY = "";

export const dojoConfig = createDojoConfig({
  manifest,
  masterAddress: VITE_PUBLIC_MASTER_ADDRESS || "",
  masterPrivateKey: VITE_PUBLIC_MASTER_PRIVATE_KEY || "",
  rpcUrl: VITE_PUBLIC_NODE_URL || "",
  toriiUrl: VITE_PUBLIC_TORII || "http://127.0.0.1:8080",
});
