import React, { FC, useEffect, useState } from 'react';
import Panel from "../../components/Panel/Panel";
import TelegramBackButton from "../../components/TelegramBackButton/TelegramBackButton";
import Spacing from "../../components/Spacing/Spacing";
import CellContainer from "../../components/CellContainer/CellContainer";
import Cell from "../../components/Cell/Cell";
import Img from "../../components/Img/Img";
import InviteFriend from "./components/InviteFriend/InviteFriend";
import InviteFriendLevel2 from "./components/InviteInfoLevel2/InviteInfoLevel2";
import InviteInfo from "./components/InviteInfo/InviteInfo";
import { useNavigate } from "react-router-dom";
import { ROUTE_VIP_PAGE } from "../../routes";
import FriendsListSkeleton from "./components/FriendsListSkeleton/FriendsListSkeleton";
import { useTranslation } from "react-i18next";
import { fetchData, getTelegramImageUrlPlaceholder } from "../../utils/api";
import EmojiRectangle from "../../components/EmojiRectangle/EmojiRectangle";
import BackgroundGlow from "../../components/BackgroundGlow/BackgroundGlow";
// import FriendIcon from "../../assets/icons/hands.svg";
import DiscoIcon from "../../assets/images/other/disco.png"
import HandshakeIcon from "../../assets/icons/handshake.png"
import SmileEmoji from "../../assets/images/other/smile_emoji.png"
import { parseStringWithNewLine } from "../../utils/utils";
import IconText from "../../components/IconText/IconText";
import { formatNumberWithSpaces } from "../../utils/mathUtils";
import Collapse from '../../components/Collapse';
import { format } from 'date-fns-tz';

const PartyTime = "2024-11-19T20:00:00";
const TimeZone = "CET";

interface TimeLeft {
    days: number;
    hours: number;
    minutes: number;
}

