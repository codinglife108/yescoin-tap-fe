import React, { FC } from 'react';
import CellContainer from "../../../../components/CellContainer/CellContainer";
import { useTranslation } from "react-i18next";
import HallOfFame from "../../../../assets/images/vip/hall_of_fame.png"
import Icon16Chevron from '../../../../assets/icons/Icon16Chevron';

interface InviteInfoProps {
    onClick?: React.MouseEventHandler<HTMLDivElement>
    extraStyle?: any
}

const TopInfo: FC<InviteInfoProps> = ({ onClick, extraStyle }) => {

    const { t } = useTranslation();

    return (
        <CellContainer small onClick={onClick} extraStyle={extraStyle ? extraStyle : {}}>
            <div className='flex justify-center items-center gap-7'>
                <img src={HallOfFame} alt={"friend"} width={"64px"} />
                {t('tenKInPrizes')}
            </div>
            <Icon16Chevron />
        </CellContainer>
    );
};

export default TopInfo;