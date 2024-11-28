import React, { FC, lazy, useCallback, useEffect } from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import Home from "./panels/Home/Home";
import Teams from "./panels/Teams/Teams";
import {
    ROUTE_ADMIN,
    ROUTE_BALANCE,
    ROUTE_BOOSTS,
    ROUTE_CREATE_TEAM,
    ROUTE_FRIENDS,
    ROUTE_FRIENDS_BONUS,
    ROUTE_GOLD_SWAP,
    ROUTE_HOME,
    ROUTE_LEAGUE, ROUTE_LOTTERY,
    ROUTE_STATISTICS, ROUTE_SUPERTASKS,
    ROUTE_TASKS,
    ROUTE_REQUIRE_INPUT,
    ROUTE_TEAM,
    ROUTE_TEAM_SETTINGS,
    ROUTE_TEAMS, ROUTE_VIP_PAGE,
    ROUTE_EXCHANGES,
    ROUTE_LOG_OF_LUCK,
    ROUTE_WINNERS,
    ROUTE_WIN_LOTTERY,
    ROUTE_LOTTERY_TUTORIAL,
    ROUTE_LOG_OF_LUCK_DETAIL,
    ROUTE_BLOCKGAME
} from "./routes";
import CreateTeam from "./panels/CreateTeam/CreateTeam";
import GoldSwap from "./panels/GoldSwap/GoldSwap";
import Friends from "./panels/Friends/Friends";
import Team from "./panels/Team/Team";
import Boosts from "./panels/Boosts/Boosts";
import Statistics from "./panels/Statistics/Statistics";
import FriendsBonus from "./panels/Friends/FriendsBonus";
import { fetchData } from "./utils/api";
import {
    DefaultStateType,
    getDispatchObject,
    SET_AMBASSADOR_STATUS,
    SET_AUTOCLICK_LAST_ACTIVITY_MS,
    SET_DAILY_ENERGY,
    SET_ENERGY_LEFT,
    SET_GOLD,
    SET_GOLD_PER_CLICK,
    SET_LEVEL,
    SET_ROCKET,
    SET_SCREEN_POPUP,
    SET_TEAM,
    SET_TICKET,
    SET_USDT,
} from "./store/reducer";
import { useDispatch, useSelector } from "react-redux";
import BoostBuyConfirmModal from "./modals/BoostBuyConfirmModal";
import TaskChannelModal from "./modals/TaskChannelModal";
import ReferralLinkModal from "./modals/ReferralLinkModal";
import TeamSettings from "./panels/TeamSettings/TeamSettings";
import ScreenLoader from "./components/ScreenLoader/ScreenLoader";
import Admin from "./panels/Admin/Admin";
import AdminTaskModal from "./modals/AdminTaskModal";
import BoostEnergyModal from "./modals/BoostEnergyModal";
import Balance from "./panels/Balance/Balance";
import League from "./panels/League/League";
import Exchanges from "./panels/Exchanges";
import BlockGame from "./panels/BlockGame";

