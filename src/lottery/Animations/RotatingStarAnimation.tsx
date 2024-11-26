import React, { useRef } from 'react'
import Lottie, { Options } from 'react-lottie'
// @ts-ignore
import animationData from '../../assets/lottery/ROTATING_STAR.json'
import { AnimationComponent } from './InterfacesAndConstants'

const RotatingStarAnimation = ({
    framesPlayedRate,
    loop = true,
    canPlay = true,
}: AnimationComponent) => {
    const lottieRef = useRef<any>(null)

    const defaultOptions: Options = {
        loop,
        autoplay: false,

        animationData: animationData,
        rendererSettings: {
            preserveAspectRatio: 'xMidYMid slice',
        },
    }

    // useEffect(() => {
    //     if (!canPlay) return;
    //     if (lottieRef.current) {
    //         const anim = lottieRef.current.anim;
    //         const totalFrames = anim.totalFrames;
    //         const halfRotation = totalFrames / framesPlayedRate;
    //
    //         // Impostiamo la durata dell'animazione a 3 secondi (metà rotazione in 3 secondi)
    //         const animationDuration = 3;
    //         anim.setSpeed(1);
    //         anim.goToAndStop(0, true);
    //         // Iniziamo l'animazione dall'inizio
    //         anim.playSegments([0, halfRotation], true);
    //
    //     }
    // }, []);

    return (
        <Lottie
            options={defaultOptions}
            eventListeners={[
                {
                    eventName: 'complete',
                    callback: () => console.log('complete'),
                },
                {
                    eventName: 'loopComplete',
                    callback: () => console.log('loopComplete'),
                },
            ]}
            height={200}
            width={340}
            ref={lottieRef}
        />
    )
}

export default RotatingStarAnimation
