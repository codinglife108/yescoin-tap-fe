import React, { FC, ReactNode } from 'react'
import './Panel.css'

interface PanelProps {
    children: ReactNode
}

const Panel: FC<PanelProps> = ({ children }) => {
    return (
        <div id='Panel' className='Panel--container'>
            <div className='Panel--content paneled'>{children}</div>
        </div>
    )
}

export default Panel