import ReactGA from "react-ga4";
import VipPage from "./VipPage/vip-page";
import useDebounce from "./utils/debounce";
import Lottery from "./lottery/Lottery";
import BonusMalus from "./modals/BonusMalus";
import CampaignsComponent from "./panels/Campaigns/Campaigns";
import SuperTasks from "./panels/Campaigns/SuperTasks";
import RequireInput from "./panels/Campaigns/components/RequireInput";
import ModalInfo from "./modals/ModalInfo";
import WalletConnectModal from "./modals/WalletConnectModal";
import CustomToast from "./modals/CustomToast";
import LogsOfLuck from "./lottery/LogOfLucks/LogsOfLucks";
import Winners from "./lottery/Winners/Winners";
import WinnerPage from "./lottery/WinnerPage";
import TutorialPage from "./lottery/TutorialPage/TutorialPage";
import LogsOfLuckList from "./lottery/LogOfLucks/LogsOfLuckList";
// import "./utils/polyfill"
// @ts-ignore
const App: FC = () => {
    ReactGA.initialize("G-NXPKVZW1CW");

    const [isInitialized, setIsInitialized] = React.useState(false);
    const [showBonusMalusModal, setShowBonusMalusModal] = React.useState(false);
    const [bonusMalusValue, setBonusMalusValue] = React.useState(0);
    const [taskUrl, setTaskUrl] = React.useState<string | null>(null);
    const dispatch = useDispatch();

    const selector = useSelector((s: DefaultStateType) => s);

    // Debounced function to dispatch energy update
    const debouncedDispatchEnergy = useDebounce((newEnergy: number) => {
        dispatch(getDispatchObject(SET_ENERGY_LEFT, newEnergy));
    }, 300);
    // 300ms debounce interval
    const fetchUserInfo = useCallback(async () => {
        const response = await fetchData("/user/getInfo");

        const { teamData, scoreData, taskId, isAmbassador } = response.result;
        setBonusMalusValue(scoreData.gold - scoreData.oldGold);
        dispatch(getDispatchObject(SET_LEVEL, scoreData?.level));
        dispatch(getDispatchObject(SET_GOLD, scoreData.gold));
        dispatch(getDispatchObject(SET_USDT, scoreData.usdt));
        dispatch(getDispatchObject(SET_ROCKET, scoreData.rocket));
        dispatch(getDispatchObject(SET_ENERGY_LEFT, scoreData.energyLeft));
        dispatch(getDispatchObject(SET_DAILY_ENERGY, scoreData.dailyEnergy));
        dispatch(getDispatchObject(SET_GOLD_PER_CLICK, scoreData.goldPerClick));
        console.log(scoreData.tickets)
        dispatch(getDispatchObject(SET_TICKET, scoreData.tickets));
        dispatch(
            getDispatchObject(
                SET_AUTOCLICK_LAST_ACTIVITY_MS,
                scoreData.lastAutoClickActivityMs
            )
        );
        if (taskId) {
            setTaskUrl(`${ROUTE_SUPERTASKS}/${taskId}`);
        }
        dispatch(getDispatchObject(SET_TEAM, teamData));
        dispatch(getDispatchObject(SET_AMBASSADOR_STATUS, isAmbassador));
    }, [dispatch])

    const init = useCallback(async () => {

        const isInMaintainance = await getMaintainanceStatus();
        if (isInMaintainance) {
            dispatch(getDispatchObject(SET_SCREEN_POPUP, "maintainance"));
            return;
        }

        dispatch(getDispatchObject(SET_SCREEN_POPUP, "connection"));

        const response = await fetchData("/bot/origin");
        if (response.result === "OLD_BOT") {
            dispatch(getDispatchObject(SET_SCREEN_POPUP, "botMigration"));
            return;
        }

        await fetchUserInfo();
        setInterval(() => dispatch(getDispatchObject(SET_SCREEN_POPUP, null)), 1000);
        return;
    }, [dispatch, fetchUserInfo]);

    useEffect(() => {
        if (isInitialized) {
            setShowBonusMalusModal(true);
        }
    }, [isInitialized]);

    useEffect(() => {
        init().then(() => setIsInitialized(true));
    }, [init]);

    const getMaintainanceStatus = async () => {
        const url = `${process.env.REACT_APP_API_URL}/status`;
        const response = await fetch(url);
        const result = await response.json();
        if (result.status === "ok") {
            if (result.payload.inMaintainance === true) {
                return true;
            }
        }

        return false;
    };

    useEffect(() => {
        if (!isInitialized) {
            return;
        }
        let energyLeft = selector.energyLeft ?? 0;
        let dailyEnergy = selector.dailyEnergy ?? 0;
        const energyRechargeSpeed = 4; // Example value
        const updateEnergy = () => {
            energyLeft = Math.min(energyLeft + energyRechargeSpeed, dailyEnergy);
            debouncedDispatchEnergy(energyLeft);
        };
        const interval = setInterval(updateEnergy, 550); // Update every second
        return () => clearInterval(interval);
    }, [debouncedDispatchEnergy, selector.energyLeft, isInitialized, selector.dailyEnergy]);

    return (
        <>
            <ScreenLoader content={selector.screenPopup} />

            <BrowserRouter>
                <Routes>
                    <Route path={ROUTE_HOME} element={<Home isInitialized={isInitialized} fetchUserInfo={fetchUserInfo} taskUrl={taskUrl} />} />
                    <Route path={ROUTE_ADMIN} element={<Admin />} />
                    <Route path={ROUTE_LOTTERY} element={<Lottery />} />
                    {/* <Route path={ROUTE_LOTTERY_TUTORIAL} element={<TutorialPage/>}/> */}
                    <Route path={ROUTE_LOG_OF_LUCK} element={<LogsOfLuckList />} />
                    <Route path={ROUTE_LOG_OF_LUCK_DETAIL} element={<LogsOfLuck />} />
                    {/* <Route path={ROUTE_WINNERS} element={<Winners/>}/> */}
                    <Route path={ROUTE_TEAMS} element={<Teams />} />
                    <Route path={ROUTE_WIN_LOTTERY} element={<WinnerPage />} />
                    <Route path={`${ROUTE_TEAM}/:id?`} element={<Team />} />
                    <Route path={ROUTE_CREATE_TEAM} element={<CreateTeam />} />
                    <Route path={ROUTE_TEAM_SETTINGS} element={<TeamSettings />} />
                    <Route path={ROUTE_GOLD_SWAP} element={<GoldSwap />} />
                    <Route path={ROUTE_FRIENDS} element={<Friends />} />
                    <Route path={ROUTE_FRIENDS_BONUS} element={<FriendsBonus />} />
                    <Route path={ROUTE_TASKS} element={<CampaignsComponent />} />
                    <Route path={`${ROUTE_SUPERTASKS}/:id`} element={<SuperTasks />} />
                    <Route path={`${ROUTE_REQUIRE_INPUT}/:id/:supertask_id`} element={<RequireInput />} />
                    <Route path={ROUTE_BOOSTS} element={<Boosts />} />
                    <Route path={ROUTE_STATISTICS} element={<Statistics />} />
                    <Route path={ROUTE_BALANCE} element={<Balance />} />
                    <Route path={ROUTE_LEAGUE} element={<League />} />
                    <Route path={ROUTE_VIP_PAGE} element={<VipPage />} />
                    <Route path={ROUTE_EXCHANGES} element={<Exchanges />} />
                    <Route path={ROUTE_BLOCKGAME} element={<BlockGame />} />
                    <Route path="*">panel not found</Route>
                </Routes>
            </BrowserRouter>

            <>
                <BoostEnergyModal />
                {/*todo cambiare il check da > a != e cambiare il be da 3 a 7 giorni */}
                {showBonusMalusModal && bonusMalusValue > 0 && <BonusMalus bonusMalusValue={bonusMalusValue} onClose={() => setShowBonusMalusModal(false)} />}
                <BoostBuyConfirmModal />
                <TaskChannelModal />
                <ReferralLinkModal />
                <ModalInfo />
                <WalletConnectModal />
                <AdminTaskModal />
                <CustomToast />
            </>
        </>
    );
};

export default App;
