import React, { FC, useEffect, useState } from 'react';
import Cell from '../Cell/Cell';
import IconText from '../IconText/IconText';
import EmojiRectangle from '../EmojiRectangle/EmojiRectangle';
import Img from '../Img/Img';
import Icon16Chevron from '../../assets/icons/Icon16Chevron';
import { formatNumberWithSpaces } from '../../utils/mathUtils';
import { fetchData } from '../../utils/api';
import { useDispatch } from "react-redux";
import { getDispatchObject } from '../../store/reducer';
import { ADD_GOLD } from '../../store/reducer';

// import { TonConnectUIProvider, useTonConnectUI } from '@tonconnect/ui-react';
// import TonConnectUI from "@tonconncect/ui";
import { Locales, useTonConnectUI, useTonAddress } from '@tonconnect/ui-react';

interface TaskConnectWalletProps {
    taskId: number
    icon?: string
    reward: number
    isCompleted: boolean
}

const TaskConnectWallet: FC<TaskConnectWalletProps> = ({ taskId, reward, isCompleted, icon }) => {

    const [walletConnected, setWalletConnected] = useState<boolean>(false)

    const [tonConnectUI, setOptions] = useTonConnectUI();
    const userFriendlyAddress = useTonAddress();

    const dispatch = useDispatch();

    // @ts-ignore
    const tg = window['Telegram'].WebApp;

    useEffect(() => {
        onAddressChange()

    }, [userFriendlyAddress])

    const clickHandler = async () => {
        if (tonConnectUI.connected) {
            // @ts-ignore
tg.showConfirm("Would you like to disconnect your wallet?", async (response: boolean) => {
                if (response) {
                    await tonConnectUI.disconnect()
                }
            })
        } else {
            await tonConnectUI.openSingleWalletModal("bitgetTonWallet")
            // await tonConnectUI.openModal()
        }
    }

    const onAddressChange = async () => {
        console.log("Address changed to", userFriendlyAddress);

        if (!isCompleted && userFriendlyAddress) {
            const success = await submitTask(userFriendlyAddress)
            if (success) {
                // @ts-ignore
tg.showAlert("Wallet connected, you got the reward!");
            }

        }
    }

    const submitTask = async (address: string) => {

        const response = await fetchData(
            '/tasks/check',
            {
                id: taskId,
                input: address
            }
        );

        if (response.error || response.result != "ok") {
            // @ts-ignore
tg.showAlert("Invalid wallet");
            return false;
        }

        dispatch(getDispatchObject(ADD_GOLD, reward));

        const event = new Event("TASKS_UPDATE");
        document.dispatchEvent(event);

        return true;
    }

    const readableAddress = () => {
        return userFriendlyAddress.slice(0, 3) + "..." + userFriendlyAddress.slice(-3)
    }

    return (
        <div
            onClick={clickHandler}
            className={`step-card`}
        >
            <Cell
                key="connectWallet"
                superTask={true}
                title={`Connect your Bitget wallet`}
                after={
                    isCompleted ?
                        <svg
                            xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                            fill="none"
                            stroke="currentColor" strokeWidth="2" strokeLinecap="round"
                            strokeLinejoin="round">
                            <polyline points="9 18 15 12 9 6"></polyline>
                        </svg> : undefined
                }
                before={
                    isCompleted ?
                        <EmojiRectangle style={{
                            width: 54,
                            height: 54,
                            display: "flex",
                            marginRight: "15px",
                            justifyContent: "center",
                            alignItems: "center",
                        }}>
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24"
                                fill="none" stroke="green" stroke-width="2" stroke-linecap="round"
                                stroke-linejoin="round" className="feather feather-check">
                                <polyline points="20 6 9 17 4 12" />
                            </svg>
                        </EmojiRectangle>
                        :
                        <img src={icon} alt={'bitget'} className="step-image" 
                        style={{ 
                            marginBottom: "-4px", 
                            marginTop: "2px" ,
                            marginLeft: '1px',
                            marginRight: '15px'
                    }} />
                }
            >
                {tonConnectUI.connected || isCompleted ? (
                    (tonConnectUI.connected) ? "wallet connected: " + readableAddress() : "connect again"
                ) : (
                    <IconText
                        size="small"
                        imgPath={'/rocket_coin_back_36x36.png'}
                        text={`${formatNumberWithSpaces(reward)}`}
                    />
                )}
            </Cell>
        </div>
    );
};

export default TaskConnectWallet;