import React, { FC, useState } from 'react'
import './AutoclickButton.css'
import Img from '../../../../components/Img/Img'
import { useDispatch, useSelector } from 'react-redux'
import {
    ADD_GOLD,
    DefaultStateType,
    getDispatchObject,
    REDUCE_ENERGY_LEFT,
} from '../../../../store/reducer'
import { fetchData } from '../../../../utils/api'

interface AutoclickButtonProps {}

let intervalId: NodeJS.Timeout | undefined
let energyLeft: number | null | undefined

const AutoclickButton: FC<AutoclickButtonProps> = ({}) => {
    const [hide, setHide] = useState(false)

    const selector = useSelector((s: DefaultStateType) => s)
    const dispatch = useDispatch()

    const start = () => {
        setHide(true)

        energyLeft = selector.energyLeft
        intervalId = setInterval(step, 10)

        fetchData('/click/autoClickEvent', {})
    }

    const step = () => {
        if (selector.energyLeft === null || !energyLeft) {
            return
        }

        dispatch(getDispatchObject(REDUCE_ENERGY_LEFT, 100))
        dispatch(getDispatchObject(ADD_GOLD, 100))

        energyLeft -= 100

        if (energyLeft <= 0 && intervalId) {
            clearInterval(intervalId)
        }
    }

    return (
        <>
            {selector.lastAutoClickActivityMs !== null &&
                selector.energyLeft !== null &&
                selector.energyLeft > 0 &&
                !hide && (
                    <div className='AutoclickButton--container' onClick={start}>
                        <Img
                            src={require('../../../../assets/images/emoji/robot.png')}
                        />
                    </div>
                )}
        </>
    )
}

export default AutoclickButton
