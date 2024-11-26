import Cell from '../../../components/Cell/Cell'
import EmojiRectangle from '../../../components/EmojiRectangle/EmojiRectangle'
import Img from '../../../components/Img/Img'
import IconText from '../../../components/IconText/IconText'
import { formatNumberWithSpaces } from '../../../utils/mathUtils'
import React from 'react'

// @ts-ignore
const tg = window['Telegram']['WebApp']

const DailyTutorial = () => {
    return (
        <Cell
            key='daily-tutorial'
            title={`Tutorial`}
            onClick={() =>
                // @ts-ignore
                tg.openLink(`https://telegra.ph/HOW-TO-GET-MANTLE-MNT-10-21`)
            }
            before={
                <EmojiRectangle big>
                    <Img
                        radius={0}
                        src={require('../../../assets/images/emoji/sub3.png')}
                    />
                </EmojiRectangle>
            }
        >
            <IconText
                size='small'
                imgPath={require('../../../assets/images/coins/rocket_coin_back_36x36.png')}
                text={`${formatNumberWithSpaces(0)}`}
            />
        </Cell>
    )
}

export default DailyTutorial
