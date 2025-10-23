import { useState } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Wallet, LogOut, Copy, Check } from "lucide-react";
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

interface WalletConnectProps {
  onConnect?: (address: string) => void;
  onDisconnect?: () => void;
}

export function WalletConnect({ onConnect, onDisconnect }: WalletConnectProps) {
  const [isConnected, setIsConnected] = useState(false);
  const [walletAddress, setWalletAddress] = useState("");
  const [isCopied, setIsCopied] = useState(false);

  const handleConnect = () => {
    // Mock wallet connection - generates a random Starknet-style address
    const mockAddress = `0x${Math.random().toString(16).slice(2, 8)}...${Math.random().toString(16).slice(2, 6)}`;
    setWalletAddress(mockAddress);
    setIsConnected(true);
    onConnect?.(mockAddress);
    
    toast.success("Wallet Connected!", {
      description: `Connected to ${mockAddress}`,
    });
  };

  const handleDisconnect = () => {
    setIsConnected(false);
    setWalletAddress("");
    onDisconnect?.();
    
    toast.info("Wallet Disconnected");
  };

  const handleCopyAddress = () => {
    // In a real app, this would copy the full address
    navigator.clipboard.writeText(walletAddress);
    setIsCopied(true);
    toast.success("Address copied to clipboard!");
    
    setTimeout(() => setIsCopied(false), 2000);
  };

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
            <span>{walletAddress}</span>
          </div>
        </Button>
      </DropdownMenuTrigger>
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
