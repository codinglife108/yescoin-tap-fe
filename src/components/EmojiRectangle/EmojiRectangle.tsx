import React, { FC, ReactNode } from 'react'
import './EmojiRectangle.css'

interface EmojiRectangleProps {
    children: ReactNode
    big?: boolean
    style?: React.CSSProperties
}

const EmojiRectangle: FC<EmojiRectangleProps> = ({ children, big, style }) => {
    return (
        <div
            style={style || {}}
            className={`EmojiRectangle--container ${big ? 'big' : ''}`}
        >
            {children}
        </div>
    )
}

export default EmojiRectangle
