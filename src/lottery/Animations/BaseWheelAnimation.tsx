import React, { useRef, useEffect } from 'react'
import Lottie from 'react-lottie'
// @ts-ignore
import animationData from '../../assets/lottery/WHEEL_BASE.json'
import { AnimationComponent } from './InterfacesAndConstants'

const WheelBaseAnimation = ({
    framesPlayedRate,
    loop = false,
    canPlay = true,
    onStop = () => {},
}: AnimationComponent) => {
    const lottieRef = useRef<any>(null)

    const defaultOptions = {
        loop,
        autoplay: false,
        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice',
        },
    }
    useEffect(() => {
        if (lottieRef.current) {
            const anim = lottieRef.current.anim
            const totalFrames = anim.totalFrames
            const halfRotation = totalFrames / framesPlayedRate

            if (!canPlay) {
                return
            }
            // Impostiamo la durata dell'animazione a 3 secondi (metà rotazione in 3 secondi)
            anim.setSpeed(1)
            anim.goToAndStop(0, true)
            // Iniziamo l'animazione dall'inizio
            setTimeout(() => {
                anim.playSegments([0, halfRotation], true)
            }, 200)
        }
        // eslint-disable-next-line
    }, [canPlay])

    return (
        <Lottie
            options={defaultOptions}
            isStopped={!canPlay}
            isPaused={!canPlay}
            isClickToPauseDisabled={true}
            eventListeners={[
                {
                    eventName: 'complete',
                    callback: () => {
                        setTimeout(() => {
                            onStop()
                        }, 1000)
                    },
                },
                {
                    eventName: 'loopComplete',
                    callback: () => console.log('loopComplete'),
                },
            ]}
            height={280}
            width={280}
            ref={lottieRef}
        />
    )
}

export default WheelBaseAnimation
