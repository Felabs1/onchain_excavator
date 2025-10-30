import { useState, useCallback, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import {
  Wallet,
  LogOut,
  Copy,
  Check,
  Loader2,
  CheckCircle,
  UserPlus,
  ExternalLink,
} from "lucide-react";
import { Button } from "./ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { toast } from "sonner@2.0.3";
import { useStarknetConnect } from "../dojo/hooks/useStarknetConnect";
import { useSpawnPlayer } from "../dojo/hooks/useSpawnPlayer";
import { usePlayer } from "../dojo/hooks/usePlayer";
import { useAccount } from "@starknet-react/core";
interface WalletConnectProps {
  onConnect?: (address: string) => void;
  onDisconnect?: () => void;
}

export function WalletConnect({ onConnect, onDisconnect }: WalletConnectProps) {
  const { status, address, isConnecting, handleConnect, handleDisconnect } =
    useStarknetConnect();
  // const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  // const { player, isLoading: playerLoading } = usePlayer();
  // const { initializePlayer, isInitializing, txStatus, txHash } =
  //   useSpawnPlayer();

  const { connector } = useAccount();
  const isConnected = status === "connected";
  const isLoading = isConnecting || status === "connecting";

  useEffect(() => {
    if (isConnected) {
      console.log(
        "🎮 Controller connected but no player found, auto-initializing..."
      );
    }
  }, [isConnected]);

  const handleCopyAddress = () => {
    // In a real app, this would copy the full address
    navigator.clipboard.writeText(walletAddress);
    setIsCopied(true);
    toast.success("Address copied to clipboard!");

    setTimeout(() => setIsCopied(false), 2000);
  };

  const getStatusMessage = () => {
    if (!isConnected) return "Connect your controller to start playing";
    return "Preparing...";
  };

  const getPlayerStatus = () => {
    if (!isConnected) return { color: "bg-red-500", text: "Disconnected" };
    return { color: "bg-yellow-500", text: "Loading..." };
  };

  const VITE_PUBLIC_DEPLOY_TYPE = "localhost" as string;

  const getDeploymentType = () => {
    switch (VITE_PUBLIC_DEPLOY_TYPE) {
      case "localhost":
        return "Localhost";
      case "mainnet":
        return "Mainnet";
      case "sepolia":
        return "Sepolia";
      default:
        return "Sepolia";
    }
  };

  // function to open the Controller Profile
  const handlePlayerReady = useCallback(() => {
    if (!connector || !("controller" in connector)) {
      console.error("Connector not initialized");
      return;
    }
    if (
      connector.controller &&
      typeof connector.controller === "object" &&
      "openProfile" in connector.controller
    ) {
      (
        connector.controller as { openProfile: (profile: string) => void }
      ).openProfile("achievements");
    } else {
      console.error("Connector controller is not properly initialized");
    }
  }, [connector]);

  if (!isConnected) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
      >
        <Button
          onClick={handleConnect}
          className="bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white shadow-[0_0_20px_rgba(34,211,238,0.3)] border-0"
        >
          <Wallet className="w-4 h-4 mr-2" />
          Connect Wallet
        </Button>
      </motion.div>
    );
  }

  const formatAddress = (addr: string) => {
    if (!addr) return "";
    return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
  };

  const playerStatus = getPlayerStatus();
  const deploymentType = getDeploymentType();

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="outline"
          className="border-cyan-500/50 bg-cyan-900/20 hover:bg-cyan-900/40 text-cyan-100"
        >
          <div className="flex items-center gap-2">
            <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
            <Wallet className="w-4 h-4" />
            <span>{formatAddress(address)}</span>
          </div>
        </Button>
      </DropdownMenuTrigger>
      <Button
        variant="outline"
        onClick={handleDisconnect}
        className="border-cyan-500/50 bg-cyan-900/20 hover:bg-cyan-900/40 text-cyan-100"
      >
        <div className="flex items-center gap-2">
          Log out
          <LogOut className="w-4 h-4" />
        </div>
      </Button>
      <DropdownMenuContent
        align="end"
        className="w-56 bg-gray-900 border-cyan-500/30 text-gray-100"
      >
        <DropdownMenuLabel className="text-cyan-300">
          My Wallet
        </DropdownMenuLabel>
        <DropdownMenuSeparator className="bg-gray-700" />

        <DropdownMenuItem
          onClick={handleCopyAddress}
          className="cursor-pointer hover:bg-gray-800 focus:bg-gray-800"
        >
          {isCopied ? (
            <Check className="w-4 h-4 mr-2 text-green-400" />
          ) : (
            <Copy className="w-4 h-4 mr-2" />
          )}
          {isCopied ? "Copied!" : "Copy Address"}
        </DropdownMenuItem>

        <DropdownMenuSeparator className="bg-gray-700" />

        <DropdownMenuItem
          onClick={handleDisconnect}
          className="cursor-pointer text-red-400 hover:bg-gray-800 focus:bg-gray-800"
        >
          <LogOut className="w-4 h-4 mr-2" />
          Disconnect
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