const Friends: FC = () => {

    const [friendsList, setFriendsList] = useState<any | [] | null>(null);
    const [friendsList2, setFriendsList2] = useState<any | [] | null>(null);
    const [loading, setLoading] = useState(false);

    const navigate = useNavigate();
    const { t } = useTranslation();
    useEffect(() => {
        fetchFriends().then()
    }, [])

    const fetchFriends = async () => {
        setLoading(true);

        const response = await fetchData('/friends/get', { isNew: true });
        if (response.error) {
            return;
        }
        setFriendsList(response.result);

        const response2 = await fetchData('/friends/get-level2', { isNew: true });
        if (response2.error) {
            return;
        }
        setFriendsList2(response2.result);

        setLoading(false);
    }

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
                <p className='text-[32px] font-bold'>{timeLeft.days}</p>
                <p className='text-[20px] pt-2'>d</p>
                <p className='text-[32px] font-bold px-2'>:</p>
                <p className='text-[32px] font-bold'>{timeLeft.hours} </p>
                <p className='text-[20px] pt-2'>h</p>
                <p className='text-[32px] font-bold px-2'>:</p>
                <p className='text-[32px] font-bold'>{timeLeft.minutes}</p>
                <p className='text-[20px] pt-2'>m</p>
            </div>
        )
    }

    return (
        <Panel>
            <TelegramBackButton />

            <BackgroundGlow
                color1="#FE2B3A"
                color2="#B01908"
                color3="#000"
                vertical="bottom"
                fromBottom
            />
            <div className={"flex justify-center"}>
                <img src={HandshakeIcon} alt={"friend"} width={"100px"} />
            </div>
            {/* <div className='flex flex-col items-center'>
                <p className={"text-center font-bold text-[32px]"}>Welcome to the</p>
                <div className='flex gap-2 items-center'>
                    <p className={"text-center font-bold text-[32px]"}>YES Party </p>
                    <img src={SmileEmoji} alt={"friend"} width={"33px"}/>
                </div>
            </div> */}
            <Spacing size={18} />
            <div className='flex flex-col items-center'>
                <p className={"text-center text-[18px]"}>If you like Yescoin,</p>
                <p className={"text-center text-[18px]"}>share it with your frens.</p>
                <p className={"text-center text-[18px]"}>If you hate it,</p>
                <p className={"text-center text-[18px]"}>share it with your enemies.</p>
                <br />
                <p className={"text-center text-[18px]"}>Just share it</p>
            </div>
            <Spacing size={34} />

            {/* <p className={"text-center font-bold text-[32px]"}>{parseStringWithNewLine(t("friendsSubTitle"))}</p> */}
            {/* <p className={"text-center"}>{(t("friendsSubTitle2"))}</p> */}
            {/* <Spacing size={18}/> */}
            {/* <LeftTime/> */}

            <InviteInfo />
            <Spacing size={8} />
            <InviteFriendLevel2 />
            {/* <Spacing size={8}/>
            <TopInfo onClick={() => navigate(ROUTE_VIP_PAGE)}/> */}
            <Spacing size={24} />
            <Collapse title={t('friendsList')}>
                {/* <p className={"text-lg text-white mb-2"}>{t('friendsList')}</p> */}
                {loading && <FriendsListSkeleton />}
                {!loading && friendsList !== null && friendsList.friends && friendsList.friends?.length > 0 && (
                    <>
                        {friendsList?.friends?.map((friend: any, index: number) => (
                            friend && <Cell
                                key={index}
                                before={<Img src={getTelegramImageUrlPlaceholder(friend.username)} />}
                                titleColumn
                                title={friend.username ?? friend.name}
                                titleAfter={<IconText
                                    size="small"
                                    centered
                                    imgPath={require('../../assets/images/coins/rocket_coin_back_100x100.png')}
                                    text={formatNumberWithSpaces(friend.gold)}
                                    stretched
                                />}
                            />
                        ))}

                        {friendsList.friends?.length < friendsList.count && (
                            <Cell
                                key={-1}
                                // before={
                                //     <EmojiRectangle>
                                //         <Img src={require("../../assets/images/emoji/users.png")}/>
                                //     </EmojiRectangle>
                                // }
                                title={t('friendsCount') + (friendsList.count - friendsList.friends?.length)}
                            />
                        )}
                    </>
                )}
                {!loading && ((friendsList !== null && friendsList.friends?.length < 1) || !(friendsList?.friends)) && (
                    <div style={{ textAlign: 'center', fontSize: "64px" }}>
                        😢
                        <p className="text-14-medium text-gray">{t('friendsYourFriendsListEmpty')}</p>
                    </div>
                )}
            </Collapse>
            <Spacing size={8} />
            <Collapse title={t('friendsList2')}>
                {/* <p className={"text-lg text-white mb-2"}>{t('friendsList2')}</p> */}
                {loading && <FriendsListSkeleton />}
                {!loading && friendsList2 !== null && friendsList2.friends && friendsList2.friends?.length > 0 && (
                    <>
                        {friendsList2?.friends?.map((friend: any, index: number) => (
                            friend && <Cell
                                key={index}
                                before={<Img src={getTelegramImageUrlPlaceholder(friend.username)} />}
                                titleColumn
                                title={friend.username ?? friend.name}
                                titleAfter={<IconText
                                    size="small"
                                    centered
                                    imgPath={require('../../assets/images/coins/rocket_coin_back_100x100.png')}
                                    text={formatNumberWithSpaces(friend.gold)}
                                    stretched
                                />}
                            />
                        ))}

                        {friendsList2.friends?.length < friendsList2.count && (
                            <Cell
                                key={-1}
                                // before={
                                //     <EmojiRectangle>
                                //         <Img src={require("../../assets/images/emoji/users.png")}/>
                                //     </EmojiRectangle>
                                // }
                                title={t('friendsCount') + (friendsList2.count - friendsList2.friends?.length)}
                            />
                        )}
                    </>
                )}
                {!loading && ((friendsList2 !== null && friendsList2.friends?.length < 1) || !(friendsList2?.friends)) && (
                    <div style={{ textAlign: 'center', fontSize: "64px" }}>
                        😢
                        <p className="text-14-medium text-gray">{t('friendsYourFriendsListEmpty')}</p>
                    </div>
                )}
            </Collapse>

            <Spacing size={80} />

            <InviteFriend />
        </Panel>
    );
};

export default Friends;