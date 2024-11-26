import { FC } from 'react'
import './BackgroundGlow.css'

interface BackgroundGlowProps {
    color0?: string
    color1: string
    color2: string
    color3?: string
    height?: string | number
    vertical: 'bottom' | 'top'
    fromTop?: boolean
    fromBottom?: boolean
    style?: any
}

const BackgroundGlow: FC<BackgroundGlowProps> = ({
    color0,
    color1,
    color2,
    color3,
    vertical,
    height = '70vh',
    fromTop,
    fromBottom,
    style,
}) => {
    return (
        <div
            className='BackgroundGlow'
            style={{
                height: '100%',
                background: `radial-gradient(${fromBottom ? 'circle at center bottom,' : fromTop ? 'circle at center top,' : ''}${color0 ? color0 + ', ' : ''}  ${color1} , ${color2} ${color3 ? ', ' + color3 + ' 80%' : ''})`,
                [vertical]: 0,
                ...style,
            }}
        />
    )
}

export default BackgroundGlow
