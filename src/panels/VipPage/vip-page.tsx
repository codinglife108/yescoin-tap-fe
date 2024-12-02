import { useState, useEffect } from 'react'
import InfiniteScroll from 'react-infinite-scroll-component'

import FriendsListSkeleton from '../Friends/components/FriendsListSkeleton/FriendsListSkeleton'
import Panel from '../../components/Panel/Panel'
import BackgroundGlow from '../../components/BackgroundGlow/BackgroundGlow'
import TelegramBackButton from '../../components/TelegramBackButton/TelegramBackButton'
import Img from '../../components/Img/Img'

import { truncateNumber } from '../../utils/utils'
import AdBackground from '../../assets/images/vip/ad_background.png'
import InviteFriend from '../Friends/components/InviteFriend/InviteFriend'
import rawRewardBalances from "./leaderboard_300.json";

interface RewardBalances {
    positions: {
        [key: string]: string; // Maps rank (as a string) to a reward (also a string)
    };
}

type IPlayerProps = {
    rank: number
    username: string
    invite_count: number
    gold: string
}

const RewardBalances: RewardBalances = rawRewardBalances;

const getRankColor = (rank: number) => {
    return rank === 1
        ? 'bg-[#f6be05]'
        : rank === 2
            ? 'bg-[#859eb1]'
            : rank === 3
                ? 'bg-[#f87500]'
                : rank < 100
                    ? 'text-[12px] bg-[#1c1c1c]'
                    : 'text-[11px] bg-[#1c1c1c]'
}

const PlayerRow = ({ rank, username, invite_count, gold }: IPlayerProps) => {
    return (
        <>
            <div className='px-5'>
                <div className='flex justify-between items-center py-[8px]'>
                    <div className='flex w-full justify-start gap-[16px]'>
                        <div className='grid items-center justify-center justify-items-center'>
                            <div className={
                                rank === 1
                                    ? 'visible rounded-50px w-[85px] h-[85px] bg-gray-600 rounded-full flex items-center justify-center'
                                    : 'visible rounded-50px w-[44px] h-[44px] bg-gray-600 rounded-full flex items-center justify-center'
                            }>
                                <span className={"text-xl"}>{username.charAt(0).toUpperCase()}</span>
                            </div>
                            <div
                                className={`max-w-[20px] h-[18px] text-[9px] font-semibold leading-[10px] p-[10px] flex justify-center items-center text-center rounded-full -mt-[15px] ${getRankColor(
                                    rank
                                )}`}
                            >
                                {rank}
                            </div>
                        </div>
                        <div className='flex flex-col justify-center items-start gap-[6px]'>
                            <span className='text-white font-medium leading-[15.73px] text-[13px]'>
                                {username}
                            </span>
                            <div className='flex justify-center items-center gap-[5px] text-[15px] font-normal justify-content-flex-start'>
                                <Img
                                    src={require('../../assets/images/vip/user.png')}
                                    className='w-[15px] h-[15px]'
                                />
                                <p className='text-white text-[13px] font-normal leading-[15.73px]'>
                                    {truncateNumber(
                                        parseInt(invite_count.toString(), 10)
                                    )} frens
                                </p>
                            </div>
                        </div>
                    </div>
                    <div className='pt-[5px] text-white text-[13px] leading-[15.73px] font-medium text-nowrap'>
                        {RewardBalances.positions[rank]}
                    </div>
                </div>
                <hr style={{ borderColor: '#38383B' }}></hr>
            </div>
        </>
    )
}

const PlayerItem = ({ rank, username, invite_count, gold }: IPlayerProps) => {
    return (
        <div>
            <div className='grid place-items-center justify-center'>
                <div className={
                    rank === 1
                        ? 'visible rounded-50px w-[90px] h-[90px] bg-gray-600 rounded-full flex items-center justify-center'
                        : 'visible rounded-50px w-[64px] h-[64px] bg-gray-600 rounded-full flex items-center justify-center'
                }>
                    <span className={"text-xl"}>{username.charAt(0).toUpperCase()}</span>
                </div>
                <p
                    className={`w-[20px] h-[20px] text-xs flex justify-center items-center text-center rounded-full font-medium -mt-[15px] ${getRankColor(
                        rank
                    )}`}
                >
                    {rank}
                </p>
            </div>
            <div className='pt-1 text-[13px] leading-[15.73px] font-bold'>{username}</div>
            <div className='flex justify-center items-center gap-[5px] text-[10px] font-medium text-xs pt-1 leading-[12.1px]'>
                <Img
                    src={require('../../assets/images/vip/user.png')}
                    className='w-[15px] h-[15px]'
                />
                <div>
                    {truncateNumber(parseInt(invite_count.toString(), 10))} frens
                </div>
            </div>
            <p className='text-xs text-white font-medium leading-[14.52px]'>{RewardBalances.positions[rank]}</p>
        </div>
    )
}

