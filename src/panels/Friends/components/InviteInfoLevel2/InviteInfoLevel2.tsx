import React, { FC } from 'react';
import Cell from "../../../../components/Cell/Cell";
import Img from "../../../../components/Img/Img";
import IconText from "../../../../components/IconText/IconText";
import CellContainer from "../../../../components/CellContainer/CellContainer";
import { useTranslation } from "react-i18next";

interface InviteInfoProps {
    onClick?: React.MouseEventHandler<HTMLDivElement>
}

const InviteInfo: FC<InviteInfoProps> = ({ onClick }) => {

    const { t } = useTranslation();

    return (
        <CellContainer small onClick={onClick}>
            <Cell
                smallBefore
                before={<div className='rounded-[16px] bg-[#00000080] p-2'><Img src={require('../../../../assets/icons/handshake.png')} /></div>}
                title={t('friendsInviteTitle2')}
            >
                <IconText
                    size="small"
                    imgPath={require('../../../../assets/images/coins/rocket_coin_back_100x100.png')}
                    text="3000"
                    textColor={"#fff"}
                />
                <span className={"text-sm"}>
                    {t('friendsInviteBenefit2')}
                </span>
            </Cell>
        </CellContainer>
    );
};

export default InviteInfo;