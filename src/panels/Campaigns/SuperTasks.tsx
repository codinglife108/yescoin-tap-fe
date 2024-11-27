import { useCallback, useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import Panel from "../../components/Panel/Panel";
import BackgroundGlow from "../../components/BackgroundGlow/BackgroundGlow";
import Img from "../../components/Img/Img";
import { formatNumberWithSpaces } from "../../utils/mathUtils";
import { useDispatch, useSelector } from "react-redux";
import TelegramBackButton from "../../components/TelegramBackButton/TelegramBackButton";
import EmojiRectangle from "../../components/EmojiRectangle/EmojiRectangle";
import IconText from "../../components/IconText/IconText";
import { fetchData } from "../../utils/api";
import { MODAL_TASK_CLAIM, MODAL_TASK_INPUT } from "../../routes";
import useModal from '../../hooks/useModal';
import { getDispatchObject, SET_TASKS, ADD_GOLD, SET_TOAST, SET_VIEWED_SUPERTASK } from "../../store/reducer";
import { LockRounded } from "@mui/icons-material";
import Spacing from "../../components/Spacing/Spacing";
import TaskConnectWallet from '../../components/TaskConnectWallet/TaskConnectWallet';
import ModalStories from "./ModalStories";
import { Pencils, Mantle } from "./HardCodedSuperTaskData";
import { Button } from "@nextui-org/react";
import { useOkxWallet } from '../../utils/OkxWalletProvider';
import { useTranslation } from 'react-i18next';
import ReferralItem from './components/ReferralItem';
import { ROUTE_HOME } from '../../routes';
import { useNavigate } from 'react-router-dom';
import InviteModal from '../../modals/inviteModal';
import { copyText } from '../../utils/utils';
import { resetMainButton } from '../../utils/tgButtonUtils';
import iconLogo from "../../assets/images/coins/rocket_coin_back_100x100.png";

// @ts-ignore
const tg = window['Telegram']['WebApp'];

const SuperTasks = () => {
    const [showStories, setShowStories] = useState(false);
    const tasks = useSelector((state: any) => state.tasks);
    const { id } = useParams()
    const [taskData, setTask] = useState<any>({});
    const [openInviteModal, setOpenInviteModal] = useState<boolean>(false);
    const [inviteLink, setInviteLink] = useState<string>('');
    const { setActiveModal } = useModal();
    const [hasViewedStories, setHasViewedStories] = useState<any>(false);
    const dispatch = useDispatch();
    const story_meta = taskData?.story_meta?.length > 2 ? JSON.parse(taskData?.story_meta) : null;
    const { t } = useTranslation();

    const isPencil = taskData.id === Pencils.id
    const isMantle = taskData.title === Mantle.title

    const handleCheckSuperTask = async (id: any) => {
        await fetchData("/supertasks/check", { id: id });
    }


    const okxContext = useOkxWallet();

    const getMantleTransReward = async () => {
        const res = await okxContext.sendZeroTransaction();
        if (res) {
            const response = await fetchData("/tasks/getReward", { reward: 50000 });

            if (response.error) {
                return;
            }

            dispatch(getDispatchObject(ADD_GOLD, Number(50000)));
            dispatch(getDispatchObject(SET_TOAST, { open: true, message: "50,000 Yescoin Received", type: "success" }));
        }
    };

    const fetchCampaigns = useCallback(async () => {
        try {
            const response = await fetchData("/tasks/get");

            const tasks = response.result.tasks;
            let sections = response.result.sections;
            const superTasks = response.result.superTasks;

            sections = sections.map((section: any) => ({
                ...section,
                steps: tasks.filter((task: any) => task.section_id === section.id)
            }));

            const independentTasks = tasks.filter((task: any) => !task.supertask_id);


            const superTasksWithSteps = superTasks.map((superTask: any) => ({
                ...superTask,
                type: 'supertask',
                sections: sections.filter((section: any) => section.supertask_id === superTask.id),
                steps: tasks.filter((task: any) => (task.supertask_id === superTask.id && (task?.section_id == null || task?.section_id == '' || task?.section_id == undefined)))
            })).sort((a: any, b: any) => a.orderpriority - b.orderpriority);

            const allCampaigns = [
                ...superTasksWithSteps,
                ...independentTasks.map((task: any) => ({ ...task, type: 'task' })),
            ];

            dispatch(getDispatchObject(SET_TASKS, allCampaigns));
        } catch (e: any) {
            console.log(e);
        }
    }, [dispatch]);

    const check = async (task: any) => {
        const response = await fetchData(
            '/tasks/check',
            { id: task['id'] }
        );

        if (response.error && task['id'] === 424222) {
            dispatch(getDispatchObject(SET_TOAST, {
                open: true,
                message: "You haven't completed the games!",
                type: "error"
            }));
            return;
        }

        if (response.error) {
            dispatch(getDispatchObject(SET_TOAST, { open: true, message: t("taskNotSubscribedError"), type: "error" }));
            return;
        }

        const result = response.result;
        if (result === 'not subscribed') {
            dispatch(getDispatchObject(SET_TOAST, { open: true, message: t("taskNotSubscribedError"), type: "error" }));
            return;
        }

        dispatch(getDispatchObject(ADD_GOLD, task['award']));

        const event = new Event("TASKS_UPDATE");
        document.dispatchEvent(event);
        dispatch(getDispatchObject(SET_TOAST, { open: true, message: `${formatNumberWithSpaces(task['award'])} Yescoin Received`, type: "success" }));
        fetchCampaigns();
    }

    const goToModal = async (task: any, isModalChannelOpened = false) => {
        if (task["type"] == "claim_free_mnt") {
            okxContext.sendClaimTransaction();
            return;
        } else if (task["type"] == "mantle_transaction") {
            const res = await okxContext.sendZeroTransaction();
            if (res) {
                const response = await fetchData("/tasks/getReward", { reward: 50000 });

                if (response.error) {
                    return;
                }

                dispatch(getDispatchObject(ADD_GOLD, Number(50000)));
                dispatch(getDispatchObject(SET_TOAST, { open: true, message: "50,000 Yescoin Received", type: "success" }));
            }
            return;
        }
        if (task["type"] == "mantle-transaction") {
            getMantleTransReward();
        } else if (task["type"] == "wallet-connect") {
            okxContext.connectWallet();
        } else {

            if (task["award"] === -1) {
                if (task["botaddress"]) {
                    // @ts-ignore
                    tg.openTelegramLink(`https://t.me/${task['botaddress'].replace('@', '')}`);
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
                } else if (task["channeladdress"]) {
                    // @ts-ignore
                    tg.openTelegramLink(`https://t.me/${task['channeladdress'].replace('@', '')}`);
                    return;
                } else if (task["channelAddress"]) {
                    // @ts-ignore
                    tg.openTelegramLink(`https://t.me/${task['channelAddress'].replace('@', '')}`);
                    return;
                }
                return;
            }

            if (task["require_input"] === true) {
                setActiveModal(MODAL_TASK_INPUT, task);
                return;
            }

            if (task["botaddress"]) {
                // @ts-ignore
                tg.openTelegramLink(`https://t.me/${task['botaddress'].replace('@', '')}`);
                return
            } else if (task["link"]) {
                if (task["link"].startsWith("https://t.me/")) {
                    if (!isModalChannelOpened) {
                        // @ts-ignore
                        tg.openTelegramLink(task["link"]);
                        check(task);
                    }
                    return
                }
                if (!isModalChannelOpened) {
                    // @ts-ignore
                    tg.openLink(task['link']);
                    check(task);
                }
                return
            } else if (task["channeladdress"]) {
                if (!isModalChannelOpened) {
                    // @ts-ignore
                    tg.openTelegramLink(`https://t.me/${task['channeladdress'].replace('@', '')}`);
                    check(task);
                }
                return
            } else {
                check(task);
            }
        }
    };

    const fetchSettings = useCallback(async () => {
        try {
            const response = await fetchData("/user/getSettings");
            let storyViews = response?.result?.settings?.story_supertask_view_ids;
            if (storyViews?.length > 0) {
                setHasViewedStories(storyViews.includes(id));
            }
        } catch {
        }
    }, [])


    const fetchTask = useCallback(async () => {
        if (!tasks.length || !id) return;
        const findTask = tasks.find((task: any) => `${task.id}` === `${id}`);
        if (!findTask) return
        setTask(findTask);
    }, [tasks, id])

    const createEventListeners = useCallback(() => {
        document.addEventListener("TASKS_UPDATE", fetchCampaigns);
    }, [fetchCampaigns]);

    const removeEventListeners = useCallback(() => {
        document.removeEventListener("TASKS_UPDATE", fetchCampaigns);
    }, [fetchCampaigns]);

    const isStepDisabled = (index: number) => {
        if (taskData.story_mandatory && !hasViewedStories) return true;
        if (!taskData.mandatory) return false;
        if (index === 0) return false;
        const previousStepsCompleted = taskData.steps
            .slice(0, index)
            .every((step: any) => step.award === -1);
        return !previousStepsCompleted;
    };

    const isSectionStepDisabled = (index: number, sIndex: number) => {
        if (taskData.story_mandatory && !hasViewedStories) return true;
        if (!taskData.mandatory) return false;
        if (index === 0) return false;
        const previousStepsCompleted = taskData.sections[sIndex].steps
            .slice(0, index)
            .every((step: any) => step.award === -1);
        return !previousStepsCompleted;
    };

    const handleStepClick = async (index: number, sIndex = -1) => {
        if (sIndex == -1) {
            if (isStepDisabled(index)) return;
            goToModal(taskData.steps[index])
        } else {
            if (isSectionStepDisabled(index, sIndex)) return;
            goToModal(taskData.sections[sIndex].steps[index])
        }
    }
    const handleInviteFriends = async () => {
        // @ts-ignore
        tg.MainButton.setText("Inviting ...");
        try {
            const result = await fetchData("/friends/invite", { link: inviteLink, taskId: id });
            // @ts-ignore
            tg.shareMessage(result.result.messageId, (e) => {
                closeModal();
                // @ts-ignore
                tg.MainButton.setText("Share & Earn");
            });
        } catch (e) {
            console.log('error:', e)
        }
    }

    const telegramButtonClick = useCallback(() => {
        setOpenInviteModal(true);
        // @ts-ignore
        tg.MainButton.hide();
    }, [taskData]);

    const closeModal = () => {
        setOpenInviteModal(false)
        // @ts-ignore
        tg.MainButton.setText("Share & Earn");
        // @ts-ignore
        tg.MainButton.show();
        // @ts-ignore
        tg.MainButton.onClick(telegramButtonClick);
        return () => {
            // @ts-ignore
            tg.MainButton.offClick(telegramButtonClick);
            // @ts-ignore
            tg.MainButton.hide();
        }
    }

    const inviteLinkCopied = () => {
        copyText(inviteLink);
        dispatch(getDispatchObject(SET_TOAST, { open: true, message: t('friendsInviteButton1'), type: 'success' }));
    }

    useEffect(() => {
        const initInviteLink = async () => {
            // @ts-ignore
            const startAppParams = JSON.stringify({ inviter: `r_${tg['initDataUnsafe']['user']['id']}`, task_id: id });
            const linkRes = await fetchData('/user/invite-link', { link: btoa(startAppParams) });
            if (linkRes.result.isNew == false) {
                dispatch(getDispatchObject(SET_TOAST, { open: true, message: "You already have this invite link on channel", type: "link" }));
            }
            const link = `${process.env.REACT_APP_TELEGRAM_MINIAPP_URL}/something?startapp=${linkRes.result?.linkId}`;
            setInviteLink(link);
        }
        initInviteLink();
        fetchCampaigns();
    }, [])

    useEffect(() => {
        resetMainButton();
        // @ts-ignore
        tg.MainButton.setText("Share & Earn");
        // @ts-ignore
        tg.MainButton.show();
        // @ts-ignore
        tg.MainButton.onClick(telegramButtonClick);
        return () => {
            // @ts-ignore
            tg.MainButton.offClick(telegramButtonClick);
            // @ts-ignore
            tg.MainButton.hide();
        }
    }, []);

    useEffect(() => {
        createEventListeners();
        fetchSettings();
        return () => {
            removeEventListeners();
        };
    }, [fetchTask, createEventListeners, removeEventListeners]);

    useEffect(() => {
        fetchTask();
    }, [tasks, dispatch])

    useEffect(() => {
        dispatch(getDispatchObject(SET_VIEWED_SUPERTASK, id));
        if (id) handleCheckSuperTask(id);
    }, [id])

    const _renderButtons = () => {

        const termConditionButtonLink = isPencil ? Pencils.termConditionButtonLink : isMantle ? Mantle.termConditionButtonLink : null;

        return (
            <div className='flex gap-2'>
                {/* <Button onClick={telegramButtonClick}
                    className={"p-2 px-4 mb-3"} style={{ fontSize: "1.05rem", background: "#262628" }}>
                        <img src={telegram} className='rounded-full' width={30}/>
                    Share
                </Button> */}
                {termConditionButtonLink ?
                    <Button onClick={() => window.open(termConditionButtonLink, "_blank")}
                        className={"p-2 px-4 mb-3"} style={{ fontSize: "1.05rem", background: "#262628" }}>
                        📄 Terms & Conditions
                    </Button> : <></>}
            </div>


        )
    }

    return (
        <Panel>
            <BackgroundGlow
                color1="#000"
                color2="#000"
                color3="#000"
                vertical="bottom"
                fromBottom
            />
            <TelegramBackButton url={ROUTE_HOME} />
            <div className="banner my-3">
                {taskData?.media_url?.endsWith('.mp4') || taskData?.media_url?.endsWith('.mov') ? (
                    <video
                        className="banner-image"
                        autoPlay
                        loop
                        muted
                        playsInline
                        style={{ objectFit: 'cover', width: "100%" }}
                    >
                        <source src={taskData.media_url} type="video/mp4" />
                        Your browser does not support the video tag.
                    </video>
                ) : (
                    <img src={taskData.media_url} alt={taskData.title} className="banner-image" />
                )}

            </div>

            <div className="main-content">
                <div
                    className={"rewards-card"}
                    onClick={() => {
                        if (taskData.stories?.length > 0)
                            setShowStories(true)
                    }}
                >
                    <div className='flex items-center gap-2'>
                        <img
                            src={"/rocket_coin_back_36x36.png"}
                            width={30}
                            height={30}
                            className={"mx-1"}
                            alt={taskData.title}
                        />
                        {taskData.total_reward === -1 ? (
                            <h4 className={"text-success"}>Completed!</h4>
                        ) : (
                            <h4>Earn Yescoin</h4>
                        )}
                    </div>
                    {taskData.total_reward > 0 && <p className='pr-1'>{formatNumberWithSpaces(taskData.total_reward)} </p>}
                    {/* <Icon16Chevron/> */}
                </div>
                {isPencil && Pencils.extraCoinValue && Pencils.extraCoinLogo &&
                    <div className="rewards-card" onClick={() => setShowStories(true)}>
                        <h4>Prize pool {(Pencils.extraCoinValue)}</h4>
                        <img
                            src={Pencils.extraCoinLogo}
                            width={40}
                            height={40}
                            className={"mx-1"}
                            alt={"extra coin"}
                        />
                    </div>
                }

                <div className="banner-content mt-8">
                    <div className="banner-card flex items-center gap-1">
                        {taskData?.media_url?.endsWith('.mp4') || taskData?.media_url?.endsWith('.mov') ? (
                            <video
                                className="mr-3 aspect-square object-cover "
                                autoPlay
                                loop
                                muted
                                playsInline
                                style={{ objectFit: 'cover', width: "48px", borderRadius: "16px" }}
                            >
                                <source src={taskData.media_url} type="video/mp4" />
                                Your browser does not support the video tag.
                            </video>
                        ) : (
                            <Img radius={12} src={taskData.logourl || taskData.media_url} width={48} height={48}
                                className={"mr-3 aspect-square object-cover "}
                                alt={taskData.title} />
                        )}

                        <h3 className="h3">{taskData.title}</h3>
                    </div>
                    <div className={"my-5"}>
                        {/*todo: rimuovere pencils*/}
                        <p>{isPencil ? Pencils.longDescription : taskData.description}</p>
                    </div>
                    {
                        _renderButtons()
                    }
                </div>

                {taskData?.sections?.length > 0 ? (
                    <>
                        {taskData.sections.map((section: any, sindex: number) => (
                            <div key={section.id} className='d-block'>
                                <div className="banner-content ">
                                    <div className='banner-card flex items-center gap-1'>
                                        {section.logourl && <Img
                                            radius={12}
                                            src={section.logourl}
                                            width={48}
                                            height={48}
                                            className={
                                                'mr-3 aspect-square object-cover'
                                            }
                                            alt={section.title}
                                        />}
                                        <h3 className='h3'>{section.title}</h3>
                                    </div>
                                    <div className={'my-5'}>
                                        <p>{section.description}</p>
                                    </div>
                                </div>
                                {section?.steps?.map((step: any, index: number) => {
                                    if (step["type"] === "connect_bitget_wallet") {
                                        return (
                                            <TaskConnectWallet
                                                icon={step.media_url}
                                                taskId={step["id"]}
                                                reward={step["award"]}
                                                isCompleted={step["award"] === -1}
                                            />
                                        )
                                    }
                                    if (step["type"] === "refer_link_add") {
                                        return (
                                            <ReferralItem data={step} />
                                        )
                                    }

                                    return (
                                        <>
                                            <div
                                                key={step.id}
                                                onClick={() => handleStepClick(index, sindex)}
                                                id={(isStepDisabled(index) || step.award === -1) ? ("step-" + step.id) : "active-step"}
                                                data-index={index}
                                                className={`step-card `}
                                            >
                                                {step.award === -1 ? (
                                                    <EmojiRectangle style={emojyStyle}>
                                                        <CheckIcon />
                                                    </EmojiRectangle>
                                                ) : isStepDisabled(index) ? (
                                                    <EmojiRectangle style={emojyStyle}>
                                                        <LockRounded style={{ color: "#f7b719" }} />
                                                    </EmojiRectangle>
                                                ) : step.media_url ? (
                                                    <img src={step.media_url} alt={step.title} className="step-image" />
                                                ) : (
                                                    <EmojiRectangle style={emojyStyle}>
                                                        <Img
                                                            radius={0}
                                                            src={"/money_fly.png"}
                                                        />
                                                    </EmojiRectangle>
                                                )}
                                                <div className="step-content">
                                                    <h4 style={{
                                                        marginBottom: 0,
                                                        color: isStepDisabled(index) ? "#f7b719" : "white"
                                                    }}>
                                                        {step.title}
                                                    </h4>
                                                    <Spacing size={8} />
                                                    {okxContext.isConfirming ? (
                                                        <p className={"text-success"}>Confirming...</p>
                                                    ) :
                                                        step.award === -1 || (step.type == "walllet-connect" && okxContext.isWalletConnected) || (step.type == "claim_free_mnt" && okxContext.isClaimed) ? (
                                                            <p className={"text-success"}>Completed!</p>
                                                        ) : (
                                                            <IconText
                                                                size="small"
                                                                textColor={isStepDisabled(index) ? "#f7b719" : "white"}
                                                                centered
                                                                imgPath={'/rocket_coin_back_36x36.png'}
                                                                text={formatNumberWithSpaces(step.award)}
                                                            />
                                                        )
                                                    }
                                                </div>
                                                {step.award !== -1 ? (
                                                    <ChevronRight isStepDisabled={isStepDisabled(index)} />
                                                ) : null}
                                            </div>
                                            {isPencil && step.type === Pencils.taskLearnMoreType && (
                                                <span style={{ color: "#3b82f6" }}
                                                    className={"flex justify-center w-full cursor-pointer my-3"}
                                                    onClick={() => window.open(Pencils.intruction_url, "_blank")}>
                                                    Learn More
                                                </span>
                                            )}
                                        </>
                                    )

                                })}
                            </div>
                        ))}
                    </>
                ) : (
                    <h2 className={"h2-task-steps"}>Task Steps</h2>
                )}


                {taskData?.steps?.length > 0 ? (
                    <>

                        {taskData.stories?.length > 0 && (
                            <div
                                onClick={() => setShowStories(true)}
                                className={`step-card `}
                            >
                                {hasViewedStories ? (
                                    <EmojiRectangle style={emojyStyle}>
                                        <CheckIcon />
                                    </EmojiRectangle>
                                ) : (
                                    <EmojiRectangle style={emojyStyle}>
                                        <LockRounded style={{ color: "#f7b719" }} />
                                    </EmojiRectangle>
                                )}
                                <div className="step-content">
                                    <h4 style={{
                                        marginBottom: 0,
                                        color: "white"
                                    }}>
                                        {story_meta?.title ? story_meta?.title : "More information"}
                                    </h4>
                                    <Spacing size={8} />
                                    {/*<p style={{color: isStepDisabled(index) ? "#f7b719" : "white"}}>{step.description}</p>*/}
                                    {taskData.story_reward ? (
                                        (!hasViewedStories) ? (
                                            <IconText
                                                size="small"
                                                textColor={"white"}
                                                centered
                                                imgPath={'/rocket_coin_back_36x36.png'}
                                                text={formatNumberWithSpaces(taskData.story_reward)}
                                            />
                                        ) : (
                                            <p className={"text-success"}>Completed!</p>
                                        )
                                    ) : null}
                                </div>
                                <ChevronRight isStepDisabled={false} />
                            </div>
                        )}
                        {taskData?.steps?.map((step: any, index: number) => {
                            if (step["type"] === "connect_bitget_wallet") {
                                return (
                                    <TaskConnectWallet
                                        icon={step.media_url}
                                        taskId={step["id"]}
                                        reward={step["award"]}
                                        isCompleted={step["award"] === -1}
                                    />
                                )
                            }
                            if (step["type"] === "refer_link_add") {
                                return (
                                    <ReferralItem data={step} />
                                )
                            }

                            return (
                                <>
                                    <div
                                        key={step.id}
                                        onClick={() => handleStepClick(index)}
                                        id={(isStepDisabled(index) || step.award === -1) ? ("step-" + step.id) : "active-step"}
                                        data-index={index}
                                        className={`step-card `}
                                    >
                                        {step.award === -1 ? (
                                            <EmojiRectangle style={emojyStyle}>
                                                <CheckIcon />
                                            </EmojiRectangle>
                                        ) : isStepDisabled(index) ? (
                                            <EmojiRectangle style={emojyStyle}>
                                                <LockRounded style={{ color: "#f7b719" }} />
                                            </EmojiRectangle>
                                        ) : step.media_url ? (
                                            <img src={step.media_url} alt={step.title} className="step-image" />
                                        ) : (
                                            <EmojiRectangle style={emojyStyle}>
                                                <Img
                                                    radius={0}
                                                    src={"/money_fly.png"}
                                                />
                                            </EmojiRectangle>
                                        )}
                                        <div className="step-content">
                                            <h4 style={{
                                                marginBottom: 0,
                                                color: isStepDisabled(index) ? "#f7b719" : "white"
                                            }}>
                                                {step.title}
                                            </h4>
                                            <Spacing size={8} />
                                            {okxContext.isConfirming ? (
                                                <p className={"text-success"}>Confirming...</p>
                                            ) :
                                                step.award === -1 || (step.type == "walllet-connect" && okxContext.isWalletConnected) || (step.type == "claim_free_mnt" && okxContext.isClaimed) ? (
                                                    <p className={"text-success"}>Completed!</p>
                                                ) : (
                                                    <IconText
                                                        size="small"
                                                        textColor={isStepDisabled(index) ? "#f7b719" : "white"}
                                                        centered
                                                        imgPath={'/rocket_coin_back_36x36.png'}
                                                        text={formatNumberWithSpaces(step.award)}
                                                    />
                                                )
                                            }
                                        </div>
                                        {step.award !== -1 ? (
                                            <ChevronRight isStepDisabled={isStepDisabled(index)} />
                                        ) : null}
                                    </div>
                                    {isPencil && step.type === Pencils.taskLearnMoreType && (
                                        <span style={{ color: "#3b82f6" }}
                                            className={"flex justify-center w-full cursor-pointer my-3"}
                                            onClick={() => window.open(Pencils.intruction_url, "_blank")}>
                                            Learn More
                                        </span>
                                    )}
                                </>
                            )

                        })}
                    </>
                ) : null}
            </div>
            {taskData?.stories?.length > 0 && showStories && (
                <ModalStories
                    images={taskData?.stories}
                    hasViewedStories={hasViewedStories}
                    taskdata={taskData}
                    fetchSettings={fetchSettings}
                    onClose={() => setShowStories(false)}
                />
            )}
            <Spacing size={64} />
            {openInviteModal && (
                <InviteModal
                    iconLogo={iconLogo}
                    sendButtonText={t('modalSendButtonLabel')}
                    copyButtonText={t('modalCopyLinkButtonLabel')}
                    containerStyle={{
                        height: "min-content",
                        paddingTop: "20px",
                        paddingBottom: "20px",
                    }}
                    close={closeModal}
                    sendCallback={handleInviteFriends}
                    copyCallback={inviteLinkCopied}
                    itemData={{
                        title: t('inviteToEarn'),
                        subtitle: `When users click on this referral link, they will be directed to the ${taskData?.title} Task page, as this referral link is specific to that task.`,
                    }}
                />
            )}
        </Panel>
    );
};
const CheckIcon = () => (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="green"
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
        className="feather feather-check">
        <polyline points="20 6 9 17 4 12" />
    </svg>
)
const ChevronRight = ({ isStepDisabled }: { isStepDisabled: boolean }) => (
    <svg
        style={{ opacity: isStepDisabled ? 0.5 : 1 }}
        xmlns="http://www.w3.org/2000/svg" width="24" height="24"
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round"
        strokeLinejoin="round">
        <polyline points="9 18 15 12 9 6"></polyline>
    </svg>
)
const emojyStyle = {
    width: 54,
    height: 54,
    display: "flex",
    marginRight: "15px",
    justifyContent: "center",
    alignItems: "center",
}
export default SuperTasks;