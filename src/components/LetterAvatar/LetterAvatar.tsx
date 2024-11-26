import React, { FC, ReactNode } from 'react'
import './LetterAvatar.css'

interface LetterAvatarProps {
    width: number
    height: number
    radius?: number | string
    children?: ReactNode
    small?: boolean
}

const LetterAvatar: FC<LetterAvatarProps> = ({
    width,
    height,
    children,
    radius = 16,
    small,
}) => {
    return (
        <div
            style={{
                width,
                height,
                borderRadius: radius,
                fontSize: small ? 28 : 32,
            }}
            className='LetterAvatar--container'
        >
            {children}
        </div>
    )
}

export default LetterAvatar
