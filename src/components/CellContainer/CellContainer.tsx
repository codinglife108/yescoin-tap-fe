import React, { FC, ReactNode } from 'react'
import './CellContainer.css'

interface CellContainerProps {
    children: ReactNode
    small?: boolean
    xs?: boolean
    onClick?: React.MouseEventHandler<HTMLDivElement>
    extraStyle?: any
}

const CellContainer: FC<CellContainerProps> = ({
    children,
    small,
    xs,
    onClick,
    extraStyle,
}) => {
    return (
        <div
            className='CellContainer--container'
            onClick={onClick ? onClick : undefined}
            style={{
                padding: xs ? '8px' : small ? '16px' : '24px 16px',
                ...(extraStyle ? extraStyle : {}),
            }}
        >
            {children}
        </div>
    )
}

export default CellContainer
