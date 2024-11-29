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

const PartyTime = "2024-11-19T20:00:00";
const TimeZone = "CET";

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
}


// @ts-ignore
const tg = window["Telegram"]['WebApp'];

const PlayerRow = ({ rank, username, invite_count, gold }: {
    rank: number,
    username: string,
    invite_count: number,
    gold: string
}) => {
    const getRankIcon = (rank: number) => {
        switch (rank) {
            case 1:
                return "🥇";
            case 2:
                return "🥈";
            case 3:
                return "🥉";
            default:
                return rank;
        }
    };
    const { t } = useTranslation();
    return (
        <div className="VipPage--playerRow">
            <div className="VipPage--playerInfo">
                <div className={"team-image-container small flex justify-center items-center relative"}>
                    <div className="VipPage--avatar">
                        <span className={"text-xl"}>{username.charAt(0).toUpperCase()}</span>
                    </div>
                    <span className="VipPage--rank absolute bottom-[-10px] right-[-10px] text-[20px]">{getRankIcon(rank)}</span>
                </div>
                <div className={"flex flex-col"}>
                    <span className="VipPage--playerName">{username}</span>
                    <div className="VipPage--playerStats">
                        <span className="VipPage--miners">{invite_count} {t("vipInvitesLabel")}</span>
                        <IconText
                            size="small"
                            imgPath={require("../assets/images/coins/rocket_coin_back_36x36.png")}
                            text={truncateNumber(parseInt(gold, 10))}
                        />
                    </div>
                </div>
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
            setButtonText(t('friendsInviteButton'));
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
                color1="#FE2B3A"
                color2="#B01908"
                color3="#000"
                vertical="bottom"
                fromBottom
            />
            <TelegramBackButton />
            <div className="VipPage--content">
                <img
                    src={image}
                    alt="VIP Bear"
                    width={200}
                    height={190}
                    className="VipPage--bearImage"
                />
                <h1 className="VipPage--heading text-[24px]">Top 100 Leaders</h1>
                {/* <p className="VipPage--subheading">{t("vipSubTitle")}</p> */}
            </div>

            {/* <button className="VipPage--inviteButton" onClick={() => navigate(ROUTE_FRIENDS)}>
                {t("vipInviteButton")}
            </button> */}
            {/* <LeftTime/> */}

            <div className="VipPage--leaderboard mt-4">
                {loading ? <FriendsListSkeleton /> : (
                    leaderboardData.slice(0, visiblePlayers).map((player) => (
                        <PlayerRow
                            key={player.tgid}
                            rank={player.rank}
                            username={player.username}
                            invite_count={player.invite_count}
                            gold={player.gold}
                        />
                    )
                    ))}
            </div>
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


