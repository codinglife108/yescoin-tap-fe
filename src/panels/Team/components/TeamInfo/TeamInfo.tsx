import { FC, useEffect, useState } from 'react';
import './TeamInfo.css';
import { formatNumberShort, formatNumberWithSpaces } from "../../../../utils/mathUtils";
import IconText from "../../../../components/IconText/IconText";
import { Button } from "@nextui-org/react";
import { useTranslation } from "react-i18next";
import { fetchData } from "../../../../utils/api";

import { useNavigate } from "react-router-dom";
import { ROUTE_TEAM_SETTINGS } from "../../../../routes";
import { copyText } from "../../../../utils/utils";
import { useDispatch } from "react-redux";
import { getDispatchObject, SET_TOAST } from "../../../../store/reducer";
import InviteModal from '../../../../modals/inviteModal';
import iconLogo from "../../../../assets/images/coins/rocket_coin_back_100x100.png";

// @ts-ignore
const tg = window["Telegram"]['WebApp'];

interface TeamInfoProps {
    id: number
    gold: number
    players: number
    role: 'guest' | 'member' | 'admin' | 'owner'
    onJoin: () => void
    onLeave: () => void
}

const TeamInfo: FC<TeamInfoProps> = ({ id, gold, players, role, onJoin, onLeave }) => {
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [openInviteModal, setOpenInviteModal] = useState<boolean>(false);
    const [inviteLink, setInviteLink] = useState<string>('');
    const join = async () => {
        const response = await fetchData(
            '/team/join',
            { id }
        );

        if (response.error) {
            return;
        }

        onJoin();
    }

    const leave = async () => {
        const response = await fetchData(
            '/team/leave',
            { id }
        );

        if (response.error) {
            return;
        }

        onLeave();
    }

    const invite = () => {
        setOpenInviteModal(true);
    }

    const linkSend = () => {
        // @ts-ignore
        tg.openTelegramLink(`https://t.me/share/url?url=${encodeURIComponent(inviteLink)}&text=\n\nYou are invited to participate in yescoin. Click the link above to play`);
        setOpenInviteModal(false);
    }

    const inviteLinkCopied = () => {
        copyText(inviteLink);
        dispatch(getDispatchObject(SET_TOAST, { open: true, message: t('teamInviteLinkCopied'), type: 'success' }));
    }

    useEffect(() => {
        //@ts-ignore
        const link = `${process.env.REACT_APP_TELEGRAM_MINIAPP_URL}?start=t_${tg['initDataUnsafe']['user']['id']}_${id}`;
        console.log(link);
        setInviteLink(link);
    }, [id])

    return (
        <div className="TeamInfo--container">

            <div className="TeamInfo--info">
                <div className="TeamInfo--info--left">

                    <IconText
                        size='specialTeam'
                        imgPath="/rocket_coin_back_36x36.png"
                        text={formatNumberShort(gold)}
                    />

                    <p className="TeamInfo--caption">{t('teamGold')}</p>
                </div>

                <div className="TeamInfo--separator" />

                <div className="TeamInfo--info--right">
                    <p className="TeamInfo--info--right--title">
                        {formatNumberWithSpaces(players)}
                    </p>
                    <p className="TeamInfo--caption">{t('teamPlayers')}</p>
                </div>
            </div>

            <div className="TeamInfo--actions">
                {role === 'guest' && (
                    <Button
                        size="lg"
                        className={"btn-gradient"}
                        onClick={join}
                        color="primary"
                        fullWidth
                    >
                        {t('teamJoin')}
                    </Button>
                )}

                {role === 'member' && (
                    <Button
                        size="lg"
                        onClick={leave}
                        color="secondary"
                        fullWidth
                    >
                        {t('teamLeave')}
                    </Button>
                )}

                {(role === 'admin' || role === 'owner') && (
                    <Button
                        size="lg"
                        onClick={() => navigate(ROUTE_TEAM_SETTINGS)}
                        color="secondary"
                        fullWidth
                    >
                        {t('teamSettings')}
                    </Button>
                )}

                {['member', 'admin', 'owner'].includes(role) && (
                    <Button
                        size="lg"
                        onClick={invite}
                        className={"btn-gradient"}
                        color="primary"
                        fullWidth
                        style={{ marginTop: 16 }}
                    >
                        {t('teamInvite')}
                    </Button>
                )}
            </div>
            {openInviteModal && (
                <InviteModal
                    iconLogo={iconLogo}
                    sendButtonText={t('modalSendButtonLabel')}
                    copyButtonText={t('modalCopyLinkButtonLabel')}
                    containerStyle={{
                        height: "min-content",
                        paddingTop: "20px",
                        paddingBottom: "20px",
                    }}
                    close={() => setOpenInviteModal(false)}
                    sendCallback={linkSend}
                    copyCallback={inviteLinkCopied}
                    itemData={{
                        title: t('inviteToSquad'),
                        subtitle: '',
                    }}
                />
            )}
        </div>
    );
};

export default TeamInfo;