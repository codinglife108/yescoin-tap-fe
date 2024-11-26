import React, { FC, useEffect, useState, useRef, useCallback } from 'react'
import './CoinButton.css'
import { useDispatch, useSelector } from 'react-redux'
import {
    ADD_GOLD,
    DefaultStateType,
    getDispatchObject,
    REDUCE_ENERGY_LEFT,
    SET_USER_ACTIVTY,
    SET_LEVEL,
} from '../../../../store/reducer'
import { fetchData } from '../../../../utils/api'
import { getUnixTime, isDesktop } from '../../../../utils/utils'
import useModal, { ModalTypes } from '../../../../hooks/useModal'
import { MODAL_INFO } from '../../../../routes'
import iconLogo from '../../../../assets/images/coins/rocket_coin_back_100x100.png'
import walletIcon from '../../../../assets/icons/wallet-icon.png'
import bybitIcon from '../../../../assets/icons/bybit_icon.png'
import { useOkxWallet } from '../../../../utils/OkxWalletProvider'

interface CoinButtonProps {}

const MS_BETWEEN_BATCHES = 80
// const MS_INACTIVITY_FOR_SAVE = 100;

/* let intervalId: any = null; */

const CoinButton: FC<CoinButtonProps> = () => {
    // animation
    const [clickDigits, setClickDigits] = useState<any>([])
    const [, setBatchStartTime] = useState<number>(0)
    const [lastClickTime, setLastClickTime] = useState<number>(0)
    const [lastSaveTime] = useState<number>(0)
    const [sessionId, setSessionId] = useState<string>('')
    const [startSessionMs, setStartSessionMs] = useState<number>(0)
    const [totalSessionClicks, setTotalSessionClicks] = useState(0)
    const [tapAt, setTapAt] = useState<number>(new Date().getTime() / 1000)
    const [voteAt, setVoteAt] = useState<number>(new Date().getTime() / 1000)
    const okxContext = useOkxWallet()

    // количество кликов. когда достигает 10 - отправляется пачкой на сервер и обнуляется
    const [, setClicksStack] = useState(0)

    const sessionIdRef = useRef(sessionId)
    const startSessionMsRef = useRef(startSessionMs)
    const totalSessionClicksRef = useRef(totalSessionClicks)
    /* const clicksStackRef = useRef(clicksStack); */
    const lastClickTimeRef = useRef(lastClickTime)
    const lastSaveTimeRef = useRef(lastSaveTime)

    const tapCount = useRef<number>(0)
    const lastSentToServerAt = useRef<number>(new Date().getTime() / 1000)
    const lastClickAt = useRef<number>(new Date().getTime() / 1000)
    const checkActivityInterval: any = useRef<number>(null)
    const { setActiveModal, setModalType } = useModal()

    const selector = useSelector((s: DefaultStateType) => s)
    const screenPopup = selector.screenPopup

    useEffect(() => {
        lastClickTimeRef.current = lastClickTime
    }, [lastClickTime])

    useEffect(() => {
        lastSaveTimeRef.current = lastSaveTime
    }, [lastSaveTime])

    useEffect(() => {
        sessionIdRef.current = sessionId
    }, [sessionId])

    useEffect(() => {
        totalSessionClicksRef.current = totalSessionClicks
    }, [totalSessionClicks])

    useEffect(() => {
        startSessionMsRef.current = startSessionMs
    }, [startSessionMs])

    const goldPerClick = useSelector(
        (selector: DefaultStateType) => selector.goldPerClick
    )
    const energyLeft = useSelector(
        (selector: DefaultStateType) => selector.energyLeft
    )
    const dispatch = useDispatch()

    const sendToServer = useCallback(() => {
        if (checkActivityInterval.current) {
            clearInterval(checkActivityInterval.current)
            checkActivityInterval.current = null
        }

        lastSentToServerAt.current = new Date().getTime()
        const amountOfClicks = tapCount.current
        tapCount.current = 0

        if (amountOfClicks === 0) {
            return
        }

        setClicksStack(0)

        fetchData('/click/clickEvent', {
            count: amountOfClicks,
            sessionId: sessionIdRef.current,
            startSessionMs: startSessionMsRef.current,
            lastSessionActivityMs: new Date().getTime(),
            totalSessionClicks: totalSessionClicksRef.current,
        }).then((response) => {
            if (response.error) {
                return
            }

            if (response.result && response.result.updateLevel) {
                dispatch(getDispatchObject(SET_LEVEL, response.result.newLevel))
            }

            setClicksStack(() => 0)
        })
    }, [dispatch])

    // const endSession = async () => {
    //   if (clicksStackRef.current === 0) {
    //     return;
    //   }

    //   console.log("end session");
    //   setClicksStack(0);

    //   fetchData("/click/clickEvent", {
    //     count: clicksStackRef.current,
    //     sessionId: sessionIdRef.current,
    //     startSessionMs: startSessionMsRef.current,
    //     lastSessionActivityMs: new Date().getTime(),
    //     totalSessionClicks: totalSessionClicksRef.current,
    //   }).then(() => {
    //     setClicksStack(() => 0);
    //   });
    //   setTotalSessionClicks(0);
    // };

    // On mount and return on unmount
    useEffect(() => {
        setSessionId(crypto.randomUUID())
        setStartSessionMs(new Date().getTime())

        window.addEventListener('beforeunload', sendToServer)

        // Returned function will be called on component unmount
        return () => {
            sendToServer()
            window.removeEventListener('beforeunload', sendToServer)
        }
    }, [sendToServer])

    const checkInactivity = () => {
        const now = new Date().getTime()

        if (
            tapCount.current > 0 &&
            //   now - lastClickAt.current >= MS_INACTIVITY_FOR_SAVE ||
            now - lastSentToServerAt.current >= MS_BETWEEN_BATCHES
        ) {
            sendToServer()
        }
    }

    const handleConnectWallet = async () => {
        setModalType(ModalTypes.CONNECT_WALLET)
        await fetchData('/user/updateLastActivities', { type: 'lastTapAt' })
        setTapAt(new Date().getTime() / 1000)
        setActiveModal(MODAL_INFO, {
            icon: walletIcon,
            iconClass: 'w-[160px] h-[160px]',
            buttonText: 'Connect Wallet',
            description: () => (
                <p className='font-bold text-[20px] text-center'>
                    Connect your wallet to earn
                    <br /> 500,000 Yescoin
                </p>
            ),
        })
    }

    const click = (event: any) => {
        if (isDesktop()) {
            setActiveModal(MODAL_INFO, {
                icon: iconLogo,
                title: 'We are Sorry!',
                buttonText: 'Sure!',
                description: () => (
                    <p>But you can only tap on a mobile device!</p>
                ),
            })
            return
        }
        if (goldPerClick === null) {
            return
        }
        if (tapCount.current === 0) {
            setBatchStartTime(getUnixTime())
        }

        if (energyLeft !== null && energyLeft < 1) {
            if (tapCount.current > 0) {
                sendToServer()
            }
            return
        }

        if (
            (new Date().getTime() / 1000 - tapAt) / (60 * 60 * 24) > 1 &&
            !okxContext.walletAddress
        ) {
            // if tap more than 1 day ago
            // if(true){
            handleConnectWallet()
        }
        clickAnimation(event)

        dispatch(getDispatchObject(ADD_GOLD, goldPerClick))
        dispatch(getDispatchObject(REDUCE_ENERGY_LEFT, goldPerClick))
        setClicksStack((count) => count + 1)
        tapCount.current += 1
        setTotalSessionClicks((count) => count + 1)
        setLastClickTime(new Date().getTime())
        lastClickAt.current = new Date().getTime()

        if (!checkActivityInterval.current) {
            // Check if to send to the server once every 10ms
            checkActivityInterval.current = setInterval(checkInactivity, 10)
        }
    }

    const clickAnimation = (event: any) => {
        let allClickDigits = [...clickDigits]
        if (allClickDigits.length > 50) {
            allClickDigits = allClickDigits.slice(40)
        }

        const cd = {
            //x: event.clientX,
            x: event.touches[0].clientX,
            //y: event.clientY,
            y: event.touches[0].clientY,
            id: Math.random().toString(36),
        }

        allClickDigits.push(cd)

        setClickDigits(() => allClickDigits)
    }

    const getLastActivities = async () => {
        const response = await fetchData('/user/getSettings')
        const { lastTapAt = 0, lastVoteAt = 0 } = response?.result?.settings
        dispatch(
            getDispatchObject(SET_USER_ACTIVTY, response?.result?.settings)
        )
        setTapAt(lastTapAt || 0)
        setVoteAt(lastVoteAt || 0)
    }

    useEffect(() => {
        getLastActivities()
    }, [])

    const handleVoteYescoinModal = async () => {
        setModalType(ModalTypes.VOTE_YESCOIN)
        await fetchData('/user/updateLastActivities', { type: 'lastVoteAt' })
        setVoteAt(new Date().getTime() / 1000)
        setActiveModal(MODAL_INFO, {
            icon: bybitIcon,
            iconClass: 'w-[160px!important] h-[70px!important]',
            buttonText: 'Vote Yescoin!',
            description: () => (
                <p className='font-bold text-[20px] text-center'>
                    Help Yescoin get listed on
                    <br /> Bybit! Your vote in the BYBIT
                    <br /> WSOT event brings us one <br />
                    step closer to this major <br />
                    mileston, and you could even
                    <br /> win a share of the 1M MNT
                    <br />
                    prize pool !
                </p>
            ),
        })
    }

    // useEffect(() => {
    //   if(!screenPopup&&okxContext.walletAddress&&((new Date().getTime()/1000) - voteAt)/(60*60*24)>1) {
    //   // if(true){
    //     handleVoteYescoinModal();
    //   }
    // }, [screenPopup, voteAt, okxContext.walletAddress])

    return (
        <>
            <div className='CoinButton--container'>
                <div
                    onTouchStart={click}
                    onClick={isDesktop() ? click : () => {}}
                    className='CoinButton--content'
                />
            </div>
            <div className='CoinButton--digits--container'>
                {clickDigits.map((digit: any) => (
                    <p
                        key={digit.id}
                        style={{
                            top: digit.y,
                            left: digit.x,
                        }}
                    >
                        {goldPerClick}
                    </p>
                ))}
            </div>
        </>
    )
}

export default CoinButton
