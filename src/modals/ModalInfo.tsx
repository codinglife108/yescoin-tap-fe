import React, { FC, useEffect } from 'react'
import { MODAL_INFO } from '../routes'
import useModal from '../hooks/useModal'
import InformationModal from './InformationModal'
import logoBonus from '../assets/images/emoji/robot_big.png'
import { ModalTypes } from '../hooks/useModal'
import { useOkxWallet } from '../utils/OkxWalletProvider'
import { useCallback } from 'react'

// @ts-ignore
const tg = window['Telegram'].WebApp

const ModalInfo: FC = () => {
    const { activeModal, setActiveModal, activeModalParams, modalType } =
        useModal()
    const okxContext = useOkxWallet()

    const handleCallBack = useCallback(() => {
        switch (modalType) {
            case ModalTypes.CONNECT_WALLET:
                okxContext.connectWallet()
                break
            case ModalTypes.VOTE_YESCOIN:
                // @ts-ignore
                tg.openLink('https://partner.bybit.com/b/yeswsot')
                break
            default:
                break
        }
    }, [modalType])

    if (!activeModalParams) return null
    const icon = activeModalParams['icon']
        ? activeModalParams['icon']
        : logoBonus
    const iconClass = activeModalParams['iconClass'] || 'w-[60vw] h-[60vw]'
    const title = activeModalParams['title'] || ''
    const buttonText = activeModalParams['buttonText'] || 'TEXTO'
    const Description = activeModalParams['description'] || Description_base
    if (activeModal !== MODAL_INFO) return null

    return (
        <>
            <InformationModal
                floatingCenter={
                    modalType == ModalTypes.VOTE_YESCOIN ||
                    modalType == ModalTypes.CONNECT_WALLET
                }
                modalType={modalType}
                buttonText={buttonText}
                isBoost={false}
                close={() => setActiveModal(null)}
                callback={() => handleCallBack()}
                itemData={{
                    icon: (
                        <img
                            src={icon}
                            className={iconClass}
                            alt={'modal-from-bottom'}
                        />
                    ),
                    title,
                    Description: () => <Description />,
                    value: 0,
                    level: 1,
                }}
            />
        </>
    )
}
const Description_base = () => {
    return (
        <>
            <p></p>
        </>
    )
}
export default ModalInfo
