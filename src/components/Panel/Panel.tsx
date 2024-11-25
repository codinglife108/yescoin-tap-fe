import React, { FC, ReactNode } from 'react'
import './Panel.css'

interface PanelProps {
  children: ReactNode
  style?: React.CSSProperties
  overflowToContent?: boolean
}

const Panel: FC<PanelProps> = ({ children, style, overflowToContent }) => {
  return (
    <div id='Panel' className='Panel--container' style={style || {}}>
      <div
        className='Panel--content'
        style={{
          ...(overflowToContent ? { height: '100%', overflowY: 'auto' } : {})
        }}
      >
        {children}
      </div>
    </div>
  )
}

export default Panel
