import React, { FC } from 'react'
import Tab from '../Tab/Tab'
import Img from '../../../../components/Img/Img'
import Tabbar from '../Tabbar/Tabbar'
import { useNavigate } from 'react-router-dom'
import {
    ROUTE_BOOSTS,
    ROUTE_FRIENDS,
    ROUTE_TASKS,
    ROUTE_EXCHANGES,
    ROUTE_LOTTERY,
} from '../../../../routes'
import FriendIcon from '../../../../assets/icons/hands.svg'
import LotteryIcon from '../../../../assets/icons/lottery.png'
interface NavigationProps {}

const Navigation: FC<NavigationProps> = () => {
    const navigate = useNavigate()
    return (
        <Tabbar>
            <Tab
                icon={
                    <Img
                        radius={0}
                        src={require('../../../../assets/images/emoji/money.png')}
                    />
                }
                // name={t('navbarTasks')}
                onClick={() => navigate(ROUTE_TASKS)}
            />
            <Tab
                icon={
                    <Img
                        radius={0}
                        src={require('../../../../assets/images/emoji/rocket.png')}
                    />
                }
                onClick={() => navigate(ROUTE_BOOSTS)}
            />
            <Tab
                icon={<Img radius={0} width={24} src={FriendIcon} />}
                onClick={() => navigate(ROUTE_FRIENDS)}
            />
            <Tab
                icon={
                    <Img
                        radius={0}
                        src={require('../../../../assets/icons/exclamation_gift_box.png')}
                    />
                }
                onClick={() => navigate(ROUTE_EXCHANGES)}
            />
            {/* <Tab
                icon={<Img radius={0} src={LotteryIcon} />}
                onClick={() => navigate(ROUTE_LOTTERY)}
            /> */}
        </Tabbar>
    )
}

export default Navigation
