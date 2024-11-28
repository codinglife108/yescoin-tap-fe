import React, { FC, ReactNode } from 'react'
import './Panel.css'

interface PanelProps {
  children: ReactNode
  style?: React.CSSProperties
  contentStyle?: React.CSSProperties
  overflowToContent?: boolean
}

const Panel: FC<PanelProps> = ({ children, style, contentStyle = { height: '100%' }, overflowToContent }) => {
  return (
    <div id='Panel' className='Panel--container' style={style || {}}>
      <div
        className='Panel--content'
        style={overflowToContent ? contentStyle || {} : contentStyle}
      >
        {children}
      </div>
    </div>
  )
}

export default Panel
