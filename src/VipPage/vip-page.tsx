/* eslint-disable react-hooks/exhaustive-deps */
import React, { useState, useEffect } from 'react';
import './vip-page-css.css';
import image from './../assets/images/other/vip.png';
import { useNavigate } from "react-router-dom";
import { ROUTE_FRIENDS } from "../routes";
import Panel from "../components/Panel/Panel";
import BackgroundGlow from "../components/BackgroundGlow/BackgroundGlow";
import TelegramBackButton from "../components/TelegramBackButton/TelegramBackButton";
import { Button } from "@nextui-org/react";
import IconText from "../components/IconText/IconText";
import { useTranslation } from "react-i18next";
import FriendsListSkeleton from "../panels/Friends/components/FriendsListSkeleton/FriendsListSkeleton";
import { truncateNumber } from "../utils/utils";
import { hideButton, setButtonLoader, setButtonText, showButton } from "../utils/tgButtonUtils";
import { format } from 'date-fns-tz';
import Img from '../components/Img/Img';
import AdBackground from '../assets/images/vip/ad_background.png'

const PartyTime = "2024-11-19T20:00:00";
const TimeZone = "CET";

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
}

type IPlayerProps = {
    rank: number,
    username: string,
    invite_count: number,
    range?: number,
    gold: string
};

// @ts-ignore
const tg = window["Telegram"]['WebApp'];

const PlayerRow = ({ rank, username, invite_count, gold, range }: IPlayerProps) => {

    return (
        <>
            <div className="VipPage--playerRow">
                <div className="VipPage--playerInfo">
                    <div className='player-avator'>
                        <Img src={require("../assets/images/vip/Ellipse2.png")} className='list-avator-img' />
                        <div className={`player-rank-number range_${Number(range) + 1}`}>
                            {rank}
                        </div>
                    </div>
                    <div className={"flex flex-col justify-content-center pb-2"}>
                        <span className="VipPage--playerName">{username}</span>
                        <div className='player-invite-content pt-2'>
                            <IconText
                                size="special"
                                imgPath={require("../assets/images/vip/friends.png")}
                                text={truncateNumber(parseInt(invite_count.toString(), 10))}
                            />
                        </div>
                    </div>
                </div>
                <div className='player-coin'>
                    {truncateNumber(parseInt(gold, 10))}&nbsp;$
                </div>
            </div>
            <hr style={{ borderColor: '#444447' }}></hr>
        </>
    );
};

const PlayerItem = ({ rank, username, invite_count, gold }: IPlayerProps) => {

    const { t } = useTranslation();

    return (
        <div className='vip-player-item-content'>
            <div className='player-avator'>
                <Img src={require("../assets/images/vip/Ellipse2.png")} className='avator-img' />
                <div className='player-rank-number'>
                    {rank}
                </div>
            </div>
            <div className='player-name'>
                {username}
            </div>
            <div className='player-invite-content'>
                <IconText
                    size="special"
                    imgPath={require("../assets/images/vip/friends.png")}
                    text={`${invite_count} ${t("vipFriendsLabel")}`}
                />
            </div>
            <div className='player-coin'>
                {truncateNumber(parseInt(gold, 10))} $
            </div>
        </div>
    );
};


