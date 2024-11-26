import React, { FC } from 'react'
import Panel from '../../components/Panel/Panel'
/* import {useTranslation} from "react-i18next"; */
import TelegramBackButton from '../../components/TelegramBackButton/TelegramBackButton'
import BackgroundGlow from '../../components/BackgroundGlow/BackgroundGlow'
import IconText from '../../components/IconText/IconText'
import { useSelector } from 'react-redux'
import { DefaultStateType } from '../../store/reducer'
import Spacing from '../../components/Spacing/Spacing'
import CellContainer from '../../components/CellContainer/CellContainer'
import Cell from '../../components/Cell/Cell'
import Icon16Chevron from '../../assets/icons/Icon16Chevron'
import EmojiRectangle from '../../components/EmojiRectangle/EmojiRectangle'
import Img from '../../components/Img/Img'
import { useNavigate } from 'react-router-dom'
import { ROUTE_GOLD_SWAP } from '../../routes'

const Balance: FC = () => {
    const navigate = useNavigate()

    const selector = useSelector((s: DefaultStateType) => s)
    /* const {t} = useTranslation(); */

    return (
        <Panel>
            <TelegramBackButton />

            <BackgroundGlow
                color1='rgba(8, 18, 29, 0)'
                color2='rgba(0, 190, 163, .5)'
                vertical='top'
            />

            <Spacing size='15vh' />

            <IconText
                size='large'
                imgPath={require('../../assets/images/coins/rocket_coin_back_100x100.png')}
                text={`${selector.gold}`}
                stretched
            />

            <Spacing size={16} />

            <IconText
                size='medium'
                imgPath={require('../../assets/images/coins/usdt.png')}
                text={`${selector.usdt} USDT`}
                stretched
            />

            <Spacing size={32} />

            <CellContainer>
                <Cell
                    onClick={() => navigate(ROUTE_GOLD_SWAP)}
                    title='Exchange coins'
                    after={<Icon16Chevron />}
                    before={
                        <EmojiRectangle>
                            <Img
                                src={require('../../assets/images/emoji/circular_vertical_arrows.png')}
                            />
                        </EmojiRectangle>
                    }
                />

                <Cell
                    onClick={() => {}}
                    title='Top up USDT'
                    after={<Icon16Chevron />}
                    before={
                        <EmojiRectangle>
                            <Img
                                src={require('../../assets/images/emoji/bank_card.png')}
                            />
                        </EmojiRectangle>
                    }
                />

                <Cell
                    onClick={() => {}}
                    title='Withdrawal USDT'
                    after={<Icon16Chevron />}
                    before={
                        <EmojiRectangle>
                            <Img
                                src={require('../../assets/images/emoji/money_fly.png')}
                            />
                        </EmojiRectangle>
                    }
                />
            </CellContainer>
        </Panel>
    )
}

export default Balance
