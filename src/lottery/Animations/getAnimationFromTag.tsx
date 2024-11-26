import { lazy } from 'react'
import {
    AnimationTags,
    ROCKET,
    ROTATING_STAR,
    SPIN,
    USDT,
    WHEEL_BASE,
    YESCOIN,
} from './InterfacesAndConstants'
// import WheelBaseAnimation from "./BaseWheelAnimation";
// import RotatingStarAnimation from "./RotatingStarAnimation";
// import RocketAnimation from "./RocketAnimation";
// import SpinAnimation from "./SpinAnimation";
// import UsdtAnimation from "./UsdtAnimation";
// import YescoinAnimation from "./YescoinAnimation";
const WheelBaseAnimation = lazy(() => import('./BaseWheelAnimation'))
const RotatingStarAnimation = lazy(() => import('./RotatingStarAnimation'))
const RocketAnimation = lazy(() => import('./RocketAnimation'))
const SpinAnimation = lazy(() => import('./SpinAnimation'))
const UsdtAnimation = lazy(() => import('./UsdtAnimation'))
const YescoinAnimation = lazy(() => import('./YescoinAnimation'))
const getAnimationFromTag = (tag: AnimationTags) => {
    switch (tag) {
        case WHEEL_BASE:
            return <WheelBaseAnimation framesPlayedRate={1} loop={true} />
        case ROTATING_STAR:
            return <RotatingStarAnimation framesPlayedRate={1} loop={false} />
        case ROCKET:
            return <RocketAnimation framesPlayedRate={1} loop={false} />
        case SPIN:
            return <SpinAnimation framesPlayedRate={1} loop={false} />
        case YESCOIN:
            return <YescoinAnimation framesPlayedRate={1} loop={false} />
        case USDT:
            return <UsdtAnimation framesPlayedRate={1} loop={false} />
        default:
            return null
    }
}

export default getAnimationFromTag