export default function VipPage() {
    const navigate = useNavigate();
    const [visiblePlayers, setVisiblePlayers] = useState(20);
    const { t } = useTranslation();
    const [leaderboardData, setLeaderboardData] = useState<any[]>([]);
    const [loading, setLoading] = useState(false);
    useEffect(() => {
        setLoading(true);
        fetch('https://yescoinleaderboardprod.blr1.cdn.digitaloceanspaces.com/Leaderboard/latest1.json', {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        })
            .then(response => response.json())
            .then(data => {
                setLoading(false);
                setLeaderboardData(data);
            })
            .catch(error => {
                console.error('Error:', error);
            })
        // setLeaderboardData(_leaderboardData)
    }, [])
    const loadMorePlayers = () => {
        setVisiblePlayers(prevVisible => Math.min(prevVisible + 20, leaderboardData.length));
    };

    useEffect(() => {
        const handleScroll = () => {
            if (window.innerHeight + document.documentElement.scrollTop !== document.documentElement.offsetHeight) return;
            loadMorePlayers();
        };

        window.addEventListener('scroll', handleScroll);
        return () => window.removeEventListener('scroll', handleScroll);
    }, []);

    useEffect(() => {
        const navigateToFriends = () => {
            navigate(ROUTE_FRIENDS);
        }
        // @ts-ignore
        tg.MainButton.onClick(navigateToFriends);
        hideButton();
        setTimeout(() => {
            setButtonText(t('inviteAndEarn'));
            showButton();
        }, 50);
        return () => {
            // @ts-ignore
            tg.MainButton.offClick(navigateToFriends);
            hideButton()
        };
    }, []);

    const [timeLeft, setTimeLeft] = useState<TimeLeft>({ days: 15, hours: 60, minutes: 60 });

    const calculateTimeDifference = (eventDate: Date): TimeLeft => {
        const totalMilliseconds = eventDate.getTime() - new Date().getTime();

        const days = Math.floor(totalMilliseconds / (1000 * 60 * 60 * 24));
        const hours = Math.floor((totalMilliseconds % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((totalMilliseconds % (1000 * 60 * 60)) / (1000 * 60));

        return { days, hours, minutes };
    };

    useEffect(() => {
        const calculateTimeLeft = () => {
            const eventDateString = format(new Date(PartyTime), 'yyyy-MM-dd\'T\'HH:mm:ssXXX', { timeZone: TimeZone });
            const eventDateObject = new Date(eventDateString);

            const diff = calculateTimeDifference(eventDateObject);
            setTimeLeft(diff);
        };

        calculateTimeLeft();

        // Update every minute
        const timer = setInterval(calculateTimeLeft, 60000);

        return () => clearInterval(timer);
    }, []);
    const LeftTime = () => {

        return (
            <div className='flex items-center justify-center'>
                <p className='text-[36px] font-bold'>{timeLeft.days}</p>
                <p className='text-[20px] pt-2'>d</p>
                <p className='text-[36px] font-bold px-2'>:</p>
                <p className='text-[36px] font-bold'>{timeLeft.hours} </p>
                <p className='text-[20px] pt-2'>h</p>
                <p className='text-[36px] font-bold px-2'>:</p>
                <p className='text-[36px] font-bold'>{timeLeft.minutes}</p>
                <p className='text-[20px] pt-2'>m</p>
            </div>
        )
    }

    return (
        <Panel>
            <BackgroundGlow
                color1="#1c1c1c"
                color2="#1c1c1c"
                color3="#1c1c1c"
                vertical="bottom"
                fromBottom
            />

            <br />
            <br />
            <TelegramBackButton />
            {loading ? <FriendsListSkeleton /> : leaderboardData.length > 0 ? (
                <div className='vip-top-players-content'>
                    <div className='player-content pt-6 second-player'>
                        {
                            leaderboardData.length > 1 ?
                                <PlayerItem
                                    key={leaderboardData[1].tgid}
                                    rank={leaderboardData[1].rank}
                                    username={leaderboardData[1].username}
                                    invite_count={leaderboardData[1].invite_count}
                                    gold={leaderboardData[1].gold}
                                /> : <></>
                        }
                    </div>
                    <div className='player-content top-player'>
                        {
                            <PlayerItem
                                key={leaderboardData[0].tgid}
                                rank={leaderboardData[0].rank}
                                username={leaderboardData[0].username}
                                invite_count={leaderboardData[0].invite_count}
                                gold={leaderboardData[0].gold}
                            />
                        }
                    </div>
                    <div className='player-content pt-6 third-player'>
                        {
                            leaderboardData.length > 2 ?
                                <PlayerItem
                                    key={leaderboardData[2].tgid}
                                    rank={leaderboardData[2].rank}
                                    username={leaderboardData[2].username}
                                    invite_count={leaderboardData[2].invite_count}
                                    gold={leaderboardData[2].gold}
                                /> : <></>
                        }
                    </div>
                </div>
            ) : <></>
            }
            {loading ? <></> : leaderboardData.length > 0 ? (
                <div className='ad-content'>
                    <div className="ad-div" style={{ backgroundImage: `url(${AdBackground})` }} >
                        <div className='ad-header'>
                            <Img src={require("../assets/images/vip/star5.png")} className='star5-img' />
                            <div className='text'>
                                The Top 300 Leaders
                            </div>
                        </div>
                        <div className='ad-body'>will get a share of</div>
                        <div className='ad-footer'>
                            <Img src={require("../assets/images/vip/Awardamount.png")} className='award-img' />
                            <Img src={require("../assets/images/vip/star3.png")} className='star3-img' />
                        </div>
                    </div>
                </div>
            ) : <></>
            }
            <div className="VipPage--leaderboard-body mt-4">
                {loading ? <></> : <div className='leaders-header'>
                    Top Leaders
                    <hr style={{ borderColor: '#444447' }}></hr>
                </div>}
                {loading ? <FriendsListSkeleton /> : (
                    (leaderboardData.length > 4 && leaderboardData.slice(3, visiblePlayers).map((player, i) => (
                        <PlayerRow
                            key={player.tgid}
                            rank={player.rank}
                            username={player.username}
                            invite_count={player.invite_count}
                            gold={player.gold}
                            range={i - i % 100}
                        />
                    ))
                    ))}
            </div>
            <br></br>
            {visiblePlayers < leaderboardData.length && (
                <Button
                    size="lg"
                    className={"btn-gradient"}
                    onClick={loadMorePlayers}
                    color="primary"
                    fullWidth
                >
                    {t("vipLoadMore")}
                </Button>
            )}
        </Panel>
    );
}


