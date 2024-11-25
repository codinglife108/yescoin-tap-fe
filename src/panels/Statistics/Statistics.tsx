import React, {FC, useEffect, useState} from 'react';
import Panel from "../../components/Panel/Panel";
import TelegramBackButton from "../../components/TelegramBackButton/TelegramBackButton";
import Placeholder from "../../components/Placeholder/Placeholder";
import Img from "../../components/Img/Img";
import Cell from "../../components/Cell/Cell";
import EmojiRectangle from "../../components/EmojiRectangle/EmojiRectangle";
import CellContainer from "../../components/CellContainer/CellContainer";
import Spacing from "../../components/Spacing/Spacing";
import {useTranslation} from "react-i18next";
import {fetchData} from "../../utils/api";
import {Skeleton} from "@nextui-org/react";
import BackgroundGlow from "../../components/BackgroundGlow/BackgroundGlow";

const Statistics: FC = () => {

    const [fields, setFields] = useState<any>(null);
    const [fieldsLoading, setFieldsLoading] = useState(false);

    const { t } = useTranslation();

    useEffect(() => {
        fetch().then();
    }, []);

    const fetch = async () => {
        setFieldsLoading(true);

        const response = await fetchData('/statistics/get');

        if (response.error) {
            return;
        }

        setFields(response.result);
        setFieldsLoading(false);
    }

    return (
        <Panel>
            <TelegramBackButton />

            <BackgroundGlow
                color1="rgba(8, 18, 29, 0)"
                color2="rgba(0, 190, 163, .5)"
                vertical="top"
            />

            <Placeholder
                title={t('statisticsTitle')}
            />

            <Spacing size={32} />

            <CellContainer>
                {fieldsLoading && (
                    <>
                        <Skeleton
                            style={{
                                width: '100%',
                                height: 48,
                                borderRadius: 16
                            }}
                        />
                        <Skeleton
                            style={{
                                width: '100%',
                                height: 48,
                                borderRadius: 16,
                                marginTop: 16,
                            }}
                        />
                        <Skeleton
                            style={{
                                width: '100%',
                                height: 48,
                                borderRadius: 16,
                                marginTop: 16,
                            }}
                        />
                    </>
                )}

                {!fieldsLoading && fields !== null && fields.map((field: any, index: number) => (
                    <Cell
                        key={index}
                        title={field.value}
                        before={
                            <EmojiRectangle>
                                <Img
                                    src={require(`../../assets/images/emoji/${field.emoji}.png`)}
                                    radius={0}
                                />
                            </EmojiRectangle>
                        }
                    >
                        {t(field.localeId)}
                    </Cell>
                ))}
            </CellContainer>
        </Panel>
    );
};

export default Statistics;