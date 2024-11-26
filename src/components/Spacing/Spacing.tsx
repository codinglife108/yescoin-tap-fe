import React, { FC } from 'react'

interface SpacingProps {
    size?: number | string | undefined
}

const Spacing: FC<SpacingProps> = ({ size = 16 }) => {
    return <div style={{ marginBottom: size }} />
}

export default Spacing
