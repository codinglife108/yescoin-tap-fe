import { createAppKit, useAppKit, useAppKitAccount } from "@reown/appkit/react";
import { useSendTransaction, WagmiProvider } from "wagmi";
import { mantle } from "@reown/appkit/networks";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { WagmiAdapter } from "@reown/appkit-adapter-wagmi";
import { createContext, ReactNode, useContext } from "react";
import { parseEther } from "viem";
import { useDispatch } from "react-redux";
import { getDispatchObject, SET_TOAST } from "../store/reducer";

const queryClient = new QueryClient();

const projectId = "0718c1d045683273e34bcf3bdc487a8c";

const wagmiAdapter = new WagmiAdapter({
  networks: [mantle],
  projectId,
  ssr: true,
});

const walletIds = [
  "38f5d18bd8522c244bdd70cb4a68e0e718865155811c043f052fb9f1c51de662", // Bitget Wallet
  "c57ca95b47569778a828d19178114f4db188b89b763c899ba0be274e97267d96", // MetaMask
  "4622a2b2d6af1c9844944291e5e7351a6aa24cd7b23099efac1b2fd875da31a0", // Trust Wallet
  "8a0ee50d1f22f6651afcae7eb4253e52a3310b90af5daef78a8c4929a9bb99d4", // Binance Web3 Wallet
  "15c8b91ade1a4e58f3ce4e7a0dd7f42b47db0c8df7e0d84f63eb39bcb96c4e0f", // Bybit Wallet
  "971e689d0a5be527bac79629b4ee9b925e82208e5168b733496a09c0faed0709", // OKX Wallet
  "0b415a746fb9ee99cce155c2ceca0c6f6061b1dbca2d722b3ba16381d0562150", // SafePal
];

createAppKit({
  adapters: [wagmiAdapter],
  networks: [mantle],
  projectId,
  metadata: {
    name: "Yescoin",
    description: "",
    url: process.env.REACT_APP_URL || "",
    icons: ["https://miniapp.yesco.in/yescoin_icon.png"],
  },
  features: {
    email: false,
    socials: false,
  },
  featuredWalletIds: walletIds,
  includeWalletIds: walletIds,
  allWallets: "HIDE",
});

interface WalletContextType {
  open: () => Promise<void>
  sendZeroTransaction: () => Promise<boolean>
  isConnected: boolean
  address: string | undefined
}

const WalletContext = createContext<WalletContextType | undefined>(undefined);

export const WalletProvider = ({ children }: { children: ReactNode }) => {
  const dispatch = useDispatch();
  const { open: openAppKit } = useAppKit();
  const { isConnected, address } = useAppKitAccount();
  const { sendTransactionAsync } = useSendTransaction();

  const open = async () => {
    await openAppKit();
    console.log(isConnected, address);
  }

  const sendZeroTransaction = async () => {
    if (!isConnected) {
      await open();
    }

    try {
      const transactionData = await sendTransactionAsync({
        to: "0x0809ec3202a0f76bb349fd392f76b20c64ceffce",
        value: parseEther("0"),
        data: "0x",
      });

      console.log(transactionData);

      return true;
    } catch (error) {
      console.log("sendZeroTransaction error", error);
      dispatch(getDispatchObject(SET_TOAST, { open: true, message: "Reward Claim Failed", type: "error" }));
    }

    return false;
  }

  return (
    <WalletContext.Provider value={{ open, sendZeroTransaction, isConnected, address }}>
      {children}
    </WalletContext.Provider>
  );
}

export const useWallet = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error('useWallet must be used within an WalletProvider');
  }
  
  return context;
};

export const ReownAppKitProvider = ({ children }: { children: ReactNode }) => {
  return (
    <WagmiProvider config={wagmiAdapter.wagmiConfig}>
      <QueryClientProvider client={queryClient}>
        <WalletProvider>
          {children}
        </WalletProvider>
      </QueryClientProvider>
    </WagmiProvider>
  );
};
