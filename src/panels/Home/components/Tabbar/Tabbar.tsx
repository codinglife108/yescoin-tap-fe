import React, { FC, ReactNode } from 'react'
import './Tabbar.css'

interface TabbarProps {
    children: ReactNode
}

const Tabbar: FC<TabbarProps> = ({ children }) => {
    return (
        <div className='Tabbar--container'>
            <div className='Tabbar--content flex items-center'>{children}</div>
        </div>
    )
}

export default Tabbar
