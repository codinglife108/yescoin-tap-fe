import React, {FC} from 'react';
import Panel from "../../components/Panel/Panel";
import TelegramBackButton from "../../components/TelegramBackButton/TelegramBackButton";
import InviteInfo from "./components/InviteInfo/InviteInfo";
import Spacing from "../../components/Spacing/Spacing";
import {Table, TableBody, TableCell, TableColumn, TableHeader, TableRow} from '@nextui-org/react';
import IconText from "../../components/IconText/IconText";
import {formatNumberWithSpaces} from "../../utils/mathUtils";
import InviteFriend from "./components/InviteFriend/InviteFriend";
import {useTranslation} from "react-i18next";

const BONUSES: any = [
    { id: 'bronze', name: 'User', gold: 1000 },
    { id: 'silver', name: 'Master', gold: 2000 },
    { id: 'gold', name: 'Grandmaster', gold: 5000 },
    { id: 'diamond', name: 'Elite', gold: 7000 },
    { id: 'platinum', name: 'Legends', gold: 10000 },
];

const FriendsBonus: FC = () => {

    const { t } = useTranslation();

    return (
        <Panel>
            <TelegramBackButton />

            <>
                <h1>{t('friendsBonusTitle')}</h1>
                <Spacing size={32} />
                <InviteInfo/>
            </>

            <Spacing size={56} />

            <>
                <h1>{t('friendsBonusNewLevelTitle')}</h1>
                <Spacing size={32} />

                <Table hideHeader removeWrapper aria-label="Example static collection table">
                    <TableHeader>
                        <TableColumn>Уровень</TableColumn>
                        <TableColumn>Бонус</TableColumn>
                    </TableHeader>

                    <TableBody>
                        <TableRow key="-1">
                            <TableCell className="text-gray">{t('friendsBonusesNewLevelTableLevel')}</TableCell>
                            <TableCell
                                style={{ textAlign: 'right' }}
                                className="text-gray"
                            >
                                {t('friendsBonusesNewLevelTableAmount')}
                            </TableCell>
                        </TableRow>

                        {BONUSES.map((item: any, index: number) => (
                            <TableRow key={index}>
                                <TableCell>
                                    <IconText
                                        size='small'
                                        imgPath={require(`../../assets/images/levels/${item.id}.png`)}
                                        text={item.name}
                                    />
                                </TableCell>
                                <TableCell
                                    style={{
                                        textAlign: 'right',
                                        color: 'var(--yellow_color)',
                                    }}
                                >
                                    + {formatNumberWithSpaces(item.gold)}
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </>

            <InviteFriend />
        </Panel>
    );
};

export default FriendsBonus;