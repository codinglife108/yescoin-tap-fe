import { useCallback, useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import Panel from '../../../components/Panel/Panel'
import BackgroundGlow from '../../../components/BackgroundGlow/BackgroundGlow'
import { formatNumberWithSpaces } from '../../../utils/mathUtils'
import { useDispatch, useSelector } from 'react-redux'
import TelegramBackButton from '../../../components/TelegramBackButton/TelegramBackButton'
import { fetchData } from '../../../utils/api'
import useModal from '../../../hooks/useModal'
import {
    getDispatchObject,
    SET_TASKS,
    ADD_GOLD,
    SET_TOAST,
} from '../../../store/reducer'
import { Button, Input } from '@nextui-org/react'
import { ROUTE_HOME, ROUTE_SUPERTASKS, ROUTE_TASKS } from '../../../routes'
import { OpenInNew } from '@mui/icons-material'
import './RequireInput.css'

// @ts-ignore
const tg = window['Telegram']['WebApp']

const RequireInput = () => {
    const { id, supertask_id } = useParams()
    const navigate = useNavigate()
    const tasks = useSelector((state: any) => state.tasks)
    const dispatch = useDispatch()
    const [taskInput, setTaskInput] = useState<string>('')
    const [checkTaskButtonIsLoading, setCheckTaskButtonIsLoading] =
        useState<boolean>(false)
    const [isFaildInput, setIsFaildInput] = useState<boolean>(false)
    const [isOpenNewTab, setIsOpenNewTab] = useState<boolean>(false)
    const [stepData, setStepData] = useState<any>({})
    const [faildMessage, setFaildMessage] = useState<string>('')
    const { activeModal, setActiveModal } = useModal()

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
        setCheckTaskButtonIsLoading(false)
    }

    const checkTaskWithInput = async () => {
        if (taskInput === '') {
            setFaild('Invalid code')
            return
        }

        const confirm_value = stepData.additional_info.input_value
        const number_range = stepData.additional_info.number_range

        if (
            !(
                (taskInput === confirm_value && confirm_value !== undefined) ||
                isValidInput(taskInput, number_range)
            )
        ) {
            setFaild('Task not completed')
            return
        }

        setCheckTaskButtonIsLoading(false)
        dispatch(getDispatchObject(ADD_GOLD, stepData['award']))

        const event = new Event('TASKS_UPDATE')
        const event2 = new Event('SUPERTASK_UPDATE')
        document.dispatchEvent(event)
        document.dispatchEvent(event2)
        setActiveModal(null)
        dispatch(
            getDispatchObject(SET_TOAST, {
                open: true,
                message: `${formatNumberWithSpaces(
                    stepData.award
                )} Yescoin Received`,
                type: 'success',
            })
        )
        if (supertask_id === 'not_supertask') navigate(ROUTE_TASKS)
        else navigate(`${ROUTE_SUPERTASKS}/${supertask_id}`)

        const response = await fetchData('/tasks/check', {
            id: stepData['id'],
            input: taskInput,
        })

        if (response.error || response.result !== 'ok') {
            setFaild('Task not completed')
            return
        }

        setIsFaildInput(false)
        setFaildMessage('')
        fetchCampaigns()
    }

    const checkIsModal = useCallback(
        async (onlyCheck: boolean = true, propsStep: any) => {
            const checkStep = propsStep || stepData
            if (checkStep['award'] === -1) {
                if (checkStep['botaddress']) {
                    checkWithOpenModal(false,
                        onlyCheck,
                        `https://t.me/${checkStep['botaddress'].replace(
                            '@',
                            ''
                        )}`
                    )
                    return
                } else if (checkStep['link']) {
                    if (checkStep['link'].startsWith('https://t.me/')) {
                        checkWithOpenModal(false, onlyCheck, checkStep['link'])
                        return
                    }
                    checkWithOpenModal(true, onlyCheck, checkStep['link'])
                    return
                } else if (checkStep['channeladdress']) {
                    checkWithOpenModal(false,
                        onlyCheck,
                        `https://t.me/${checkStep['channeladdress'].replace(
                            '@',
                            ''
                        )}`
                    )
                    return
                }
                return
            }

            if (checkStep['botaddress']) {
                checkWithOpenModal(false,
                    onlyCheck,
                    `https://t.me/${checkStep['botaddress'].replace('@', '')}`
                )
            } else if (checkStep['link']) {
                if (checkStep['link'].startsWith('https://t.me/')) {
                    checkWithOpenModal(false, onlyCheck, checkStep['link'])
                    return
                }
                checkWithOpenModal(true, onlyCheck, checkStep['link'])
            } else if (checkStep['channeladdress']) {
                checkWithOpenModal(false,
                    onlyCheck,
                    `https://t.me/${checkStep['channeladdress'].replace(
                        '@',
                        ''
                    )}`
                )
            }
        },
        [stepData]
    )
    const checkWithOpenModal = (openLink: boolean = true, onlyCheck: boolean = true, link: string) => {
        if (onlyCheck) {
            setIsOpenNewTab(true)
        } else {
            if (openLink) {
                // @ts-ignore
                tg.openLink(link)
            } else {
                // @ts-ignore
                tg.openTelegramLink(link)
            }
        }
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
        checkIsModal(true, step)
    }, [tasks, id])

    const createEventListeners = useCallback(() => {
        document.addEventListener('TASKS_UPDATE', fetchCampaigns)
    }, [fetchCampaigns])

    const removeEventListeners = useCallback(() => {
        document.removeEventListener('TASKS_UPDATE', fetchCampaigns)
    }, [fetchCampaigns])

    const isValidInput = (inputValue: string, number_range: string) => {
        if (number_range && number_range.toString().length > 2) {
            const [minDigits, maxDigits] = number_range.split(',').map(Number)
            const numDigits = inputValue.toString().length
            return numDigits >= minDigits && numDigits <= maxDigits
        } else {
            return false
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
                        {isOpenNewTab && (
                            <div
                                className='cursor-pointer'
                                style={{
                                    position: 'relative',
                                    padding: 7,
                                    borderRadius: '50%',
                                    background: 'rgb(255 255 255 / 41%)',
                                    width: 31,
                                    height: 32,
                                }}
                                onClick={() => checkIsModal(false, null)}
                            >
                                <OpenInNew
                                    className='absolute top-[-10px] right-0 '
                                    style={{
                                        width: '16px',
                                        position: 'relative',
                                    }}
                                />
                            </div>
                        )}
                    </div>
                    <div>
                        {stepData['additional_info']?.description && (
                            <p
                                className='text-16-medium mb-0 mt-0'
                                dangerouslySetInnerHTML={{
                                    __html: stepData['additional_info']
                                        ? stepData['additional_info']
                                            .description
                                        : '',
                                }}
                            ></p>
                        )}
                        {stepData['additional_info']?.helpText ? (
                            <span
                                className='text-md text-white text-center mt-0 mb-0'
                                dangerouslySetInnerHTML={{
                                    __html:
                                        stepData['additional_info']?.helpText ||
                                        'Please paste the address I used to connect the wallet to check the tasks.',
                                }}
                            ></span>
                        ) : null}
                        {stepData['additional_info']?.instructions_url && (
                            <Button
                                style={{ marginTop: 8, color: '#3b82f6' }}
                                fullWidth
                                // @ts-ignore
                                color='extra_primary'
                                variant='light'
                                onClick={() => {
                                    // @ts-ignore
                                    tg.openLink(
                                        stepData['additional_info']
                                            ? stepData['additional_info']
                                                .instructions_url
                                            : ''
                                    )
                                }}
                            >
                                Check Instructions
                            </Button>
                        )}
                        <br />
                        <p
                            style={{
                                paddingLeft: 10,
                                fontSize: 20,
                                paddingBottom: 10,
                            }}
                        >
                            Verification
                        </p>
                        <Input
                            classNames={{
                                inputWrapper: isFaildInput
                                    ? 'verifycode-input faild_input_task'
                                    : 'verifycode-input',
                            }}
                            size='md'
                            value={taskInput}
                            placeholder='Code or Digit number'
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
                        {stepData['additional_info']?.reward_help_text && (
                            <p style={{ paddingLeft: 10, fontSize: 14 }}>
                                {stepData['additional_info']?.reward_help_text}
                            </p>
                        )}
                    </div>
                </div>
                <div
                    style={{
                        display: 'block',
                        width: '100%',
                        paddingBottom: '3rem',
                    }}
                >
                    <Button
                        size='lg'
                        fullWidth
                        style={{ backgroundColor: '#3b82f6' }}
                        className={'text-white'}
                        isLoading={checkTaskButtonIsLoading}
                        onClick={() => checkTaskWithInput()}
                    >
                        Check task
                    </Button>
                </div>
            </div>
        </Panel>
    )
}

export default RequireInput
