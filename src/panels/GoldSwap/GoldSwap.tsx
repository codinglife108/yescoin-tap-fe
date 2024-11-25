import React, {FC, useEffect, useState} from 'react';
import Panel from "../../components/Panel/Panel";
import TelegramBackButton from "../../components/TelegramBackButton/TelegramBackButton";
import IconText from "../../components/IconText/IconText";
import Spacing from "../../components/Spacing/Spacing";
import GoldRocketSwap from "./components/GoldRocketSwap/GoldRocketSwap";
import Div from "../../components/Div/Div";
import {Button} from "@nextui-org/react";

import BottomLayout from "../../components/BottomLayout/BottomLayout";
import {useDispatch, useSelector} from "react-redux";
import {ADD_ROCKET, DefaultStateType, getDispatchObject, REDUCE_GOLD} from "../../store/reducer";
import {useTranslation} from "react-i18next";
import {fetchData} from "../../utils/api";

const GoldSwap: FC = () => {

    const [exchangeRate, setExchangeRate] = useState<number | null>(null);
    /* const [exchangeRateLoading, setExchangeRateLoading] = useState(false); */

    const [rocketInput, setRocketInput] = useState("");

    const { t } = useTranslation();

    const rocket = useSelector((selector: DefaultStateType) => selector.rocket);
    const gold = useSelector((selector: DefaultStateType) => selector.gold);
    const dispatch = useDispatch();

    useEffect(() => {
        fetchExchangeRate().then();
    }, []);

    const changeRocketInput = (event: any) => {
        const value = event.target.value;
        if (String(value).includes('.') || String(value).includes(',')) {
            return;
        }

        if (value.length > 5) {
            return;
        }

        if (Number(value) < 0) {
            return;
        }

        setRocketInput(value !== '' ? String(Math.floor(Number(value))) : value);
    }

    const fetchExchangeRate = async () => {
        /*setExchangeRateLoading(true);
        setExchangeRate(500000);
        setExchangeRateLoading(false);*/

        const response = await fetchData('/exchange/getRate');
        if (response.error) {
            return;
        }

        setExchangeRate(response.result['goldPerROCKET']);
    }

    const swap = async () => {
        // @ts-ignore
        const tg = window['Telegram'].WebApp;

        if (gold === null || exchangeRate === null) {
            return;
        }

        const rocketCount = Number(rocketInput)

        if (rocketCount < 1) {
            // @ts-ignore
tg.showAlert(t('swapMinimum1ROCKETError'));
            return;
        }

        if (rocketCount > 99999) {
            return;
        }

        const needGold = Number(rocketCount * exchangeRate);
        if (needGold > gold) {
            // @ts-ignore
tg.showAlert(t('swapNotEnoughGoldError'));
            return;
        }

        const response = await fetchData(
            '/exchange/swap',
            { rocketCount }
        );

        if (response.error) {
            // @ts-ignore
tg.showAlert('[Swap] Server return error');
            return;
        }

        dispatch(getDispatchObject(ADD_ROCKET, rocketCount));
        dispatch(getDispatchObject(REDUCE_GOLD, needGold));
        setRocketInput("");

        // @ts-ignore
tg.showPopup({ message: t('swapSuccessAlert') })
        // @ts-ignore
tg.showAlert(t('swapSuccessAlert'));
    }

    return (
        <Panel>
            <TelegramBackButton />

            <Spacing size={24} />
            <IconText
                size="large"
                imgPath={require('../../assets/images/emoji/rocket.png')}
                text={`${rocket} ROCKET`}
                stretched
            />

            <Spacing size={50} />
            <GoldRocketSwap
                exchangeRate={exchangeRate}
                changeRocketInputValue={(value) => changeRocketInput(value)}
                rocketInputValue={rocketInput}
            />

            <BottomLayout>
                <Div>
                    <Button
                        size="lg"
                        disabled={exchangeRate === null}
                        color="primary"
                        onClick={swap}
                        fullWidth
                    >
                        {t('swapButton')}
                    </Button>
                </Div>
                <Spacing />
            </BottomLayout>
        </Panel>
    );
};

export default GoldSwap;