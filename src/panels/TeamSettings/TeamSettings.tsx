import React, {FC, useCallback, useEffect, useState} from 'react';
import Panel from "../../components/Panel/Panel";
import TelegramBackButton from "../../components/TelegramBackButton/TelegramBackButton";
import Placeholder from "../../components/Placeholder/Placeholder";
import UploadPhoto from "../../components/UploadPhoto/UploadPhoto";
import Spacing from "../../components/Spacing/Spacing";
import {Button, Input} from "@nextui-org/react";
import Div from "../../components/Div/Div";
import {ROUTE_HOME, ROUTE_TEAM} from "../../routes";
import BottomLayout from "../../components/BottomLayout/BottomLayout";
import {useDispatch, useSelector} from "react-redux";
import {DefaultStateType, getDispatchObject, SET_TEAM} from "../../store/reducer";
import {fetchData, fetchDataAxios} from "../../utils/api";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {teamFormChange} from "../../utils/inputValidator";
import BackgroundGlow from "../../components/BackgroundGlow/BackgroundGlow";
import useKeyboardStatus from "../../utils/useKeyboardStatus";
import AreYouSureModal from "../../components/AreYouSureModal/AreYouSureModal";
import PaneledBackground from "../../components/Panel/PaneledBackground";


//todo stringhe nel locale / aggiornare dati / vedere perche non riconosce l appartenenza nella route team neanche quando entro
const TeamSettings: FC = () => {
    const isKeyboardOpen = useKeyboardStatus()
    const [file, setFile] = useState<any>(null);
    const [nameInput, setNameInput] = useState("");
    const [linkInput, setLinkInput] = useState("");
    const [openFeedbackModal, setOpenFeedbackModal] = useState(false);
    const [feedbackText, setFeedbackText] = useState("");
    const [feedbackCallback, setFeedbackCallback] = useState<any>(null);

    const {t} = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const rocket = useSelector((selector: DefaultStateType) => selector.rocket);
    const team = useSelector((selector: DefaultStateType) => selector.team);

    const initTeamSettings = useCallback(() => {
        if (team === 'no' || !team) {
            return;
        }

        setNameInput(team.name);
        setLinkInput(team.link ?? "");
    }, [team])

    useEffect(() => {
        initTeamSettings();
    }, [initTeamSettings]);
    const leave = async () => {
        const response = await fetchData(
            '/team/leave',
            // @ts-expect-error team props è dichiarato male
            {id: team.id}
        );

        if (response.error) {
            return;
        }

        onLeave();
    }
    const deleteTeam = async () => {
        const response = await fetchData(
            '/team/delete',
            // @ts-expect-error team props è dichiarato male
            {id: team.id}
        );

        if (response.error) {
            return;
        }

        onLeave();
    }
    const onLeave = () => {
        dispatch(getDispatchObject(SET_TEAM, 'no'));
        navigate(ROUTE_HOME);
    }

    const update = async () => {
        // @ts-ignore
        const tg = window['Telegram'].WebApp;

        if (nameInput.length < 2) {
            // @ts-ignore
tg.showAlert(t('teamCreateMinimumLengthError'));
            return;
        }

        const linkRegex = /^(?:https?:\/\/)?(?:\w+\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/\S*)?$/;
        if (!linkRegex.test(linkInput) && linkInput.length > 0) {
            // @ts-ignore
tg.showAlert(t('teamCreateInvalidLinkError'));
            return;
        }

        if (rocket === null) {
            return;
        }

        if (linkInput.length > 0 && rocket < 1) {
            // @ts-ignore
tg.showAlert(t('teamCreateNotEnoughROCKETError'));
            return;
        }

        const result = await fetchDataAxios('/team/update', {
            file,
            teamName: nameInput,
            link: linkInput || null,
        });

        if (result.error) {
            // @ts-ignore
tg.showAlert('Server error, try again');
            return;
        }

        dispatch(getDispatchObject(SET_TEAM, result.result));
        navigate(ROUTE_TEAM, {state : {id: result.result.id}});

    }

    return (
        <Panel>
            <PaneledBackground>
                <TelegramBackButton/>
                <BackgroundGlow
                    color1="#FE2B3A"
                    color2="#B01908"
                    color3="#000"
                    vertical="bottom"
                />
                <Placeholder
                    title={t('teamSettingsTitle')}
                />

                <Spacing size={50}/>
                <UploadPhoto onUpload={(file) => setFile(file)}/>
                <Spacing size={24}/>
                <>
                    <Input
                        isRequired
                        classNames={{
                            inputWrapper: "bg-gray-800",
                        }}
                        size="md"
                        label={t('teamCreateNameInput')}
                        value={nameInput}
                        onChange={(event) => teamFormChange("name", event, setNameInput)}
                    />

                    <Spacing/>
                    <div className={"flex items-center w-full gap-1"}>
                        <Button onClick={() => {
                            setFeedbackText("Are you sure you want leave your current team to join another one? Remember, if you are the owner of your current team, once you leave it, you will no longer be the owner.");
                            setOpenFeedbackModal(true);
                            setFeedbackCallback(() => leave)
                        }} className={"bg-transparent flex-1"}>
                            Leave Team
                        </Button>
                        <Button onClick={() => {
                            setFeedbackText("Are you sure you want to delete your team to? Remember, this action cannot be undone.");
                            setOpenFeedbackModal(true);
                            setFeedbackCallback(() => deleteTeam)
                        }} className={"btn-gradient flex-1"}>
                            Delete Team
                        </Button>
                    </div>
                    {/*<Input*/}
                    {/*    size="sm"*/}
                    {/*    label={t('teamCreateLinkInput')}*/}
                    {/*    value={linkInput}*/}
                    {/*    onChange={(event) => teamFormChange("link", event, setLinkInput)}*/}
                    {/*/>*/}
                    {/*<Spacing size={8} />*/}
                    {/*<p className="text-14-medium text-gray">{t('teamCreateLinkInputDescription')}</p>*/}
                </>

                <BottomLayout>
                    {!isKeyboardOpen && <Div>
                        <Button
                            color="primary"
                            className={"btn-gradient"}
                            onClick={() => {
                                setFeedbackText("Are you sure you want make this change?");
                                setOpenFeedbackModal(true);
                                setFeedbackCallback(() => update)
                            }}
                            fullWidth
                        >
                            {t('teamSettingsSaveButton')}
                        </Button>
                    </Div>}
                    <Spacing/>
                </BottomLayout>
                {openFeedbackModal && <AreYouSureModal
                    onClose={() => setOpenFeedbackModal(false)}
                    onConfirm={() => {
                        if (feedbackCallback)
                            feedbackCallback()
                    }}
                    onCancel={() => setOpenFeedbackModal(false)}
                    message={feedbackText}/>}
            </PaneledBackground>
        </Panel>
    );
};

export default TeamSettings;