import React, { useEffect, useState } from 'react'
import Panel from '../../components/Panel/Panel'
import BackgroundGlow from '../../components/BackgroundGlow/BackgroundGlow'
import TelegramBackButton from '../../components/TelegramBackButton/TelegramBackButton'
import { fetchData } from '../../utils/api'
import rocket from '../../assets/lottery/logsLuck/rocket.png'
import spin from '../../assets/lottery/logsLuck/spin.png'
import telegram from '../../assets/lottery/logsLuck/telegram.png'
import usdt from '../../assets/lottery/logsLuck/usdt.png'
import yescoin from '../../assets/lottery/logsLuck/yescoin.png'
import moment from 'moment'
import { useDispatch } from 'react-redux'
import telegramIcon from '../../assets/lottery/telegram/telegram.png'
//@ts-ignore
const tg = window.Telegram.WebApp
const icons = {
    rocket,
    spin,
    'telegram gratis': telegram,
    USDT: usdt,
    yescoin,
}

type WinnersProps = {
    month: string
    won_time: string
    tgid: string
    username: string
    prize: 'spin' | 'telegram gratis' | 'USDT' | 'yescoin' | 'rocket'
    quantity: number
}
const WinnerItem = ({ won_time, username, prize, quantity }: WinnersProps) => {
    const icon = icons[prize]
    const title = prize
        .replace('gratis', 'premium')
        .replace('yescoin', '$Yescoin')
    const dispatch = useDispatch()

    return (
        <div
            className='flex items-center justify-between gap-2 pb-2'
            style={{ borderBottom: '1px solid rgba(255, 255, 255, 0.3)' }}
        >
            <div className='WinnerItem--icon'>
                <img src={icon} alt={title} width={56} height={56} />
            </div>
            <div
                className={
                    'flex flex-col gap-1 flex-1 ' +
                    (title === 'USDT' ? 'WinnerItem--text-gradient' : '')
                }
            >
                <strong
                    className='capitalize'
                    style={{ maxWidth: 80, minWidth: 80 }}
                >
                    {title}
                </strong>
            </div>
            <div className={'flex flex-col gap-1 flex-1 opacity-50  '}>
                <span
                    className='WinnerItem--date capitalize truncate'
                    style={{
                        minWidth: 80,
                        maxWidth: 80,
                        textOverflow: 'ellipsis',
                    }}
                >
                    @{username}
                </span>
            </div>

            <div className='flex flex-col items-end gap-1'>
                <div
                    className='WinnerItem--date text-right opacity-50'
                    style={{ minWidth: 80 }}
                >
                    {timeAgo(won_time).giorni
                        ? timeAgo(won_time).giorni + 'D '
                        : ''}
                    {timeAgo(won_time).ore ? timeAgo(won_time).ore + 'h ' : ''}
                    {timeAgo(won_time).minuti
                        ? timeAgo(won_time).minuti + 'm'
                        : '0m'}
                </div>
                <div className='WinnerItem--date text-right opacity-50'>
                    {'ago'}
                </div>
            </div>
        </div>
    )
}
const JoinButton = () => {
    return (
        <div
            onClick={() =>
                // @ts-ignore
                tg.openTelegramLink('https://t.me/therealyescoin')
            }
            className='Winner--join-button-container flex justify-center items-center gap-3'
        >
            <img src={telegramIcon} alt='telegram' width={56} height={56} />
            <div className='flex flex-col flex-1'>
                <span className='text-white'>Join our community</span>
                <span className='text-white/50 mt-1'>to stay in the loop</span>
            </div>
            <div className='mr-2'>
                <svg
                    width='9'
                    height='10'
                    viewBox='0 0 9 10'
                    fill='none'
                    xmlns='http://www.w3.org/2000/svg'
                >
                    <path
                        d='M8.5625 6.34659L0.5625 9.86932V7.56818L6.03977 5.36932L5.96591 5.48864V5.20455L6.03977 5.32386L0.5625 3.125V0.823863L8.5625 4.34659V6.34659Z'
                        fill='white'
                        fill-opacity='0.5'
                    />
                </svg>
            </div>
        </div>
    )
}
const Winners = () => {
    const [data, setData] = useState<any>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(false)
    useEffect(() => {
        fetchDbData()
    }, [])
    function fetchDbData() {
        fetchData('/wheel/recent_winners')
            .then((res) => {
                if (res.error) return setError(true)
                console.log(res.result)
                setData(res.result?.recent_winners)
                setLoading(false)
            })
            .catch(() => {
                setError(true)
                setLoading(false)
            })
    }

    return (
        <>
            <Panel>
                <BackgroundGlow
                    color1='#000000'
                    color2='#000'
                    vertical='top'
                    fromTop
                />
                <TelegramBackButton />
                <h1 className='Winner--title'>Recent Winners</h1>
                <JoinButton />
                <span className='gap-2 flex flex-col'>
                    {data?.map(
                        (
                            log: Omit<WinnersProps, 'fetchDbData'>,
                            index: number
                        ) => <WinnerItem key={index} {...log} />
                    )}
                </span>
            </Panel>
        </>
    )
}
function timeAgo(dateString: string) {
    const givenDate = new Date(dateString)
    const now = new Date()
    // @ts-ignore
    const diffMs = now - givenDate
    const diffMinutes = Math.floor(diffMs / (1000 * 60))

    const days = Math.floor(diffMinutes / (24 * 60))
    const hours = Math.floor((diffMinutes % (24 * 60)) / 60)
    const minutes = diffMinutes % 60

    return {
        giorni: days,
        ore: hours,
        minuti: minutes,
    }
}
export default Winners
