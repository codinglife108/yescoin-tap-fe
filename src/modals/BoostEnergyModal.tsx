import {
    Button,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
} from '@nextui-org/react'
import React, { FC } from 'react'
import { MODAL_BOOST_ENERGY } from '../routes'
import useModal from '../hooks/useModal'
import { useTranslation } from 'react-i18next'
import { fetchData } from '../utils/api'
import Img from '../components/Img/Img'
import { useDispatch, useSelector } from 'react-redux'
import {
    DefaultStateType,
    getDispatchObject,
    REDUCE_GOLD,
    SET_DAILY_ENERGY,
} from '../store/reducer'
import { getTG } from '../utils/utils'
import { formatNumberWithSpaces } from '../utils/mathUtils'

const ITEMS = [
    { id: 1, energy: 11000, cost: 10000 },
    { id: 2, energy: 55000, cost: 50000 },
    { id: 3, energy: 165000, cost: 150000 },
]

const BoostEnergyModal: FC = () => {
    const { t } = useTranslation()

    const { activeModal, setActiveModal } = useModal()

    const selector = useSelector((s: DefaultStateType) => s)
    const dispatch = useDispatch()

    const availableEnergy = 172800 - ((selector.dailyEnergy ?? 172800) - 172800)

    const buy = async (item: any, onClose: () => void) => {
        if (item.energy > availableEnergy || selector.gold === null) {
            //getTG().showAlert('Вам')
            return
        }

        if (item.cost > selector.gold) {
            // @ts-ignore
            getTG().showAlert(t('boostsNotEnoughROCKETError'))
            return
        }

        const response = await fetchData('/boosts/upgrade', {
            boost: 'energy',
            id: item.id,
        })

        if (response.error) {
            return
        }

        dispatch(
            getDispatchObject(
                SET_DAILY_ENERGY,
                selector.dailyEnergy + item.energy
            )
        )
        dispatch(getDispatchObject(REDUCE_GOLD, item.cost))

        onClose()
    }

    return (
        <Modal
            isOpen={activeModal === MODAL_BOOST_ENERGY}
            placement='center'
            onClose={() => setActiveModal(null)}
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className='flex flex-col gap-1'>
                            More energy
                        </ModalHeader>
                        <ModalBody>
                            <p className='text-16-medium'>
                                Select the desired amount of additional energy.
                                <br />
                                <br />
                                Available:{' '}
                                {formatNumberWithSpaces(availableEnergy)} /
                                172,800
                            </p>

                            <div>
                                {ITEMS.filter(
                                    (item) => item.energy <= availableEnergy
                                ).map((item, index) => (
                                    <Button
                                        key={index}
                                        fullWidth
                                        color='secondary'
                                        style={{ marginTop: 8 }}
                                        //onPress={onClose}
                                        //onClick={() => confirm(onClose)}
                                        onClick={() => buy(item, onClose)}
                                    >
                                        <Img
                                            src={require('../assets/images/emoji/battery.png')}
                                            style={{ height: 24 }}
                                        />
                                        {formatNumberWithSpaces(item.energy)} —{' '}
                                        {formatNumberWithSpaces(item.cost)}
                                        <Img
                                            src={require('../assets/images/coins/rocket_coin_back_36x36.png')}
                                            style={{ height: 24 }}
                                        />
                                    </Button>
                                ))}
                            </div>
                        </ModalBody>
                        <ModalFooter></ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}

export default BoostEnergyModal
