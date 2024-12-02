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
                                    : 'visible rounded-50px w-[64px] h-[64px] bg-gray-600 rounded-full flex items-center justify-center'
                            }>
                                <span className={"text-xl"}>{username.charAt(0).toUpperCase()}</span>
                            </div>
                            <div
                                className={`p-[5px] w-[25px] h-[25px] flex justify-center items-center text-center rounded-full font-semibold -mt-[15px] ${getRankColor(
                                    rank
                                )}`}
                            >
                                {rank}
                            </div>
                        </div>
                        <div className='flex flex-col justify-center items-start gap-[6px]'>
                            <span className='text-white font-bold text-[1rem]'>
                                {username}
                            </span>
                            <div className='flex justify-center items-center gap-[5px] text-[15px] font-normal justify-content-flex-start'>
                                <Img
                                    src={require('../../assets/images/vip/user.png')}
                                    className='w-[25px] h-[25px]'
                                />
                                <div>
                                    {truncateNumber(
                                        parseInt(invite_count.toString(), 10)
                                    )} frens
                                </div>
                            </div>
                        </div>
                    </div>
                    <div className='pt-[5px] text-[16px]'>
                        {truncateNumber(parseInt(RewardBalances.positions[rank], 10))}&nbsp;$
                    </div>
                </div>
                <hr style={{ borderColor: '#444447' }}></hr>
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
                        ? 'visible rounded-50px w-[85px] h-[85px] bg-gray-600 rounded-full flex items-center justify-center'
                        : 'visible rounded-50px w-[64px] h-[64px] bg-gray-600 rounded-full flex items-center justify-center'
                }>
                    <span className={"text-xl"}>{username.charAt(0).toUpperCase()}</span>
                </div>
                <p
                    className={`p-[5px] w-[25px] h-[25px] flex justify-center items-center text-center rounded-full font-semibold -mt-[15px] ${getRankColor(
                        rank
                    )}`}
                >
                    {rank}
                </p>
            </div>
            <div className='pt-2.5 text-[20px] font-bold'>{username}</div>
            <div className='flex justify-center items-center gap-[5px] text-[15px] font-normal pt-3.5'>
                <Img
                    src={require('../../assets/images/vip/user.png')}
                    className='w-[25px] h-[25px]'
                />
                <div>
                    {truncateNumber(parseInt(invite_count.toString(), 10))} frens
                </div>
            </div>
            <div>{truncateNumber(parseInt(RewardBalances.positions[rank], 10))} $</div>
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
                <br />
                <br />
                <TelegramBackButton />
                {loading ? (
                    <FriendsListSkeleton />
                ) : leaderboardData.length > 0 ? (
                    <>
                        <div className='flex justify-around relative'>
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
                        <div className='p-[1rem] pt-[3rem] relative'>
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
                                    <div className='text-[21px] font-bold grid content-center items-center justify-center'>
                                        The Top 300 Leaders
                                    </div>
                                </div>
                                <div className='text-[19px] font-normal grid content-center items-center justify-center'>
                                    will get a share of
                                </div>
                                <div className='text-[19px] font-normal flex relative'>
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
                        <div className='bg-[#2c2c2e] rounded-tl-[16px] rounded-tr-[16px] mt-4 relative'>
                            <div className='text-center py-[1.5rem] border-b-[1px] border-[#444447] grid text-[25px] font-bold'>
                                Top Leaders
                            </div>
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
