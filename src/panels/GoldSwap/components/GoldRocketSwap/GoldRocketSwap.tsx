import React, {FC} from 'react';
import SwapCard from "../SwapCard/SwapCard";
import IconText from "../../../../components/IconText/IconText";
import Spacing from "../../../../components/Spacing/Spacing";
import './GoldRocketSwap.css';
import {useSelector} from "react-redux";
import {DefaultStateType} from "../../../../store/reducer";
import {formatNumberWithSpaces} from "../../../../utils/mathUtils";
import {Skeleton} from "@nextui-org/react";
import {useTranslation} from "react-i18next";

interface GoldRocketSwapProps {
    exchangeRate: null | number
    changeRocketInputValue: (value: any) => void
    rocketInputValue: string
}

const GoldRocketSwap: FC<GoldRocketSwapProps> = ({ exchangeRate, changeRocketInputValue, rocketInputValue }) => {

    const { t } = useTranslation();

    const gold = useSelector((selector: DefaultStateType) => selector.gold);

    return (
        <div className="GoldRocketSwap--container">
            <Skeleton
                isLoaded={!!gold}
                style={{
                    height: 85,
                    width: '100%',
                    borderRadius: 24,
                }}
            >
                {gold && (
                    <SwapCard
                        beforeText={t('swapActionbarGive')}
                        afterText={`${t('balance')}: ${formatNumberWithSpaces(gold)}`}
                        before={
                            <IconText
                                size="special"
                                imgPath={require('../../../../assets/images/coins/rocket_coin_back_36x36.png')}
                                text={t('gold')}
                            />
                        }
                        after={exchangeRate === null ? (
                            <Skeleton
                                style={{ width: 100, height: 24, borderRadius: 16 }}
                            />
                        ) : (
                            <p style={{ color: Number(rocketInputValue) * exchangeRate > gold ? 'var(--red_color)' : 'var(--white_color)' }}>
                                {formatNumberWithSpaces(Number(rocketInputValue) * exchangeRate)}
                            </p>
                        )}
                    />
                )}
            </Skeleton>

            <Spacing />

            <SwapCard
                onClick={() => document.getElementById('GoldRocketSwap--input')?.focus()}
                before={
                    <IconText
                        size="special"
                        imgPath={require('../../../../assets/images/emoji/rocket.png')}
                        text="ROCKET"
                    />
                }
                beforeText={t('swapActionbarGet')}
                after={
                    <input
                        disabled={exchangeRate === null}
                        id="GoldRocketSwap--input"
                        type="number"
                        maxLength={5}
                        placeholder={t('swapActionbarCount')}
                        onChange={changeRocketInputValue}
                        value={rocketInputValue}
                    />
                }
            />
        </div>
    );
};

export default GoldRocketSwap;