import React, { FC } from 'react';
import CellContainer from "../../../../components/CellContainer/CellContainer";
import { useTranslation } from "react-i18next";
import HallOfFame from "../../../../assets/images/vip/hall_of_fame.png"

interface InviteInfoProps {
    onClick?: React.MouseEventHandler<HTMLDivElement>
    extraStyle?: any
}

const TopInfo: FC<InviteInfoProps> = ({ onClick, extraStyle }) => {

    const { t } = useTranslation();

    return (
        <CellContainer small onClick={onClick} extraStyle={extraStyle ? extraStyle : {}}>
            <img src={HallOfFame} alt={"friend"} width={"64px"} />
            10,000$ in prizes
        </CellContainer>
    );
};

export default TopInfo;