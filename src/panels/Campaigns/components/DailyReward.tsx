import Cell from '../../../components/Cell/Cell'
import EmojiRectangle from '../../../components/EmojiRectangle/EmojiRectangle'
import Img from '../../../components/Img/Img'
import IconText from '../../../components/IconText/IconText'
import { formatNumberWithSpaces } from '../../../utils/mathUtils'
import React from 'react'

const DailyReward = ({
    dailyReward,
    getDailyReward,
}: {
    dailyReward: any
    getDailyReward: any
}) => {
    return (
        <Cell
            key='dailyReward'
            title={`DAILY LOGIN WITH MANTLE (${dailyReward['level']})`}
            onClick={() => getDailyReward()}
            before={
                <EmojiRectangle big>
                    <Img
                        radius={0}
                        src={require('../../../assets/images/emoji/mantle.png')}
                    />
                </EmojiRectangle>
            }
        >
            {dailyReward['completed'] ? (
                'completed'
            ) : (
                <IconText
                    size='small'
                    imgPath={require('../../../assets/images/coins/rocket_coin_back_36x36.png')}
                    text={`${formatNumberWithSpaces(dailyReward['reward'])}`}
                />
            )}
        </Cell>
    )
}

export default DailyReward
