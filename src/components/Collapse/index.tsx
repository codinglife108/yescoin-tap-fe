import React, { FC, ReactNode, useState } from 'react'
import './Collapse.css'
import Icon16ChevronDown from '../../assets/icons/Icon16ChevronDown'
import Icon16Chevron from '../../assets/icons/Icon16Chevron'

interface CollapseProps {
    children: ReactNode
    small?: boolean
    xs?: boolean
    onClick?: React.MouseEventHandler<HTMLDivElement>
    extraStyle?: any
    title?: string
}

const Collapse: FC<CollapseProps> = ({
    children,
    small,
    xs,
    onClick,
    extraStyle,
    title,
}) => {
    const [isOpen, setIsOpen] = useState(false)

    const handleToggle = () => {
        setIsOpen(!isOpen)
    }

    return (
        <div className='Collapse--container'>
            <div
                className='text-lg text-white mb-2 flex items-center justify-between'
                onClick={handleToggle}
                style={{ cursor: 'pointer' }}
            >
                {title}
                {isOpen ? <Icon16ChevronDown /> : <Icon16Chevron />}
            </div>
            {isOpen && (
                <div
                    className='Collapse--content'
                    style={{
                        padding: xs ? '8px' : small ? '16px' : '24px 16px',
                        ...(extraStyle ? extraStyle : {}),
                    }}
                >
                    {children}
                </div>
            )}
        </div>
    )
}

export default Collapse
