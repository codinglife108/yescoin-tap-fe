import React, { useState, useEffect, useCallback } from 'react';
import { fetchData, fetchDataAxios } from "../../utils/api";
import TelegramBackButton from "../../components/TelegramBackButton/TelegramBackButton";
import BackgroundGlow from "../../components/BackgroundGlow/BackgroundGlow";
import Panel from "../../components/Panel/Panel";
import Cell from "../../components/Cell/Cell";
import EmojiRectangle from "../../components/EmojiRectangle/EmojiRectangle";
import Img from "../../components/Img/Img";
import IconText from "../../components/IconText/IconText";
import { formatNumberWithSpaces } from "../../utils/mathUtils";
import {
    ADD_GOLD,
    DefaultStateType,
    getDispatchObject,
    SET_DAYLY_REWARD,
    SET_TASKS, SET_TOAST
} from "../../store/reducer";
import { useDispatch, useSelector } from "react-redux";
import Spacing from "../../components/Spacing/Spacing";
import {useNavigate, useLocation } from "react-router-dom";
import "./Campaing.css"
import CampaignListItem from "./components/CampaignListItem";
import DailyReward from "./components/DailyReward";
import MantleTrasReward from './components/MantleTrasReward';
import { MODAL_TASK_CHANNEL, MODAL_TASK_CLAIM, MODAL_TASK_INPUT, ROUTE_FRIENDS } from "../../routes";
import useModal from "../../hooks/useModal";
import FriendsListSkeleton from "../Friends/components/FriendsListSkeleton/FriendsListSkeleton";
import { useOkxWallet } from '../../utils/OkxWalletProvider';
import WalletConnect from '../../assets/images/other/preload-banner.png'
import { SET_USER_ACTIVTY } from '../../store/reducer';
import DailyTutorial from './components/DailyTutorial';
import { useTranslation } from 'react-i18next';

enum AdsgramAdStatus {
    SEARCHING,
    NOT_AVAILABLE,
    AVAILABLE,
    REWARDED
}

