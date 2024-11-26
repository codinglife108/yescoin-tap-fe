import React, { FC } from 'react'
import { BackButton } from '@vkruglikov/react-telegram-web-app'
import { useNavigate } from 'react-router-dom'

const TelegramBackButton: FC<{ url?: string }> = ({ url }) => {
    const navigate = useNavigate()
    return (
        <BackButton
            onClick={() => {
                if (url) {
                    navigate(url) // Navigate to the specified URL
                } else {
                    navigate(-1) // Navigate back by one page
                }
            }}
        />
    )
}

export default TelegramBackButton