export default function VipPage() {
    const [loading, setLoading] = useState(false)

    const [visiblePlayers, setVisiblePlayers] = useState(10)
    const [leaderboardData, setLeaderboardData] = useState<any[]>([])

    useEffect(() => {
        setLoading(true)
        fetch(
            'https://yescoinleaderboardprod.blr1.cdn.digitaloceanspaces.com/Leaderboard/latest.json',
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                },
            }
        )
            .then((response) => response.json())
            .then((data) => {
                setLoading(false)
                setLeaderboardData(data)
            })
            .catch((error) => {
                console.error('Error:', error)
            })
    }, [])

    const loadMorePlayers = () => {
        setVisiblePlayers((prevVisible) =>
            Math.min(
                prevVisible + 10 <= 300 ? prevVisible + 10 : 300,
                leaderboardData.length
            )
        )
    }

    return (
        <Panel style={{ padding: 0 }}>
            <InfiniteScroll
                dataLength={visiblePlayers}
                next={loadMorePlayers}
                hasMore={leaderboardData.length > visiblePlayers}
                height={'100vh'}
                loader={<></>}
                scrollableTarget='panel'
            >
                <BackgroundGlow
                    color1='#1c1c1c'
                    color2='#1c1c1c'
                    color3='#1c1c1c'
                    vertical='bottom'
                    fromBottom
                />
                <TelegramBackButton />
                {loading ? (
                    <FriendsListSkeleton />
                ) : leaderboardData.length > 0 ? (
                    <>
                        <div className='flex justify-around relative mt-[30px] px-[23px]'>
                            <div className='w-1/3 grid place-items-center text-center pt-6'>
                                <PlayerItem
                                    key={leaderboardData[1].tgid}
                                    rank={leaderboardData[1].rank}
                                    username={leaderboardData[1].username}
                                    invite_count={
                                        leaderboardData[1].invite_count
                                    }
                                    gold={leaderboardData[1].gold}
                                />
                            </div>
                            <div className='w-1/3 grid place-items-center text-center'>
                                {
                                    <PlayerItem
                                        key={leaderboardData[0].tgid}
                                        rank={leaderboardData[0].rank}
                                        username={leaderboardData[0].username}
                                        invite_count={
                                            leaderboardData[0].invite_count
                                        }
                                        gold={leaderboardData[0].gold}
                                    />
                                }
                            </div>
                            <div className='w-1/3 grid place-items-center text-center pt-6'>
                                {leaderboardData.length > 2 ? (
                                    <PlayerItem
                                        key={leaderboardData[2].tgid}
                                        rank={leaderboardData[2].rank}
                                        username={leaderboardData[2].username}
                                        invite_count={
                                            leaderboardData[2].invite_count
                                        }
                                        gold={leaderboardData[2].gold}
                                    />
                                ) : (
                                    <></>
                                )}
                            </div>
                        </div>
                        <div className='mt-[30px] mx-[20px] relative'>
                            <div
                                className='bg-cover bg-center grid place-content-center place-items-center rounded-[10px] gap-[8px] p-[20px]'
                                style={{
                                    backgroundImage: `url(${AdBackground})`,
                                }}
                            >
                                <div className='relative'>
                                    <Img radius={0}
                                        src={require('../../assets/images/vip/star5.png')}
                                        className='absolute w-[30px] left-[-45px] rounded-none'
                                    />
                                    <p className='text-lg font-medium text-white leading-[21.78px] text-center grid content-center items-center justify-center'>
                                        The Top 300 Leaders
                                    </p>
                                </div>
                                <div className='text-[13px] leading-[15.73px] font-normal text-white grid content-center items-center justify-center'>
                                    will get a share of
                                </div>
                                <div className='mt-[10px] font-normal flex relative'>
                                    <Img
                                        src={require('../../assets/images/vip/amount.png')}
                                    />
                                    <Img radius={0}
                                        src={require('../../assets/images/vip/star3.png')}
                                        className='absolute right-0 bottom-[30%] w-[22px] rounded-none'
                                    />
                                </div>
                            </div>
                        </div>
                        <div className='bg-[#2c2c2e] rounded-tl-[16px] rounded-tr-[16px] mt-[30px] relative'>
                            <p className='text-center py-[20px] border-b-[1px] border-[#444447] grid text-lg font-medium leading-[21.78px]'>
                                Top Leaders
                            </p>
                            {leaderboardData
                                .slice(3, visiblePlayers)
                                .map((player, i) => (
                                    <PlayerRow
                                        key={player.tgid}
                                        rank={player.rank}
                                        username={player.username}
                                        invite_count={player.invite_count}
                                        gold={player.gold}
                                    />
                                ))}
                        </div>
                    </>
                ) : (
                    <></>
                )}
            </InfiniteScroll>
            <InviteFriend />
        </Panel>
    )
}
