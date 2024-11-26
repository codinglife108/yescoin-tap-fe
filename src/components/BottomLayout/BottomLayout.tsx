import React, { FC, ReactNode } from 'react'
import './BottomLayout.css'

interface BottomLayoutProps {
    children: ReactNode
}

const BottomLayout: FC<BottomLayoutProps> = ({ children }) => {
    return <div className='BottomLayout--container'>{children}</div>
}

export default BottomLayout
