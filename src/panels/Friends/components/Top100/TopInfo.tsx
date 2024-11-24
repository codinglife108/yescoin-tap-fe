import React, {FC} from 'react';
import Cell from "../../../../components/Cell/Cell";
import CellContainer from "../../../../components/CellContainer/CellContainer";
import {useTranslation} from "react-i18next";
import Icon16Chevron from "../../../../assets/icons/Icon16Chevron";

interface InviteInfoProps {
    onClick?: React.MouseEventHandler<HTMLDivElement>
}

const TopInfo: FC<InviteInfoProps> = ({onClick}) => {

    const {t} = useTranslation();

    return (
        <CellContainer small onClick={onClick}>
            <Cell
                smallBefore
                after={<Icon16Chevron/>}
                before={(
                    <span style={{fontSize: '36px'}}>
                      🏅
                    </span>
                )}
                title={'TOP 100'}
            >

                Leaders
            </Cell>
        </CellContainer>
    );
};

export default TopInfo;