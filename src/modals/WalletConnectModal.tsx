import React, { FC, useEffect, useState } from 'react';
import { copyText } from '../utils/utils';
import { MODAL_WALLET_CONNECT } from "../routes";
import useModal from "../hooks/useModal";
import { ModalTypes } from '../hooks/useModal';
import { useCallback } from 'react';
import { Button } from '@nextui-org/react';
import { useDispatch } from 'react-redux';
import { getDispatchObject } from '../store/reducer';
import { SET_TOAST } from '../store/reducer';
import { walletIcons, WalletType } from '../utils/wallet';
import WalletIcon from '../components/WalletIcon';
import { useSDK } from "@metamask/sdk-react";
import CloseIcon from '@mui/icons-material/Close';

// @ts-ignore
const tg = window['Telegram'].WebApp;

const WalletConnectModal: FC = () => {

    const { activeModal, setActiveModal, activeModalParams, modalType } = useModal();
    const [isVisible, setIsVisible] = useState(false);

    const [account, setAccount] = useState<string>();
    const { sdk, connected, connecting, provider, chainId } = useSDK();


    // if (activeModal !== MODAL_COPY) return null;
    useEffect(() => {
        // Trigger the animation after the component is mounted
        if (activeModal === MODAL_WALLET_CONNECT) setIsVisible(true);
    }, [activeModal]);

    const dispatch = useDispatch();

    const handleCopy = () => {
        copyText(activeModalParams['link']);
        dispatch(getDispatchObject(SET_TOAST, { open: true, message: "Invite link copied to clipboard", type: "link" }));
        handleClose();
    }
    const handleClose = () => {
        // if (close) {
            setIsVisible(false);
            setActiveModal(null)
            // setTimeout(close, 200); // Wait for the animation to finish before closing
        // }
    };

    const handleConnectMetamask = async () => {
        try {
            const accounts:any = await sdk?.connect();
            setAccount(accounts?.[0]);
            handleClose();
            console.log('connected wallet ----->', accounts?.[0])
          } catch (error) {
            console.error(error);
          }
    }

    const handleConnectWallet = async (type:WalletType) => {
        // console.log('handle wallet connect ----->')
        switch (type) {
            case WalletType.METAMASK:
                handleConnectMetamask();
                break;
            case WalletType.BYBIT_WEB3:
            case WalletType.BITGET_WALLET:
            case WalletType.OKX_WALLET:
        }
    }
    return (
        isVisible&&
        <>
            <div
                className={`boost-confirmation--container floating-center`}
                onClick={handleClose}
            >
                <div
                    className={`boost-confirmation--panel ${isVisible ? "visible" : ""} !h-[fit-content]`}
                    onClick={(e) => e.stopPropagation()}
                >
                    <div className='w-full relative'>
                        <div className='text-center font-bold text-[20px]'>Choose your wallet</div>
                        <CloseIcon  className='absolute top-[-10px] right-0 cursor-pointer' style={{width:"15px"}} onClick={handleClose}/>
                    </div>
                    <div className='w-full border-b border-gray-300/30 my-4'></div>
                    <div className='flex flex-wrap justify-around gap-4'>
                        {
                            walletIcons.map((item, index) => <WalletIcon key={index} {...item}  onClick={handleConnectWallet}/>)
                        }
                    </div>
                </div>  
            </div>
        </>
        );
};

export default WalletConnectModal;