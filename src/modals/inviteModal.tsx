import React, { useEffect, useState } from 'react'
import { CancelOutlined } from '@mui/icons-material'
import { Button } from '@nextui-org/react'
import './modals.css'
import Spacing from '../components/Spacing/Spacing'
import Img from '../components/Img/Img'

interface BoostConfirmationModalProps {
    close: (() => void) | false
    disabled?: boolean
    sendCallback: () => void
    copyCallback: () => void
    itemData: {
        title: string
        subtitle: string
    }
    iconLogo: string
    sendButtonText?: string
    copyButtonText?: string
    containerStyle?: React.CSSProperties
}

function InviteModal({
    close,
    sendCallback,
    copyCallback,
    itemData,
    sendButtonText = 'Send',
    copyButtonText = 'Copy link',
    containerStyle,
    iconLogo,
}: BoostConfirmationModalProps) {
    const { title, subtitle } = itemData
    const [isVisible, setIsVisible] = useState(false)
    const [tooltip, setTooltip] = useState(false)
    useEffect(() => {
        setIsVisible(true)
    }, [])

    const handleClose = () => {
        if (close) {
            setIsVisible(false)
            setTimeout(close, 200) // Wait for the animation to finish before closing
        }
    }
    return (
        <div className={`boost-confirmation--container`} onClick={handleClose}>
            <div
                className={`boost-confirmation--panel ${isVisible ? 'visible' : ''} h-[fit !important]`}
                onClick={(e) => e.stopPropagation()}
                style={containerStyle}
            >
                {close && (
                    <div
                        className='boost-confirmation--close'
                        onClick={handleClose}
                    >
                        <CancelOutlined />
                    </div>
                )}
                <br></br>
                <Img radius={6} width={170} src={iconLogo} />
                <br></br>
                {title && (
                    <p className={`text-center font-bold text-4xl`}>{title}</p>
                )}
                {subtitle && (
                    <>
                        <br></br>
                        <p className={`text-center text-1xl`}>{subtitle}</p>
                    </>
                )}
                <br></br>
                <br></br>
                <br></br>
                <Button
                    size='lg'
                    style={{ minHeight: 50 }}
                    onClick={sendCallback}
                    className={`w-full bg-blue`}
                >
                    {sendButtonText}
                </Button>
                <Button
                    size='lg'
                    style={{
                        minHeight: 50,
                        background: 'rgb(31 39 52)',
                        color: '#4886e6',
                    }}
                    onClick={() => {
                        setTooltip(true)
                        copyCallback()
                    }}
                    className='w-full bg-blue mt-2'
                >
                    {copyButtonText}
                </Button>
                <Spacing size={32} />
            </div>
        </div>
    )
}

export default InviteModal
