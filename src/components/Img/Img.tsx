import React, { FC } from 'react'
import { useState, useEffect } from 'react'
import { Skeleton } from '@nextui-org/react'

interface ImgProps {
    radius?: number
}

const Img: FC<
    ImgProps &
        React.DetailedHTMLProps<
            React.ImgHTMLAttributes<HTMLImageElement>,
            HTMLImageElement
        >
> = (props) => {
    const [isLoading, setIsLoading] = useState(true)

    return (
        <>
            {isLoading && (
                <div className='w-full h-full flex justify-center items-center'>
                    <Skeleton
                        style={{
                            width: '100%',
                            height: '100%',
                            minWidth: 30,
                            minHeight: 30,
                            maxWidth: 50,
                            maxHeight: 50,
                            borderRadius: 16,
                        }}
                    />
                </div>
            )}

            <img
                {...props}
                alt=''
                style={{
                    visibility: isLoading ? 'hidden' : 'visible',
                    borderRadius: props.radius ?? 16,
                    ...props.style,
                }}
                onLoad={() => setIsLoading(false)}
            />
        </>
    )
}

export default Img
