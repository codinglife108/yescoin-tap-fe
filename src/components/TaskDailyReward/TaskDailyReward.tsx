import React, {FC, useEffect, useState} from 'react';
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

import { useTonConnectUI, useTonAddress, useTonWallet } from '@tonconnect/ui-react';


interface TaskDailyRewardProps {
    dailyReward: any
    setDailyReward: any
}

const TaskDailyReward: FC<TaskDailyRewardProps> = ({dailyReward, setDailyReward}) => {

    const [walletConnected, setWalletConnected] = useState<boolean>(false)

    const [tonConnectUI, setOptions] = useTonConnectUI();
    const wallet = useTonWallet();
    const userFriendlyAddress = useTonAddress();

    const dispatch = useDispatch();

    // @ts-ignore
    const tg = window['Telegram'].WebApp;

    const onClick = async () => {
        if (dailyReward["completed"]) {
            return
        }

        setOptions({
            actionsConfiguration: {
                twaReturnUrl: "https://t.me/realyescoinbot",
                returnStrategy: "https://t.me/realyescoinbot"
            }
        })

        // If the wallet of ther is not connected, request the connection
        if (!tonConnectUI.connected) {
            await tonConnectUI.openSingleWalletModal("bitgetTonWallet")
        }

        // If the wallet wasn't connected, alert and stop the action
        if (!userFriendlyAddress) {
            // @ts-ignore
tg.showAlert("You have to connect your wallet to get the reward!");
            return
        }

        try {
            const transaction = {
                validUntil: Math.floor(Date.now() / 1000) + 300, // Valid for 5 minutes
                messages: [
                    {
                        address: "UQDAPSUz9igJXUMCCOcnRBZvW5f0Uqkp_SuDrTWxvkFoNe9T",
                        amount: "0"
                    }
                ]
            }

            const executedTransaction = await tonConnectUI.sendTransaction(transaction)

            if (executedTransaction.boc) {
                console.log("🟢", executedTransaction.boc);
                getDailyReward()
                return
            }
            
        } catch (error) {
            console.error('Error signing message:', error);
        }

        // @ts-ignore
tg.showAlert("The authorization failed. Try again.");
    }

    const getDailyReward = async () => {
        console.log("getDailyReward");
    
        const response = await fetchData("/tasks/claimDailyFixedReward");
    
        if (response.error) {
          return;
        }
    
        dispatch(getDispatchObject(ADD_GOLD, Number(dailyReward["reward"])));
        setDailyReward(response.result);
    
        const event = new Event("TASKS_UPDATE");
        document.dispatchEvent(event);

        // @ts-ignore
tg.showAlert("💸 oh yeah!\n\nYou got your rewad.");
    };

    return (
        <Cell
            key="dailyReward"
            title={`Daily Reward Day ${dailyReward["level"]}`}
            after={!dailyReward["completed"] && <Icon16Chevron />}
            onClick={() => onClick()}
            before={
                <EmojiRectangle>
                <Img
                    radius={0}
                    src={require("../../assets/images/emoji/money_fly.png")}
                />
                </EmojiRectangle>
            }
        >
            {dailyReward["completed"] ? (
                "completed"
            ) : (
                <IconText
                size="small"
                imgPath={require("../../assets/images/coins/rocket_coin_back_36x36.png")}
                text={`${formatNumberWithSpaces(dailyReward["reward"])}`}
                />
            )}
        </Cell>
    );
};

export default TaskDailyReward