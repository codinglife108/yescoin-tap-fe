import React, { useEffect } from 'react';
import Panel from "../../components/Panel/Panel";
import BottomLayout from "../../components/BottomLayout/BottomLayout";
import Div from "../../components/Div/Div";
import Spacing from "../../components/Spacing/Spacing";
import EnergyBar from "./components/EnergyBar/EnergyBar";
import CoinButton from "./components/CoinButton/CoinButton";
import ScoreBar from "./components/ScoreBar/ScoreBar";
import MyTeamButton from "./components/MyTeamButton/MyTeamButton";
import Navigation from "./components/Navigation/Navigation";
import BackgroundGlow from "../../components/BackgroundGlow/BackgroundGlow";
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { ROUTE_VIP_PAGE } from '../../routes';
import TopInfo from '../Friends/components/Top100/TopInfo';
//push
const Home = ({ fetchUserInfo, isInitialized, taskUrl }: { fetchUserInfo?: () => Promise<void>, isInitialized: boolean, taskUrl: string | null }) => {
    useEffect(() => {
        if (fetchUserInfo && isInitialized) {
            fetchUserInfo();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [fetchUserInfo]);
    const navigate = useNavigate();
    const viewedSuperTask = useSelector((state: any) => state.viewedSuperTask);
    useEffect(() => {
        if (taskUrl && (!viewedSuperTask || taskUrl.split("/")[2] !== viewedSuperTask)) {
            navigate(taskUrl);
        }
    }, [taskUrl])
    return (
        <Panel>
            <BackgroundGlow
                color1="#FE2B3A"
                color2="#B01908"
                color3="#000"
                vertical="bottom"
            />

            <TopInfo onClick={() => navigate(ROUTE_VIP_PAGE)} extraStyle={{ background: "#1f1f1f", padding: 16, display: 'flex', fontSize: 18, fontWeight: 600, cursor: 'pointer', paddingTop: 8, paddingBottom: 8, justifyContent: 'space-between', alignItems: 'center' }} />
            {/* <MyTeamButton /> */}

            <Spacing size={window.innerHeight / 800 * 6} />
            <ScoreBar />
            <Spacing size={18} />

            <BottomLayout>
                <CoinButton />

                <Div>
                    <EnergyBar />
                    <Spacing />
                    <Navigation />
                </Div>

                <Spacing />
            </BottomLayout>
        </Panel>
    );
};

export default Home;