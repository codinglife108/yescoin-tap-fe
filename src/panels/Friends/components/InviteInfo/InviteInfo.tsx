import React, { FC } from 'react'
import Cell from '../../../../components/Cell/Cell'
import Img from '../../../../components/Img/Img'
import IconText from '../../../../components/IconText/IconText'
import CellContainer from '../../../../components/CellContainer/CellContainer'
import { useTranslation } from 'react-i18next'

interface InviteInfoProps {
    onClick?: React.MouseEventHandler<HTMLDivElement>
}

const InviteInfo: FC<InviteInfoProps> = ({ onClick }) => {
    const { t } = useTranslation()

    return (
        <CellContainer small onClick={onClick}>
            <Cell
                smallBefore
                before={
                    <div className='rounded-[16px] bg-[#00000080] p-2'>
                        <Img
                            src={require('../../../../assets/icons/handshake.png')}
                        />
                    </div>
                }
                title={t('friendsInviteTitle')}
            >
                <div className='flex flex-col'>
                    <IconText
                        size='small'
                        imgPath={require('../../../../assets/images/coins/rocket_coin_back_100x100.png')}
                        text='15,000'
                        textColor={'#fa0'}
                    />
                    {/* <p className='pl-5 font-medium' style={{ textDecoration: 'line-through', textDecorationColor: '#fa0', textDecorationThickness: '2px' }}>15,000</p> */}
                </div>
                <span className={'text-sm'}>{t('friendsInviteBenefit')}</span>
            </Cell>
        </CellContainer>
    )
}

export default InviteInfo
