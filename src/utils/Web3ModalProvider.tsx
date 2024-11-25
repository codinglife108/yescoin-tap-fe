// import React, { FC, createContext, useContext, useState, ReactNode } from 'react';
// import { ethers } from "ethers";
// import WalletConnect from "@walletconnect/web3-provider";
// import CoinbaseWalletSDK from "@coinbase/wallet-sdk";
// import Web3Modal from "web3modal";

// // Define the provider options
// const providerOptions = {
//   walletlink: {
//     package: CoinbaseWalletSDK,
//     options: {
//       appName: "Web 3 Modal Demo",
//       infuraId: process.env.INFURA_API_KEY || "", // Ensure the environment variable exists
//     }
//   },
//   walletconnect: {
//     package: WalletConnect,
//     options: {
//       infuraId: process.env.INFURA_API_KEY || "",
//     }
//   }
// };

// // Web3Modal Context Types
// interface Web3ModalContextType {
//   address: string;
//   connectWallet: () => Promise<void>;
//   disconnectWallet: () => Promise<void>;
// }

// // Create the context
// const Web3ModalContext = createContext<Web3ModalContextType | undefined>(undefined);

// interface Web3ModalProviderProps {
//   children: ReactNode;
// }

// export const Web3ModalProvider: FC<Web3ModalProviderProps> = ({ children }) => {
//   const [address, setAddress] = useState<string>("");

//   const web3Modal = new Web3Modal({
//     cacheProvider: false, // Change as per requirement
//     providerOptions,
//   });

//   const connectWallet = async () => {
//     try {
//       const provider = await web3Modal.connect();
//       const library = new ethers.providers.Web3Provider(provider);
//       const accounts = await library.listAccounts();
//       const network = await library.getNetwork();
//       if (accounts && accounts.length > 0) {
//         setAddress(accounts[0]);
//       }
//       console.log("Connected to network:", network);
//     } catch (error) {
//       console.error("Error connecting to wallet:", error);
//     }
//   };

//   const disconnectWallet = async () => {
//     setAddress("");
//     await web3Modal.clearCachedProvider();
//   };

//   return (
//     <Web3ModalContext.Provider value={{ address, connectWallet, disconnectWallet }}>
//       {children}
//     </Web3ModalContext.Provider>
//   );
// };

// // Custom hook to use the Web3Modal context
// export const useWeb3Modal = (): Web3ModalContextType => {
//   const context = useContext(Web3ModalContext);

//   if (!context) {
//     throw new Error('useWeb3Modal must be used within a Web3ModalProvider');
//   }

//   return context;
// };
