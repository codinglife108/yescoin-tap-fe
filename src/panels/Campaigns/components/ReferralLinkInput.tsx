import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import Panel from '../../../components/Panel/Panel'
import BackgroundGlow from '../../../components/BackgroundGlow/BackgroundGlow'
import { useDispatch, useSelector } from 'react-redux'
import TelegramBackButton from '../../../components/TelegramBackButton/TelegramBackButton'
import { fetchData } from '../../../utils/api'
import useModal from '../../../hooks/useModal'
import {
    getDispatchObject,
    SET_TASKS,
    SET_TOAST,
} from '../../../store/reducer'
import { Button, Input } from '@nextui-org/react'
import { ROUTE_HOME, ROUTE_SUPERTASKS, ROUTE_TASKS } from '../../../routes'
import './RequireInput.css'
import { hideButton, resetMainButton, setButtonLoader, setButtonText, showButton } from '../../../utils/tgButtonUtils'

// @ts-ignore
const tg = window['Telegram']['WebApp']

const ReferralLinkInput = () => {
    const { t } = useTranslation()
    const { id, supertask_id } = useParams()
    const selector: any = useSelector((s) => s);
    const isAmbassador = selector['isAmbassador'];
    const navigate = useNavigate()
    const tasks = useSelector((state: any) => state.tasks)
    const dispatch = useDispatch()
    const [taskInput, setTaskInput] = useState<string>('')
    const [isFaildInput, setIsFaildInput] = useState<boolean>(false)
    const [stepData, setStepData] = useState<any>({})
    const [faildMessage, setFaildMessage] = useState<string>('')
    const activeModal = useModal()

    useEffect(() => {
        setTaskInput('')
        setIsFaildInput(false)
    }, [activeModal])

    const fetchCampaigns = useCallback(async () => {
        try {
            const response = await fetchData('/tasks/get')

            const tasks = response.result.tasks
            let sections = response.result.sections
            const superTasks = response.result.superTasks

            sections = sections.map((section: any) => ({
                ...section,
                steps: tasks.filter(
                    (task: any) => task.section_id === section.id
                ),
            }))

            const independentTasks = tasks.filter(
                (task: any) => !task.supertask_id
            )

            const superTasksWithSteps = superTasks
                .map((superTask: any) => ({
                    ...superTask,
                    type: 'supertask',
                    sections: sections.filter(
                        (section: any) => section.supertask_id === superTask.id
                    ),
                    steps: tasks.filter(
                        (task: any) =>
                            task.supertask_id === superTask.id &&
                            (task?.section_id == null ||
                                task?.section_id == '' ||
                                task?.section_id == undefined)
                    ),
                }))
                .sort((a: any, b: any) => a.orderpriority - b.orderpriority)

            const allCampaigns = [
                ...superTasksWithSteps,
                ...independentTasks.map((task: any) => ({
                    ...task,
                    type: 'task',
                })),
            ]

            dispatch(getDispatchObject(SET_TASKS, allCampaigns))
        } catch (e: any) {
            console.log(e)
        }
    }, [dispatch])

    const setFaild = (message: string) => {
        setTaskInput('')
        setIsFaildInput(true)
        setFaildMessage(message)
        setButtonLoader(false);
    }

    const checkTaskWithInput = async () => {

        setButtonLoader(true, false);

        if (taskInput === '') {
            setFaild('Invalid link')
            return
        }

        if (stepData?.additional_info?.refer_link_type != undefined) {
            if (!taskInput.includes(stepData?.additional_info?.refer_link_type)) {
                setFaild('Invalid link type')
                return
            }
        }

        if (!isAmbassador) {
            dispatch(
                getDispatchObject("SET_TOAST", {
                    open: true,
                    message: "You don't have permission",
                    type: "error",
                })
            );
            setButtonLoader(false);
            return;
        }


        const response = await fetchData("/tasks/updateReferralLink", {
            id: stepData["supertask_id"],
            taskid: stepData["id"],
            input: taskInput,
        });

        if (response.error || response.result !== "ok") {
            dispatch(
                getDispatchObject(SET_TOAST, {
                    open: true,
                    message: response.error || "Task not completed",
                    type: "error",
                })
            );
            setButtonLoader(false);
            return;
        }


        dispatch(
            getDispatchObject(SET_TOAST, {
                open: true,
                message: `Your referral link have updated`,
                type: 'success',
            })
        );

        setButtonLoader(false);
        if (supertask_id === 'not_supertask') navigate(ROUTE_TASKS)
        else navigate(`${ROUTE_SUPERTASKS}/${supertask_id}`)

        setIsFaildInput(false)
        setFaildMessage('')
        fetchCampaigns()
    }

    const fetchTask = useCallback(async () => {
        if (!tasks.length || !id) {
            fetchCampaigns()
            return
        }
        let step = tasks.find((task: any) => `${task.id}` === `${id}`)
        if (!step)
            for (const task of tasks) {
                step = task.steps.find((val: any) => `${val.id}` === `${id}`)
                if (!step)
                    if (task?.sections?.length > 0)
                        for (const section of task.sections) {
                            if (section?.steps?.length > 0) {
                                step = section.steps.find(
                                    (val: any) => `${val.id}` === `${id}`
                                )
                                if (step) break
                            }
                        }
                if (step) break
            }
        if (!step) return
        if (
            step['additional_info'] &&
            typeof step['additional_info'] === 'string'
        ) {
            step['additional_info'] = JSON.parse(step['additional_info'])
        }
        setStepData(step)
        if (step?.link != undefined) {
            setTaskInput(step.link);
        }
    }, [tasks, id])

    const createEventListeners = useCallback(() => {
        document.addEventListener('TASKS_UPDATE', fetchCampaigns)
    }, [fetchCampaigns])

    const removeEventListeners = useCallback(() => {
        document.removeEventListener('TASKS_UPDATE', fetchCampaigns)
    }, [fetchCampaigns])

    const tgMainButtonShow = () => {
        resetMainButton()
        // @ts-ignore
        tg.MainButton.onClick(checkTaskWithInput)
        hideButton()
        setTimeout(() => {
            setButtonText(t('updateButton'))
            showButton()
        }, 50)
        return () => {
            // @ts-ignore
            tg.MainButton.offClick(checkTaskWithInput)
            hideButton()
        }
    }

    useEffect(() => {
        createEventListeners()
        return () => {
            removeEventListeners()
        }
    }, [fetchTask, createEventListeners, removeEventListeners])

    useEffect(() => {
        fetchTask()
    }, [tasks, dispatch])

    useEffect(() => {
        tgMainButtonShow();
        return () => {
            // @ts-ignore
            tg.MainButton.offClick(checkTaskWithInput)
            hideButton()
        }
    }, [])

    return (
        <Panel style={{ height: '100%' }} contentStyle={{ height: '100%' }}>
            <BackgroundGlow
                color1='#000'
                color2='#000'
                color3='#000'
                vertical='bottom'
                fromBottom
            />
            <TelegramBackButton url={ROUTE_HOME} />
            <br />
            <div
                style={{
                    display: 'grid',
                    alignContent: 'space-between',
                    height: '100%',
                }}
            >
                <div>
                    <div
                        className='flex gap-1'
                        style={{
                            alignItems: 'center',
                            justifyContent: 'space-between',
                            fontSize: 24,
                        }}
                    >
                        <div>{stepData.title}</div>
                    </div>
                    <br />
                    <div>
                        <p
                            style={{
                                paddingLeft: 10,
                                fontSize: 20,
                                paddingBottom: 10,
                            }}
                        >
                            UPLOAD YOUR REFERRAL LINK
                        </p>
                        <Input
                            classNames={{
                                inputWrapper: isFaildInput
                                    ? 'verifycode-input faild_input_task'
                                    : 'verifycode-input',
                            }}
                            size='md'
                            value={taskInput}
                            placeholder={`Link (format: ${stepData?.additional_info?.refer_link_type || 'https://bingx.com/invite?id=[]'})`}
                            type='text'
                            onChange={(event: any) =>
                                setTaskInput(event.target.value)
                            }
                        />
                        {isFaildInput && (
                            <p className='faild_input_message'>
                                {faildMessage}
                            </p>
                        )}
                    </div>
                </div>
            </div>
        </Panel>
    )
}

export default ReferralLinkInput