// '🔥Active', 'Yescoin', '🚀Accelerator',  '⚡️Daily', '✅Completed'
const CATEGORIES = [
    {
        id: 'new',
        name: 'Active',
        icon: '🔥'
    },
    // {
    //     id: 'yescoin',
    //     name: 'Yescoin',
    //     icon: <img width={'30px'} src="/yescoin_icon.png"></img>
    // },
    // {
    //     id: 'accelerator',
    //     name: 'Accelerator',
    //     icon: '🚀'
    // },
    {
        id: 'daily',
        name: 'Daily',
        icon: '⚡️'
    },
    {
        id: 'completed',
        name: 'Completed',
        icon: '✅'
    }
]
const ADSGRAM_AD_REWARD = 20000;
const CONNECT_WALLET_REWARD = 500000;
const dividerStyle = { background: "#fff2", height: 1, width: "calc(100% - 64px)", marginLeft: "auto" }
// @ts-ignore
const tg = window['Telegram']['WebApp'];
const CampaignsComponent = () => {
    const [adsgramAdStatus, setAdsgramAdStatus] = useState(AdsgramAdStatus.SEARCHING);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [activeTab, setActiveTab] = useState('new');
    const dispatch = useDispatch();
    const selector = useSelector((s: DefaultStateType) => s);
    const campaigns = selector?.tasks;
    const dailyReward: any = selector?.dailyReward || {};
    const { setActiveModal } = useModal();
    const location = useLocation();
    const {t} = useTranslation();

    const fetchCampaigns = useCallback(async () => {
        try {
            const response = await fetchData("/tasks/get");
            const responseDailyReward = await fetchData("/tasks/getDailyReward");

            const tasks = response.result.tasks;
            const superTasks = response.result.superTasks;

            // Filtra le task indipendenti (senza supertask_id)
            const independentTasks = tasks.filter((task: any) => (!task.supertask_id&&task.visible!==false));


            // Crea un oggetto per mappare le supertask con i loro step
            const superTasksWithSteps = superTasks.map((superTask: any) => ({
                ...superTask,
                type: 'supertask',
                steps: tasks.filter((task: any) => task.supertask_id === superTask.id)
            })).sort((a:any, b:any) => a.orderpriority - b.orderpriority);

            // Combina task indipendenti e supertask in un unico array
            const allCampaigns = [
                ...(superTasksWithSteps?.reverse() || []),
                ...independentTasks.map((task: any) => ({ ...task, type: 'task' })),
            ];

            await checkIfAdsgramAdIsAvailable();

            dispatch(getDispatchObject(SET_TASKS, allCampaigns));
            dispatch(getDispatchObject(SET_DAYLY_REWARD, responseDailyReward.result));
            // setTimeout(() => {
            //     const event = new Event("SUPERTASK_UPDATE");
            //     document.dispatchEvent(event);
            // }, 1000);
        } catch (e: any) {
            setError(e?.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    }, [dispatch]);

    const check = async (task: any) => {
        const response = await fetchData(
            '/tasks/check',
            {id: task['id']}
        );

        // TODO(legends-emergency): Clean this up
        if (response.error && task['id'] === 424222) {
            dispatch(getDispatchObject(SET_TOAST, {
                open: true,
                message: "You haven't completed the games!",
                type: "error"
            }));
            return;
        }

        if (response.error) {
            dispatch(getDispatchObject(SET_TOAST, {open: true, message: t("taskNotSubscribedError"), type: "error"}));
            return;
        }

        const result = response.result;
        if (result === 'not subscribed') {
            dispatch(getDispatchObject(SET_TOAST, {open: true, message: t("taskNotSubscribedError"), type: "error"}));
            return;
        }

        dispatch(getDispatchObject(ADD_GOLD, task['award']));

        const event = new Event("TASKS_UPDATE");
        document.dispatchEvent(event);
        dispatch(getDispatchObject(SET_TOAST, { open: true, message: `${formatNumberWithSpaces(task['award'])} Yescoin Received`, type: "success" }));
        fetchCampaigns();
    }

    const goToModal = (task: any) => {
        if (task["award"] === -1) {
            if (task["botAddress"]) {
                // @ts-ignore
tg.openTelegramLink(`https://t.me/${task['botAddress'].replace('@', '')}`);
                return;
            } else if (task["link"]) {
                if (task["link"].startsWith("https://t.me/")) {
                    // @ts-ignore
tg.openTelegramLink(task["link"]);
                    return;
                }
                // @ts-ignore
tg.openLink(task['link']);
                return;
            } else if (task["channelAddress"]) {
                // @ts-ignore
tg.openTelegramLink(`https://t.me/${task['channelAddress'].replace('@', '')}`);
                return;
            } else if (task["channeladdress"]) {
                // @ts-ignore
tg.openTelegramLink(`https://t.me/${task['channeladdress'].replace('@', '')}`);
                return;
            }
            return;
        }

        if (task["require_input"] === true) {
            setActiveModal(MODAL_TASK_INPUT, task);
        }

        if (task["botAddress"]) {
            // @ts-ignore
            tg.openTelegramLink(`https://t.me/${task['botAddress'].replace('@', '')}`);
            return
        } else if (task["link"]) {
            if (task["link"].startsWith("https://t.me/")) {
                // @ts-ignore
                tg.openTelegramLink(task["link"]);
                if (task["require_input"] === true || task["award"] == 0) return;
                check( task);
                return
            }
            // @ts-ignore
            tg.openLink(task['link']);
            if (task["require_input"] === true|| task["award"] == 0) return;
            check( task);
            return
        } else if (task["channelAddress"]) {
            // @ts-ignore
            tg.openTelegramLink(`https://t.me/${task['channelAddress'].replace('@', '')}`);
            if (task["require_input"] === true) return;
            check( task);
            return
        } else if (task["channeladdress"]) {
            // @ts-ignore
            tg.openTelegramLink(`https://t.me/${task['channeladdress'].replace('@', '')}`);
            if (task["require_input"] === true) return;
            check( task);
            return
        }
    };
    const categorizeCampaigns = (campaigns: any) => {
        return campaigns.reduce((acc: any, campaign: any) => {
            if(campaign.visible == false) return acc;
            const isCompleted = campaign.award === -1 || (campaign.steps && campaign.total_reward === -1);
            const isDaily = (campaign.daily && !isCompleted) || (campaign.sectiontype == 'daily');
            const sections = ["yescoin", "accelerator"];
            if (isCompleted) {
                acc.completed.push(campaign);
            } else if (isDaily) {
                acc.daily.push(campaign);
            } else if (sections.includes(campaign.sectiontype)) {
                acc[campaign.sectiontype].push(campaign);
            } else {
                acc.new.push(campaign);
            }
            return acc;
        }, {new: [], yescoin: [], accelerator: [], daily: [], completed: []});
    };

    useEffect(() => {
        fetchCampaigns();
    }, [fetchCampaigns]);

    const userActivities = useSelector((state: DefaultStateType) => state.userActivities);
    const isWalletRewarded = userActivities?.hasOwnProperty('mantleWalletConnectAt');

    const [isLimited, setLimited ] = useState(true);
    const [adsViewCount, setAdsViewCount] = useState(0);
    const [lastViewedAt, setLastViewedAt] = useState(0);

    const getAdsViewCount = async () => {
        const response = await fetchData("/user/getSettings")
        let views = response?.result?.settings?.ads_watch?.watch_counter || 0;
        setLastViewedAt(response?.result?.settings?.ads_watch?.last_watch_view);
        setAdsViewCount(views);
        setLimited(views>20);
    }

    useEffect(() => {
        getAdsViewCount()
    }, [])

    useEffect(() => {
        if (!(campaigns && campaigns.length > 0)) {
            setLoading(true)
        }
    }, [campaigns])

    const getMantleTransReward = async () => {
        const res = await okxContext.sendZeroTransaction();
        if(res) {
            const response = await fetchData("/tasks/getReward", { reward: 50000 });
    
            if (response.error) {
                return;
            }
    
            dispatch(getDispatchObject(ADD_GOLD, Number(50000)));
            dispatch(getDispatchObject(SET_TOAST, { open: true, message: "50,000 Yescoin Received", type: "success" }));
        }
    };

    const getDailyReward = async () => {
        const res = await okxContext.sendZeroTransaction();
        if(res) {
            const response = await fetchData("/tasks/claimDailyReward");
    
            if (response.error) {
                return;
            }
    
            dispatch(getDispatchObject(ADD_GOLD, Number(dailyReward["reward"])));
            dispatch(getDispatchObject(SET_DAYLY_REWARD, response.result));
            dispatch(getDispatchObject(SET_TOAST, { open: true, message: "Daily Reward Claimed", type: "success" }));
    
            const event = new Event("TASKS_UPDATE");
            document.dispatchEvent(event);
        }
    };

    const checkIfAdsgramAdIsAvailable = async () => {

        let isAvailable = false
        try {
            // @ts-ignore
            isAvailable = await window.AdController.load()
        } catch (e) {
            console.log(e);
        }

        setAdsgramAdStatus(isAvailable ? AdsgramAdStatus.AVAILABLE : AdsgramAdStatus.NOT_AVAILABLE)
        return isAvailable
    }

    const playAdsgramAd = async () => {
        if (adsgramAdStatus === AdsgramAdStatus.NOT_AVAILABLE) {
            return;
        }

        // Check once more if the ad is available, as some time could have passed and the ad expired
        let isAvailable = await checkIfAdsgramAdIsAvailable()

        try {
            const now = new Date().getTime() / 1000;
            if(now - lastViewedAt < 6 * 60) {
                dispatch(getDispatchObject(SET_TOAST, {
                    open: true,
                    message: `You can watch the Ad ${6-Math.floor((now - lastViewedAt)/60)} minutes later`,
                    type: "error"
                }));
                return;
            }
            const response = await fetchData("/user/getSettings")

            let storyViews = response?.result?.settings?.ads_watch?.watch_counter || 0;
            if (storyViews >= 20) {
                dispatch(getDispatchObject(SET_TOAST, {
                    open: true,
                    message: "You can watch the Ad only 20 times",
                    type: "error"
                }));
                return;
            } else {
                await fetchData("/tasks/updateAdsCounter")
                getAdsViewCount();
            }
        } catch (e) {
            console.log("error", e)
        }
        if (!isAvailable) {
            window.alert("Sorry, the Ad is not available anymore. Try again later.");
            return;
        }

        let continueAfterDisclaimer = window.confirm("Ads are provided by third parties: this is not financial advice. Do your own research.")
        if (!continueAfterDisclaimer) {
            return;
        }

        try {
            // @ts-ignore
            let watchStatus = await window.AdController.show()

            if (!watchStatus.done || watchStatus.done !== true) {
                // Ad not watched till the end
                window.alert("You must watch the Ad till the end to collect your reward.");
            } else {
                console.log("🟢 SUCCESS");

                await claimAdsgramAdReward();
            }

        } catch (e) {
            console.log("🔴 ERROR");
            window.alert("You must watch the Ad till the end to collect your reward.");
        }
    };

    const claimAdsgramAdReward = async () => {
        const response = await fetchDataAxios("/tasks/claimAdsgramAdReward", {
            viewCompletedAt: new Date().getTime(),
            reference: process.env.REACT_APP_ADSGRAM_BLOACK_ID
        });

        if (response.error) {
            return;
        }

        if (!response.result.success) {
            window.alert("Sorry, we failed giving you a reward.");
            return
        }

        setAdsgramAdStatus(AdsgramAdStatus.REWARDED)
        dispatch(getDispatchObject(ADD_GOLD, Number(ADSGRAM_AD_REWARD)));

        const event = new Event("TASKS_UPDATE");
        document.dispatchEvent(event);

        window.alert(`🥳 you were awarded ${formatNumberWithSpaces(ADSGRAM_AD_REWARD)} tokens!`);
    }

    const renderAdsgramAdReward = () => {
        return (
            <>
                <Cell
                    key="adsgramAdReward"
                    title={`Watch an Ad`}
                    onClick={() => playAdsgramAd()}
                    before={
                        <EmojiRectangle style={{ marginTop: '-4px', marginBottom: '4px' }} big>
                            <Img
                                radius={0}
                                src={require("../../assets/images/emoji/money_fly.png")}

                            />
                        </EmojiRectangle>
                    }
                >
                    {adsgramAdStatus === AdsgramAdStatus.NOT_AVAILABLE ? (
                        "not available yet"
                    ) : (adsgramAdStatus === AdsgramAdStatus.REWARDED ? (
                        "rewarded"
                    ) : (
                        <div className={"reward-text small "}>
                            <>
                                Earn:
                                <IconText
                                    size="small"
                                    imgPath={"/rocket_coin_back_36x36.png"}
                                    text={formatNumberWithSpaces(ADSGRAM_AD_REWARD)}
                                />
                            </>
                        </div>
                    ))}
                </Cell>
            </>
        );
    };

    const okxContext = useOkxWallet();

    

    const _renderWalletConnect = () => {
        const handleConnectWallet = async () => {
            if (!okxContext.walletAddress) {
                await okxContext.connectWallet();
            }
        }
        return (
            <>
                <div
                    key="connect-wallet-btn"
                    onClick={() => handleConnectWallet()}
                    className={`campaign-card pb-0 campaign-card-large pb-0`}
                >
                    <div className="campaign-image" style={{ backgroundImage: `url(${WalletConnect})` }} />
                    <div className="campaign-image-overlay py-2">
                        <h2 className="campaign-title text-center text-[20px]">Connect Wallet</h2>
                    </div>
                    <div className="flex justify-center items-center gap-1 pb-2">
                        <div className={"reward-text"}>
                            {(!isWalletRewarded) ? (
                                <>
                                    Earn:
                                    <IconText
                                        size="mediumTasks"
                                        imgPath={require('../../assets/images/coins/rocket_coin_back_100x100.png')}
                                        text={formatNumberWithSpaces(500000)}
                                    />

                                </>
                            ) : (
                                <p className={"text-success"}>Completed!</p>
                            )}
                        </div>
                    </div>
                </div>
            </>
        );
    };
 
    if (error) return <div>Error: {error}</div>;
    const categorizedCampaigns = categorizeCampaigns(campaigns || []);
    return (
        <>
            <Panel style={{ paddingBottom: 0 }}>
                <BackgroundGlow
                    color0={"#490f13"}
                    color1="#000"
                    color2="#000"
                    color3="#000"
                    style={{ bottom: "0" }}
                    vertical="bottom"
                    fromBottom
                />
                <div className="campaigns-container">
                    <TelegramBackButton />

                    <div className="campaigns-header">
                        <h1 className="campaigns-title">{"Campaigns"}</h1>
                    </div>
                    <div className="tab-container">
                        {CATEGORIES.map((tab) => (
                                <button
                                    key={tab.id}
                                    onClick={() => setActiveTab(tab.id)}
                                    className={`tab-button flex items-center ${activeTab === tab.id ? 'active' : ''}`}
                                >
                                    <div className={"tab-icon mr-2"}>
                                        {tab.icon}
                                    </div>

                                    {tab.name}
                                    <span className="task-count">
                                    {categorizedCampaigns[tab.id]?.length||0 + (tab.id === "completed" && dailyReward["completed"] ? 0 : tab.id === "daily" && !dailyReward["completed"] ? 1 : 0)}
                                </span>
                            </button>
                        )
                        )}
                    </div>
                    <Spacing size={12}/>

                    {loading ? (
                        <FriendsListSkeleton />
                    ) : (
                        <>
                            {categorizedCampaigns[activeTab].filter((c: any) => c.steps?.length).map((campaign: any) => (
                                <CampaignListItem
                                    onCampaignClick={goToModal}
                                    fetchCampaigns={fetchCampaigns}
                                    campaign={campaign}
                                    key={campaign.id}
                                />
                            )
                            )}
                            <div className={"tasks-panel mb-4"}
                                //@ts-ignore
                                style={{ display: activeTab === "completed" && categorizedCampaigns[activeTab].filter((c: any) => !(c.steps?.length)).length === 0 && "none" }}
                            >
                                {!loading && dailyReward !== null && (activeTab === "daily") && ({/*((!dailyReward["completed"]) && activeTab === "daily")*/ }) && (
                                    <>
                                        <DailyReward
                                            dailyReward={dailyReward}
                                            getDailyReward={dailyReward["completed"] ? () => {
                                                dispatch(getDispatchObject(SET_TOAST, {
                                                    open: true,
                                                    message: "Daily reward already claimed",
                                                    type: "error"
                                                }));
                                            } : getDailyReward}
                                        />
                                        <div style={dividerStyle} className='mt-2'></div>
                                        {/* <DailyTutorial/> */}
                                        {((dailyReward["completed"])) ? (
                                            <Spacing size={2} />
                                        ) : <>
                                            <Spacing size={2} />
                                            {/*<div style={dividerStyle}></div>*/}
                                        </>}
                                    </>
                                )}
                                {activeTab !== "completed"&&
                                <>
                                    <MantleTrasReward
                                        dailyReward={50000}
                                        getDailyReward={getMantleTransReward}
                                    />
                                    <div style={dividerStyle} className='mt-2'></div>
                                    <DailyTutorial/>
                                    <div style={dividerStyle} className='mt-2'></div>
                                </>
                                }
                                {categorizedCampaigns[activeTab].filter((c: any) => !(c.steps?.length)).map((campaign: any) => (
                                    <>
                                        <CampaignListItem
                                            onCampaignClick={goToModal}
                                            fetchCampaigns={fetchCampaigns}
                                            campaign={campaign}
                                            key={campaign.id}
                                        />
                                        <div style={dividerStyle}></div>
                                    </>
                                )
                                )}
                                
                                {/* {activeTab === "new" && (
                                    <Cell
                                        key="inviteFriends"
                                        title={`Invite Bonus`}
                                        onClick={() => navigate(ROUTE_FRIENDS)}
                                        before={
                                            <EmojiRectangle big>
                                                <Img
                                                    radius={0}
                                                    src={require("../../assets/images/emoji/money_fly.png")}
                                                />
                                            </EmojiRectangle>
                                        }
                                    >
                                        <div className={"reward-text small "}>
                                            <>
                                                Up to:
                                                <IconText
                                                    size="small"
                                                    imgPath={"/rocket_coin_back_36x36.png"}
                                                    text={formatNumberWithSpaces(FRENS_REWARD)}
                                                />
                                            </>
                                        </div>
                                    </Cell>
                                )} */}
                                {/* {activeTab === "new" && !loading && (
                                    <>
                                        <Spacing size={1} />
                                        <div style={dividerStyle}></div>
                                        {renderAdsgramAdReward()}
                                    </>
                                )} */}
                            </div>
                            
                        </>
                    )}


                    {activeTab === "daily" && !isLimited && !loading && (
                        <div className={"tasks-panel mb-4"}>
                            {renderAdsgramAdReward()}
                        </div>
                    )}

                    {(activeTab === "daily")&& !loading &&
                        _renderWalletConnect()
                    }
                </div>
                <Spacing size={12} />
            </Panel>

        </>
    );
};

export default CampaignsComponent;