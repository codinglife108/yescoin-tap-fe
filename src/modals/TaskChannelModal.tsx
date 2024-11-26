import { Button, Modal, ModalBody, ModalContent, ModalFooter, ModalHeader, Input } from '@nextui-org/react';
import React, { FC, useState, useEffect, useCallback } from 'react';
import { MODAL_INFO, MODAL_TASK_CHANNEL, MODAL_TASK_CLAIM, MODAL_TASK_INPUT } from "../routes";
import useModal from "../hooks/useModal";
import { useTranslation } from "react-i18next";
import { fetchData } from "../utils/api";
import { useDispatch } from "react-redux";
import { ADD_GOLD, getDispatchObject, SET_TASKS, SET_TOAST } from "../store/reducer";
import iconLogo from "../assets/images/coins/rocket_coin_back_100x100.png";
import { formatNumberWithSpaces } from "../utils/mathUtils";

import "./TaskChannelModal.css"
import { copyText } from "../utils/utils";

// @ts-ignore
const tg = window['Telegram'].WebApp;

const TaskChannelModal: FC = () => {

    const [taskInput, setTaskInput] = useState<string>("");
    const [checkTaskButtonIsLoading, setCheckTaskButtonIsLoading] = useState<boolean>(false);

    const { t } = useTranslation();
    const dispatch = useDispatch();
    const { activeModal, setActiveModal, activeModalParams } = useModal();
    useEffect(() => {
        setTaskInput("")
    }, [])

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


            // Filtra le task indipendenti (senza supertask_id)
            const independentTasks = tasks.filter((task: any) => !task.supertask_id);


            // Crea un oggetto per mappare le supertask con i loro step
            const superTasksWithSteps = superTasks.map((superTask: any) => ({
                ...superTask,
                type: 'supertask',
                sections: sections.filter((section: any) => section.supertask_id === superTask.id),
                steps: tasks.filter((task: any) => (task.supertask_id === superTask.id && (task?.section_id == null || task?.section_id == '' || task?.section_id == undefined)))
            })).sort((a: any, b: any) => a.orderpriority - b.orderpriority);

            // Combina task indipendenti e supertask in un unico array
            const allCampaigns = [
                ...superTasksWithSteps,
                ...independentTasks.map((task: any) => ({ ...task, type: 'task' })),
            ];

            dispatch(getDispatchObject(SET_TASKS, allCampaigns));
        } catch (e: any) {
            console.log(e);
        }
    }, [dispatch]);

    const goToChannel = () => {
        setActiveModal(MODAL_TASK_CLAIM, activeModalParams);
        if (activeModalParams['channeladdress']) {
            // @ts-ignore
            tg.openTelegramLink(`https://t.me/${activeModalParams['channeladdress'].replace('@', '')}`);
            return;
        }

        if (activeModalParams['botaddress']) {
            // @ts-ignore
            tg.openTelegramLink(`https://t.me/${activeModalParams['botaddress'].replace('@', '')}`);
            return;
        }

        if (activeModalParams['link'].startsWith("https://t.me/")) {
            // @ts-ignore
            tg.openTelegramLink(activeModalParams['link']);
            return;
        }
        // @ts-ignore
        tg.openLink(activeModalParams['link']);
    }

    const check = async (onClose: () => void) => {
        const response = await fetchData(
            '/tasks/check',
            { id: activeModalParams['id'] }
        );

        // TODO(legends-emergency): Clean this up
        if (response.error && activeModalParams['id'] === 424222) {
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

        dispatch(getDispatchObject(ADD_GOLD, activeModalParams['award']));

        const event = new Event("TASKS_UPDATE");
        document.dispatchEvent(event);
        // dispatch(getDispatchObject(SET_TOAST, { open: true, message: `${formatNumberWithSpaces(activeModalParams.total_reward || activeModalParams.award)} Yescoin Received`, type: "success" }));
        setActiveModal(MODAL_INFO, {
            icon: 'https://yes-coin-img-teams.blr1.cdn.digitaloceanspaces.com/rocket_coin_back_36x36.png',
            title: "You have received",
            buttonText: "Thank you 🥳",
            description: () => (
                <p>{formatNumberWithSpaces(activeModalParams.total_reward || activeModalParams.award)} YesCoin!</p>)
        });
        fetchCampaigns();
    }

    const checkTaskWithInput = async (onClose: () => void) => {

        setCheckTaskButtonIsLoading(true)

        // Sleep to discurage trying by bruteforce
        await new Promise(r => setTimeout(r, 3000));

        if (taskInput === "") {
            dispatch(getDispatchObject("SET_TOAST", { open: true, message: "Invalid code", type: "error" }));
            setCheckTaskButtonIsLoading(false);
            return;
        }

        const response = await fetchData(
            '/tasks/check',
            {
                id: activeModalParams['id'],
                input: taskInput
            }
        );

        if (response.error || response.result !== "ok") {
            dispatch(getDispatchObject(SET_TOAST, { open: true, message: "Task not completed", type: "error" }));
            setTaskInput("")
            setCheckTaskButtonIsLoading(false)
            return;
        }

        setCheckTaskButtonIsLoading(false)

        dispatch(getDispatchObject(ADD_GOLD, activeModalParams['award']));

        const event = new Event("TASKS_UPDATE");
        const event2 = new Event("SUPERTASK_UPDATE");
        document.dispatchEvent(event);
        document.dispatchEvent(event2);
        setActiveModal(null);
        dispatch(getDispatchObject(SET_TOAST, { open: true, message: `${formatNumberWithSpaces(activeModalParams.award)} Yescoin Received`, type: "success" }));


        // setActiveModal(MODAL_INFO, {
        //     icon: iconLogo,
        //     title: "You have received",
        //     buttonText: "Thank you 🥳",
        //     description: () => (
        //         <p>{formatNumberWithSpaces(activeModalParams.total_reward || activeModalParams.award)} YesCoin!</p>)
        // });
    }

    return (
        <>
            <Modal
                isOpen={activeModal === MODAL_TASK_CHANNEL}
                placement='center'
                onClose={() => setActiveModal(null)}
            >
                <ModalContent className={"bg-gray-800"}>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">{t('taskModalTitle')}</ModalHeader>
                            <ModalBody>
                                {(activeModalParams['channeladdress'] || activeModalParams['link'] || activeModalParams['botaddress']) && (
                                    <p className="text-16-medium">{t('taskModalText')}</p>
                                )}
                            </ModalBody>
                            <ModalFooter>
                                <div style={{ display: 'block', width: '100%' }}>
                                    {(activeModalParams['channeladdress'] || activeModalParams['link'] || activeModalParams['botaddress']) && (
                                        <Button
                                            size="lg"
                                            fullWidth
                                            color="primary"
                                            style={{ backgroundColor: "#3b82f6" }}
                                            onClick={goToChannel}
                                        >
                                            {activeModalParams['channeladdress'] ? "Open channel" : ""}
                                            {activeModalParams['link'] ? "Open link" : ""}
                                            {activeModalParams['botaddress'] ? "Open bot" : ""}
                                        </Button>
                                    )}

                                    {/*<Button*/}
                                    {/*    style={{color: "#3b82f6", marginTop: 8}}*/}
                                    {/*    fullWidth*/}
                                    {/*    variant="light"*/}
                                    {/*    onClick={() => check(onClose)}*/}
                                    {/*>*/}
                                    {/*    {activeModalParams['channeladdress'] ? "Check subscribe" : "Check task"}*/}
                                    {/*</Button>*/}
                                </div>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
            <Modal
                isOpen={activeModal === MODAL_TASK_CLAIM}
                placement='center'
                onClose={() => setActiveModal(null)}
            >
                <ModalContent className={"bg-gray-800"}>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">{t('taskModalTitle')}</ModalHeader>
                            <ModalBody>
                                {(activeModalParams['channeladdress'] || activeModalParams['link'] || activeModalParams['botaddress']) && (
                                    <p className="text-16-medium text-center">{"Tap here to claim the rewards"}</p>
                                )}
                            </ModalBody>
                            <ModalFooter>
                                <div style={{ display: 'block', width: '100%' }}>
                                    {(activeModalParams['channeladdress'] || activeModalParams['link'] || activeModalParams['botaddress']) && (
                                        <Button
                                            size="lg"
                                            fullWidth
                                            color="primary"
                                            style={{ backgroundColor: "#3b82f6" }}
                                            onClick={() => check(onClose)}
                                        >
                                            {activeModalParams['channeladdress'] ? "Check subscribe" : "Check task"}
                                        </Button>
                                    )}

                                </div>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
            <Modal
                isOpen={activeModal === MODAL_TASK_INPUT}
                placement='center'

                onClose={() => setActiveModal(null)}
            >
                <ModalContent className={"bg-gray-800"}>
                    {(onClose) => (
                        <>
                            <ModalHeader className="flex flex-col gap-1">Validate task</ModalHeader>
                            <ModalBody>
                                {activeModalParams["additional_info"]?.description &&
                                    <p className="text-16-medium mb-0 mt-0"
                                        dangerouslySetInnerHTML={{ __html: activeModalParams["additional_info"] ? activeModalParams["additional_info"].description : "" }}>
                                    </p>
                                }
                                {(activeModalParams["additional_info"]?.helpText) ? (
                                    <span
                                        className="text-md text-white text-center mt-0 mb-0"

                                        dangerouslySetInnerHTML={{ __html: activeModalParams["additional_info"]?.helpText || "Please paste the address I used to connect the wallet to check the tasks." }}>
                                    </span>
                                ) : null}
                                {
                                    activeModalParams["additional_info"]?.instructions_url &&
                                    <Button
                                        style={{ marginTop: 8, color: "#3b82f6" }}
                                        fullWidth
                                        // @ts-ignore
                                        color="extra_primary"
                                        variant="light"
                                        onClick={() => {
                                            // @ts-ignore
                                            tg.openLink(activeModalParams["additional_info"] ? activeModalParams["additional_info"].instructions_url : "")
                                        }}
                                    >
                                        Check Instructions
                                    </Button>
                                }

                                <input className={"bg-white min-h-input-channel px-3 "} placeholder={"Input"}
                                    style={{ borderRadius: 16, background: 'white', color: 'black' }}
                                    value={taskInput} onChange={(e) => setTaskInput(e.target.value)} />
                            </ModalBody>
                            <ModalFooter>
                                <div style={{ display: 'block', width: '100%' }}>
                                    <Button
                                        size="lg"
                                        fullWidth
                                        style={{ backgroundColor: "#3b82f6" }}
                                        className={"text-white"}
                                        isLoading={checkTaskButtonIsLoading}
                                        onClick={() => checkTaskWithInput(onClose)}
                                    >
                                        Check task
                                    </Button>
                                </div>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    );
};

export default TaskChannelModal;