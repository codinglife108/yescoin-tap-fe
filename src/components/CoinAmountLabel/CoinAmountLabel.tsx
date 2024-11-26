import React, { FC } from 'react'
import IconText from '../IconText/IconText'
import { formatNumberWithSpaces } from '../../utils/mathUtils'

interface CoinAmountLabelProps {
    amount: number
    size?:
        | 'large'
        | 'medium'
        | 'small'
        | 'special'
        | 'specialTeam'
        | 'mediumLevels'
}

const CoinAmountLabel: FC<CoinAmountLabelProps> = ({
    amount,
    size = 'small',
}) => {
    return (
        <IconText
            size={size}
            imgPath={require('../../assets/images/coins/rocket_coin_back_36x36.png')}
            text={formatNumberWithSpaces(amount)}
            textColor='var(--gray_light_color)'
        />
    )
}

export default CoinAmountLabel
