import React, { FC, ReactNode } from 'react'
import './Tab.css'

interface TabProps {
    icon: ReactNode
    name?: string
    onClick?: React.MouseEventHandler<HTMLDivElement>
}

const Tab: FC<TabProps> = ({ icon, name, onClick }) => {
    return (
        <div className='Tab--container' onClick={onClick}>
            {icon}
            <p>{name}</p>
        </div>
    )
}

export default Tab
