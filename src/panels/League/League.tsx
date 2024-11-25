import React, {useEffect, useState} from 'react';
import {ChevronLeft, ChevronRight} from "@mui/icons-material";
import BackgroundGlow from "../../components/BackgroundGlow/BackgroundGlow";
import league1Icon from "../../assets/league/1.png";
import league2Icon from "../../assets/league/2.png";
import league3Icon from "../../assets/league/3.png";
import league4Icon from "../../assets/league/4.png";
import league5Icon from "../../assets/league/5.png";
import logo from "../../assets/images/coins/rocket_coin_back_36x36.png";
import Panel from "../../components/Panel/Panel";
import "./league.css";
import TelegramBackButton from "../../components/TelegramBackButton/TelegramBackButton";
import {useTranslation} from "react-i18next";
import {useSelector} from "react-redux";
import {DefaultStateType} from "../../store/reducer";
import {formatNumberWithSpaces} from "../../utils/mathUtils";
import IconText from "../../components/IconText/IconText";
import FriendsListSkeleton from "../Friends/components/FriendsListSkeleton/FriendsListSkeleton";

const LEAGUES = [
    {
        name: 'Fudders league',
        minYescoin: 0,
        maxYescoin: 100,
        icon: league1Icon,
        players: [{name: 'Player1', coins: 0}],
        url: "https://yescoinleaderboardprod.blr1.cdn.digitaloceanspaces.com/League/Fudders_league/latest1.json"
    },
    {
        name: 'Jeets league',
        minYescoin: 5000,
        icon: league2Icon,
        url: "https://yescoinleaderboardprod.blr1.cdn.digitaloceanspaces.com/League/Jeets_league/latest1.json"
    },
    {
        name: 'Degens league',
        minYescoin: 100000,
        icon: league3Icon,
        url: "https://yescoinleaderboardprod.blr1.cdn.digitaloceanspaces.com/League/Degens_league/latest1.json"
    },
    {
        name: 'Hodlers league',
        minYescoin: 2000000,
        icon: league4Icon,
        url: "https://yescoinleaderboardprod.blr1.cdn.digitaloceanspaces.com/League/Hodlers_league/latest1.json"
    },
    {
        name: 'Diamond hands league',
        minYescoin: 10000000,
        icon: league5Icon,
        url: "https://yescoinleaderboardprod.blr1.cdn.digitaloceanspaces.com/League/Diamond_hands_league/latest1.json"
    },
];

const PlayerRow = ({name, coins}: { name: string, coins: number }) => (
    <div className="LeagueRankPage--playerRow">
        <div className={"team-image-container small"}>
            <div className="LeagueRankPage--playerRank">
                <img src={logo} alt=""/>
            </div>
        </div>
        <div className="LeagueRankPage--playerInfo">
            <span className="LeagueRankPage--playerName">{name}</span>
            <span className="LeagueRankPage--playerCoins"> <IconText
                size="small"
                imgPath={require("../../assets/images/coins/rocket_coin_back_36x36.png")}
                text={formatNumberWithSpaces(coins)}
            />
            </span>
        </div>
    </div>
);

export default function LeagueRankPage() {
    const [loading, setLoading] = useState(false);
    const [currentLeagueIndex, setCurrentLeagueIndex] = useState(0);
    const [activeTab] = useState('Squads');
    const [players, setPlayers] = useState([]);
    const [isChangingLeague, setIsChangingLeague] = useState(false);
    const {t} = useTranslation();
    const currentLeague = LEAGUES[currentLeagueIndex];
    const level = useSelector((selector: DefaultStateType) => selector.level);
    useEffect(() => {
        if (!level) return;
        const index = LEAGUES.findIndex(e => e.name.toLowerCase() === level.toLowerCase());
        if (index === -1) return;
        setCurrentLeagueIndex(index);
    }, [level])
    useEffect(() => {
        if (!isChangingLeague) {
            setLoading(true);
            fetch(LEAGUES[currentLeagueIndex].url)
                .then(response => response.json())
                .then(data => {
                    setPlayers(data)
                })
                .catch(error => {
                    console.error('Error:', error);
                }).finally(() => setLoading(false));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentLeagueIndex]);
    const changeLeague = (direction: number) => {
        setIsChangingLeague(true);
        setTimeout(() => {
            setCurrentLeagueIndex((prevIndex) => {
                const newIndex = prevIndex + direction;
                return Math.max(0, Math.min(newIndex, LEAGUES.length - 1));
            });
            setIsChangingLeague(false);
        }, 300);
    };

    return (
        <Panel>
            <TelegramBackButton/>
            <BackgroundGlow
                color1="#FE2B3A"
                color2="#B01908"
                color3="#000"
                vertical="bottom"
            />

            <div className="LeagueRankPage--leagueIcon">
                <ChevronLeft className="LeagueRankPage--chevron" onClick={() => changeLeague(-1)}/>
                <div className={`LeagueRankPage--iconWrapper ${isChangingLeague ? 'changing' : ''}`}>
                    <img src={currentLeague.icon || league1Icon} alt="League Trophy"/>
                </div>
                <ChevronRight className="LeagueRankPage--chevron" onClick={() => changeLeague(1)}/>
            </div>

            <h1 className={`LeagueRankPage--leagueName ${isChangingLeague ? 'changing' : ''} capitalize`}>
                {currentLeague.name.replace("league", "")}
            </h1>
            <p className={`LeagueRankPage--leagueDescription ${isChangingLeague ? 'changing' : ''}`}>
                from {currentLeague.minYescoin} Yescoin
            </p>

            <div className="LeagueRankPage--tabsPanel">
                <div className="LeagueRankPage--tabs">
                    <div
                        className="LeagueRankPage--tabIndicator"
                        style={{transform: `translateX(${activeTab === 'Miners' ? '0%' : '0'})`}}
                    ></div>
                    <button
                        className={`LeagueRankPage--tab active`}
                        // onClick={() => setActiveTab('Miners')}
                    >
                        {t("leagueMinersLabel")}
                    </button>
                    {/*<button*/}
                    {/*    className={`LeagueRankPage--tab ${activeTab === 'Squads' ? 'active' : ''}`}*/}
                    {/*    onClick={() => setActiveTab('Squads')}*/}
                    {/*>*/}
                    {/*    {t("leagueSquadsLabel")}*/}
                    {/*</button>*/}
                </div>
            </div>

            <div className="LeagueRankPage--tabsPanel">

                <div className="LeagueRankPage--playerList">
                    {loading ? <FriendsListSkeleton/> : (
                        players.map((player: any, index: number) => (
                                <PlayerRow
                                    key={"player" + index}
                                    name={player.username}
                                    coins={parseInt(player.gold || "0")}
                                />
                            )
                        ))}
                </div>
            </div>
        </Panel>
    );
}