import React, {FC, useState} from 'react';
import Panel from "../../components/Panel/Panel";
import TelegramBackButton from "../../components/TelegramBackButton/TelegramBackButton";
import Placeholder from "../../components/Placeholder/Placeholder";
import UploadPhoto from "../../components/UploadPhoto/UploadPhoto";
import Spacing from "../../components/Spacing/Spacing";
import {Button, Input} from "@nextui-org/react";
import {ROUTE_TEAM} from "../../routes";
import {useDispatch} from "react-redux";
import {getDispatchObject, SET_TEAM} from "../../store/reducer";
import {fetchDataAxios} from "../../utils/api";
import {useTranslation} from "react-i18next";
import {useNavigate} from "react-router-dom";
import {teamFormChange} from "../../utils/inputValidator";
import BackgroundGlow from "../../components/BackgroundGlow/BackgroundGlow";
import PaneledBackground from "../../components/Panel/PaneledBackground";

const CreateTeam: FC = () => {

    const [file, setFile] = useState<any>(null);
    const [nameInput, setNameInput] = useState("");
    const [linkInput] = useState("");

    const {t} = useTranslation();
    const navigate = useNavigate();
    const dispatch = useDispatch();

    const create = async () => {
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

        const result = await fetchDataAxios('/team/create', {
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
        navigate(ROUTE_TEAM, {replace: true, state : {id: result.result.id}});

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
                <Spacing size={16}/>
                <Placeholder
                    title={t('teamCreateTitle')}
                />

                <Spacing size={4}/>
                <UploadPhoto onUpload={(file) => setFile(file)}/>
                <Spacing size={24}/>

                <>
                    <Input
                        classNames={{
                            inputWrapper: "main-input"
                        }}
                        isRequired
                        size="sm"
                        label={t('teamCreateNameInput')}
                        value={nameInput}
                        onChange={(event) => teamFormChange("name", event, setNameInput)}
                    />
                </>

                <Button
                    className={"btn-gradient mt-8"}
                    size="lg"
                    color="primary"
                    onClick={create}
                    fullWidth
                >
                    {t('teamCreateButton')}
                </Button>
                <Spacing/>

            </PaneledBackground>
        </Panel>
    );
};

export default CreateTeam;