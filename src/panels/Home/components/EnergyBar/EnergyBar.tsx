import React, { FC } from 'react'
import { Progress, Skeleton } from '@nextui-org/react'
import './EnergyBar.css'
import IconText from '../../../../components/IconText/IconText'
import { useSelector } from 'react-redux'
import { DefaultStateType } from '../../../../store/reducer'
import { formatNumberWithSpaces } from '../../../../utils/mathUtils'

interface EnergyBarProps {}

const EnergyBar: FC<EnergyBarProps> = () => {
    const energyLeft = useSelector(
        (selector: DefaultStateType) => selector.energyLeft
    )
    const dailyEnergy = useSelector(
        (selector: DefaultStateType) => selector.dailyEnergy
    )

    return (
        <div className='EnergyInfo--container'>
            {energyLeft === null || dailyEnergy === null ? (
                <Skeleton
                    style={{
                        height: 24,
                        width: 300,
                        borderRadius: 16,
                    }}
                />
            ) : (
                <div className='EnergyInfo--score'>
                    &nbsp;
                    <IconText
                        size='large'
                        imgPath={require('../../../../assets/images/emoji/lightning.png')}
                        text={``}
                    />
                    &nbsp;
                    <p className={'ml-auto'}>
                        {formatNumberWithSpaces(energyLeft)}
                    </p>
                    &nbsp;
                    <Progress
                        size='md'
                        aria-label='Loading...'
                        classNames={{
                            base: 'w-2/3',
                            track: 'bg-gray-800',
                            indicator:
                                'bg-gradient-to-l from-red-700 to-orange-500',
                        }}
                        value={
                            energyLeft !== null && dailyEnergy !== null
                                ? (energyLeft / dailyEnergy) * 100
                                : 100
                        }
                    />
                </div>
            )}
        </div>
    )
}

export default EnergyBar
