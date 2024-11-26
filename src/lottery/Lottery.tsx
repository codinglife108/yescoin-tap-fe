/* eslint-disable */
import React, { useCallback, useEffect } from 'react'
import Panel from '../components/Panel/Panel'
import BackgroundGlow from '../components/BackgroundGlow/BackgroundGlow'
import TelegramBackButton from '../components/TelegramBackButton/TelegramBackButton'
import Spacing from '../components/Spacing/Spacing'
import BottomLayout from '../components/BottomLayout/BottomLayout'
import Div from '../components/Div/Div'
import LotteryHeader from './LotteryComponents/LotteryHeader'
import './WheelOfLuck.css'
import WheelOfFortune from './WheelOfFortune'
import ModalStories from '../panels/Campaigns/ModalStories'
import { fetchData } from '../utils/api'
import { useDispatch, useSelector } from 'react-redux'
import {
    DefaultStateType,
    getDispatchObject,
    SET_LOTTERY_PRICE,
    SET_TOAST,
} from '../store/reducer'
import { useNavigate } from 'react-router-dom'
import RandomPopupInstantiator from './BottomPopup/BottomPopup'
import { ROUTE_LOTTERY_TUTORIAL, ROUTE_TASKS } from '../routes'
import InformationModal from '../modals/InformationModal'
import {
    hideButton,
    setButtonLoader,
    setButtonText,
    showButton,
    resetMainButton,
} from '../utils/tgButtonUtils'
// @ts-ignore
const tg = window['Telegram']['WebApp']
//1 telegram premium
const Lottery = () => {
    const [prize, setPrize] = React.useState('')
    const [openTutorial, setOpenTutorial] = React.useState(false)
    const [buttonWorking, setButtonWorking] = React.useState(true)
    const [stoppedAnimation, setStoppedAnimation] = React.useState(false)
    const dispatch = useDispatch()
    const [isRotating, setIsRotating] = React.useState(false)
    const [winnedData, setWinnedData] = React.useState(null)
    const [isLoading, setIsLoading] = React.useState(false)
    const [notEnoughYescoin, setNotEnoughYescoin] = React.useState(false)
    const lotteryPrice =
        useSelector((selector: DefaultStateType) => selector.lotteryPrice) || 0
    const gold = useSelector((selector: DefaultStateType) => selector.gold || 0)
    const tickets = useSelector(
        (selector: DefaultStateType) => selector.ticket || 0
    )
    const navigate = useNavigate()
    useEffect(() => {
        console.log('should get info')
        if (lotteryPrice === 0 || !lotteryPrice) {
            fetchData('/wheel/cost').then((res) => {
                console.log(res)
                dispatch(getDispatchObject(SET_LOTTERY_PRICE, res.result?.cost))
            })
        }
    }, [])
    useEffect(() => {
        const isOpenedInSession = localStorage.getItem('termsChecked')
        if (!isOpenedInSession) {
            // setOpenTutorial(true);
            // setButtonWorking(false);
            navigate(ROUTE_LOTTERY_TUTORIAL)
            sessionStorage.setItem('lotteryTutorial', 'true')
        }
    }, [])
    const handleStart = useCallback(() => {
        if (!buttonWorking) return
        if ((isRotating && !stoppedAnimation) || isLoading) return
        console.log(gold, lotteryPrice, 'asdadasdasdasdasds')
        if (gold < parseInt(`${lotteryPrice}`, 10) && tickets < 1) {
            setNotEnoughYescoin(true)
            // dispatch(
            //   getDispatchObject(SET_TOAST, {
            //     open: true,
            //     message: "You don't have enough Yescoin",
            //     type: "error",
            //   })
            // );
            return
        }
        setIsLoading(true)
        fetchData('/wheel/spin').then((res) => {
            console.log(res)
            setIsLoading(false)
            if (res.error) {
                dispatch(
                    getDispatchObject(SET_TOAST, {
                        open: true,
                        message: res.error.description,
                        type: 'error',
                    })
                )
                return
            }
            let type = res.result?.data?.rewardType
            if (type === 'rocket') {
                //get random rocket or rocket_1
                type = Math.random() < 0.5 ? 'rocket' : 'rocket_1'
            }
            if (type === 'spin') {
                //get random spin or spin_1
                type = Math.random() < 0.5 ? 'spin' : 'spin_1'
            }
            setPrize(type)
            setWinnedData(res.result?.data)
            setTimeout(() => {
                setPrize('')
            }, 1000)
        })
    }, [
        buttonWorking,
        isRotating,
        stoppedAnimation,
        isLoading,
        gold,
        lotteryPrice,
        tickets,
    ])
    useEffect(() => {
        resetMainButton()
        hideButton()
        setTimeout(() => {
            showButton()
            setButtonText('Spin & Win')
        }, 50)
        return () => {
            hideButton()
        }
    }, [])
    useEffect(() => {
        if (buttonWorking && (!isRotating || stoppedAnimation) && !isLoading) {
            // // @ts-ignore
            // tg.MainButton.setText("Spin & Win");
            // @ts-ignore
            tg.MainButton.onClick(handleStart)
        } else {
            // @ts-ignore
            tg.MainButton.offClick(handleStart)
        }
        return () => {
            // @ts-ignore
            tg.MainButton.offClick(handleStart)
        }
    }, [
        buttonWorking,
        isRotating,
        stoppedAnimation,
        isLoading,
        gold,
        lotteryPrice,
        tickets,
    ])
    useEffect(() => {
        if ((isRotating && !stoppedAnimation) || isLoading) {
            setButtonLoader(true, false)
            setButtonText('Loading pizes...')
        } else {
            setButtonLoader(false)
            setButtonText('Spin & Win')
        }
    }, [isRotating, stoppedAnimation, isLoading])
    return (
        <>
            <Panel>
                <BackgroundGlow
                    color1='#FE2B3A'
                    color2='#B01908'
                    color3='#000'
                    vertical='bottom'
                />
                <TelegramBackButton />

                <LotteryHeader
                    setOpenTutorial={(data: boolean) => {
                        // setOpenTutorial(data);
                        // if (data) // @ts-ignore
                        // tg.MainButton.setText("Next");
                        // setButtonWorking(!data);
                        navigate(ROUTE_LOTTERY_TUTORIAL)
                    }}
                />

                <Spacing />
                <span
                    className={`Lottery-wheel--container ${
                        isRotating && !stoppedAnimation ? 'active' : ''
                    }`}
                >
                    <WheelOfFortune
                        prize={prize}
                        winnedData={winnedData}
                        rotating={isRotating}
                        setRotating={setIsRotating}
                        animationEnd={stoppedAnimation}
                        setAnimationEnd={setStoppedAnimation}
                    />
                </span>

                <BottomLayout>
                    <Div>
                        <Spacing />
                        <div className='Lottery--terms'>
                            Terms and conditions
                        </div>
                        <Spacing />
                    </Div>
                </BottomLayout>
            </Panel>
            {openTutorial && (
                <ModalStories
                    images={[
                        'https://picsum.photos/200/300',
                        'https://picsum.photos/400/300',
                        'https://picsum.photos/1200/300',
                    ]}
                    fromWheel
                    hasViewedStories={false}
                    taskdata={null}
                    fetchSettings={() => {}}
                    onClose={() => {
                        setOpenTutorial(false)
                        // @ts-ignore
                        tg.MainButton.show()
                        setTimeout(() => {
                            setButtonWorking(true)
                        }, 300)
                    }}
                />
            )}
            <RandomPopupInstantiator />
            {notEnoughYescoin && (
                <InformationModal
                    floatingCenter
                    buttonText={'Earn Yescoin'}
                    isBoost={false}
                    containerStyle={{
                        width: '80vw',
                        height: 'auto',
                        paddingTop: '20px',
                        paddingBottom: '20px',
                    }}
                    close={() => setNotEnoughYescoin(false)}
                    callback={() => {
                        navigate(ROUTE_TASKS)
                        setNotEnoughYescoin(false)
                    }}
                    itemData={{
                        icon: (
                            <img
                                src={'/tear.png'}
                                width={120}
                                alt={'modal-from-bottom'}
                            />
                        ),
                        title: '',
                        Description: () => (
                            <span className='text-center'>
                                <p className='text-white text-center my-6 font-semibold px-6 text-xl'>
                                    I'm sorry you don't have enough Yescoin
                                </p>
                            </span>
                        ),
                        value: 0,
                        level: 1,
                    }}
                />
            )}
        </>
    )
}

export default Lottery
