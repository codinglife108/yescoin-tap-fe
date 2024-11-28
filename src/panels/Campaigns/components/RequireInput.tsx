import { useCallback, useEffect, useState } from 'react';
import { useParams } from "react-router-dom";
import Panel from "../../../components/Panel/Panel";
import BackgroundGlow from "../../../components/BackgroundGlow/BackgroundGlow";
import { formatNumberWithSpaces } from "../../../utils/mathUtils";
import { useDispatch, useSelector } from "react-redux";
import TelegramBackButton from "../../../components/TelegramBackButton/TelegramBackButton";
import { fetchData } from "../../../utils/api";
import useModal from '../../../hooks/useModal';
import { getDispatchObject, SET_TASKS, ADD_GOLD, SET_TOAST } from "../../../store/reducer";
import { Button, Input } from "@nextui-org/react";
import { useTranslation } from 'react-i18next';
import { ROUTE_HOME } from '../../../routes';
import { OpenInNew } from '@mui/icons-material';
import "./RequireInput.css"

// @ts-ignore
const tg = window['Telegram']['WebApp'];

const RequireInput = () => {

    const { id } = useParams()
    const tasks = useSelector((state: any) => state.tasks);
    const dispatch = useDispatch();
    const { t } = useTranslation();
    const [taskInput, setTaskInput] = useState<string>("");
    const [checkTaskButtonIsLoading, setCheckTaskButtonIsLoading] = useState<boolean>(false);
    const [isFaildInput, setIsFaildInput] = useState<boolean>(false);
    const [isOpenNewTab, setIsOpenNewTab] = useState<boolean>(false);
    const [stepData, setStepData] = useState<any>({});
    const [faildMessage, setFaildMessage] = useState<string>('');
    const { activeModal, setActiveModal } = useModal();

    useEffect(() => {
        setTaskInput("")
        setIsFaildInput(false)
    }, [activeModal])

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

    const setFaild = (message: string) => {
        setTaskInput("")
        setIsFaildInput(true);
        setFaildMessage(message);
        setCheckTaskButtonIsLoading(false);
    }

    const checkTaskWithInput = async () => {

        setCheckTaskButtonIsLoading(true)
        await new Promise(r => setTimeout(r, 3000));

        if (taskInput === "") {
            setFaild('Invalid code');
            return;
        }

        const response = await fetchData(
            '/tasks/check',
            {
                id: stepData['id'],
                input: taskInput
            }
        );

        if (response.error || response.result !== "ok") {
            setFaild("Task not completed");
            return;
        }

        setCheckTaskButtonIsLoading(false)
        dispatch(getDispatchObject(ADD_GOLD, stepData.additional_info?.number_range != undefined ? taskInput : stepData['award']));

        const event = new Event("TASKS_UPDATE");
        const event2 = new Event("SUPERTASK_UPDATE");
        document.dispatchEvent(event);
        document.dispatchEvent(event2);
        setActiveModal(null);
        dispatch(getDispatchObject(SET_TOAST, { open: true, message: `${formatNumberWithSpaces(stepData.additional_info?.number_range != undefined ? taskInput : stepData.award)} Yescoin Received`, type: "success" }));
        setIsFaildInput(false);
        setFaildMessage('');
        fetchCampaigns();
    }

    const checkIsModal = async (onlyCheck: boolean = true) => {
        if (stepData["award"] === -1) {
            if (stepData["botaddress"]) {
                checkWithOpenModal(onlyCheck, `https://t.me/${stepData['botaddress'].replace('@', '')}`);
                return;
            } else if (stepData["link"]) {
                if (stepData["link"].startsWith("https://t.me/")) {
                    checkWithOpenModal(onlyCheck, stepData["link"]);
                    return;
                }
                checkWithOpenModal(onlyCheck, stepData["link"]);
                return;
            } else if (stepData["channeladdress"]) {
                checkWithOpenModal(onlyCheck, `https://t.me/${stepData['channeladdress'].replace('@', '')}`);
                return;
            }
            return;
        }

        if (stepData["botaddress"]) {
            checkWithOpenModal(onlyCheck, `https://t.me/${stepData['botaddress'].replace('@', '')}`);
            return
        } else if (stepData["link"]) {
            if (stepData["link"].startsWith("https://t.me/")) {
                checkWithOpenModal(onlyCheck, stepData["link"]);
                return
            }
            checkWithOpenModal(onlyCheck, stepData["link"]);
            return
        } else if (stepData["channeladdress"]) {
            checkWithOpenModal(onlyCheck, `https://t.me/${stepData['channeladdress'].replace('@', '')}`);
            return
        }
    };

    const checkWithOpenModal = (onlyCheck: boolean = true, link: string) => {
        if (onlyCheck) {
            setIsOpenNewTab(true);
        } else {
            // @ts-ignore
            tg.openTelegramLink(link);
        }
    }

    const fetchTask = useCallback(async () => {
        if (!tasks.length || !id) {
            fetchCampaigns();
            return;
        }
        let step = tasks.find((task: any) => `${task.id}` === `${id}`);
        if (!step)
            for (const task of tasks) {
                step = task.steps.find((val: any) => `${val.id}` === `${id}`);
                if (!step)
                    if (task?.sections?.length > 0)
                        for (const section of task.sections) {
                            if (section?.steps?.length > 0) {
                                step = section.steps.find((val: any) => `${val.id}` === `${id}`);
                                if (step) break;
                            }
                        }
                if (step) break;
            }
        if (!step) return;
        if (step["additional_info"] && typeof step["additional_info"] === "string") {
            step["additional_info"] = JSON.parse(step["additional_info"])
        }
        setStepData(step);
        checkIsModal();
    }, [tasks, id])

    const createEventListeners = useCallback(() => {
        document.addEventListener("TASKS_UPDATE", fetchCampaigns);
    }, [fetchCampaigns]);

    const removeEventListeners = useCallback(() => {
        document.removeEventListener("TASKS_UPDATE", fetchCampaigns);
    }, [fetchCampaigns]);

    useEffect(() => {
        createEventListeners();
        return () => {
            removeEventListeners();
        };
    }, [fetchTask, createEventListeners, removeEventListeners]);

    useEffect(() => {
        fetchTask();
    }, [tasks, dispatch])


    return (
        <Panel style={{ height: '100%' }} contentStyle={{ height: '100%' }} >
            <BackgroundGlow
                color1="#000"
                color2="#000"
                color3="#000"
                vertical="bottom"
                fromBottom
            />
            <TelegramBackButton url={ROUTE_HOME} />
            <br />
            <div style={{
                display: 'grid',
                alignContent: 'space-between',
                height: '100%'
            }}>
                <div>
                    <div className="flex gap-1" style={{
                        alignItems: 'center', justifyContent: 'space-between', fontSize: 24
                    }}>
                        <div>
                            {stepData.title}
                        </div>
                        {
                            isOpenNewTab &&
                            <div className='cursor-pointer' style={{ position: 'relative', padding: 7, borderRadius: '50%', background: 'rgb(255 255 255 / 41%)', width: 31, height: 32 }} onClick={() => checkIsModal(false)} >
                                <OpenInNew className='absolute top-[-10px] right-0 ' style={{ width: "16px", position: 'relative' }} />
                            </div>
                        }
                    </div>
                    <div>
                        {stepData["additional_info"]?.description &&
                            <p className="text-16-medium mb-0 mt-0"
                                dangerouslySetInnerHTML={{ __html: stepData["additional_info"] ? stepData["additional_info"].description : "" }}>
                            </p>
                        }
                        {(stepData["additional_info"]?.helpText) ? (
                            <span
                                className="text-md text-white text-center mt-0 mb-0"

                                dangerouslySetInnerHTML={{ __html: stepData["additional_info"]?.helpText || "Please paste the address I used to connect the wallet to check the tasks." }}>
                            </span>
                        ) : null}
                        {
                            stepData["additional_info"]?.instructions_url &&
                            <Button
                                style={{ marginTop: 8, color: "#3b82f6" }}
                                fullWidth
                                // @ts-ignore
                                color="extra_primary"
                                variant="light"
                                onClick={() => {
                                    // @ts-ignore
                                    tg.openLink(stepData["additional_info"] ? stepData["additional_info"].instructions_url : "")
                                }}
                            >
                                Check Instructions
                            </Button>
                        }
                        <br />
                        <p style={{ paddingLeft: 10, fontSize: 20, paddingBottom: 10 }}>Verification</p>
                        <Input
                            classNames={{
                                inputWrapper: isFaildInput ? "verifycode-input faild_input_task" : "verifycode-input",
                            }}
                            size="md"
                            value={taskInput}
                            placeholder="Code or Digit number"
                            type="text"
                            onChange={(event: any) => setTaskInput(event.target.value)}
                        />
                        {isFaildInput && <p className='faild_input_message'>{faildMessage}</p>}
                        {stepData['additional_info']?.reward_help_text && <p style={{ paddingLeft: 10, fontSize: 14 }}>{stepData['additional_info']?.reward_help_text}</p>}
                    </div>
                </div>
                <div style={{ display: 'block', width: '100%', paddingBottom: '3rem' }}>
                    <Button
                        size="lg"
                        fullWidth
                        style={{ backgroundColor: "#3b82f6" }}
                        className={"text-white"}
                        isLoading={checkTaskButtonIsLoading}
                        onClick={() => checkTaskWithInput()}
                    >
                        Check task
                    </Button>
                </div>
            </div>
        </Panel>
    );
};

export default RequireInput;