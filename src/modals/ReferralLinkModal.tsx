import { FC, useState, useEffect } from 'react'
import {
    Button,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
} from '@nextui-org/react'
import { useDispatch, useSelector } from 'react-redux'

import { MODAL_REFERRAL, MODAL_INFO } from '../routes'
import { getDispatchObject, SET_TOAST } from '../store/reducer'
import useModal from '../hooks/useModal'
import { fetchData } from '../utils/api'
import iconLogo from '../assets/images/coins/normal.png'

const ReferralLinkModal: FC = () => {
    const { activeModal, setActiveModal, activeModalParams } = useModal()
    const selector: any = useSelector((s) => s)
    const isAmbassador = selector['isAmbassador']

    const dispatch = useDispatch()

    const [taskInput, setTaskInput] = useState<string>('')
    const [isLoading, setLoading] = useState<boolean>(false)

    useEffect(() => {
        setTaskInput(activeModalParams?.link || '')
    }, [activeModalParams])

    const updateReferralLink = async (onClose: () => void) => {
        setLoading(true)

        // Sleep to discurage trying by bruteforce
        await new Promise((r) => setTimeout(r, 3000))

        if (taskInput === '') {
            dispatch(
                getDispatchObject('SET_TOAST', {
                    open: true,
                    message: 'Invalid code',
                    type: 'error',
                })
            )
            setLoading(false)
            return
        }

        if (!isAmbassador) {
            dispatch(
                getDispatchObject('SET_TOAST', {
                    open: true,
                    message: "You don't have permission",
                    type: 'error',
                })
            )
            setLoading(false)
            return
        }

        const response = await fetchData('/tasks/updateReferralLink', {
            id: activeModalParams['supertask_id'],
            taskid: activeModalParams['id'],
            input: taskInput,
        })

        if (response.error || response.result !== 'ok') {
            dispatch(
                getDispatchObject(SET_TOAST, {
                    open: true,
                    message: response.error || 'Task not completed',
                    type: 'error',
                })
            )
            setLoading(false)
            return
        }

        setLoading(false)

        setActiveModal(MODAL_INFO, {
            icon: iconLogo,
            title: 'You have updated',
            buttonText: 'Thank you 🥳',
            description: () => <p>referral link !</p>,
        })
    }

    return (
        <>
            <Modal
                isOpen={activeModal === MODAL_REFERRAL}
                placement='center'
                onClose={() => setActiveModal(null)}
            >
                <ModalContent className={'bg-gray-800'}>
                    {(onClose) => (
                        <>
                            <ModalHeader className='flex flex-col gap-1'>
                                UPLOAD YOUR REFERRAL LINK
                            </ModalHeader>
                            <ModalBody className={'referral_body'}>
                                <p className='text-16-medium mb-0 mt-0'>
                                    {activeModalParams.description}
                                </p>
                                <Input
                                    classNames={{
                                        inputWrapper: 'main-input',
                                    }}
                                    size='md'
                                    value={taskInput}
                                    placeholder='Link (format: https://bingx.com/invite?id=[])'
                                    type='text'
                                    onChange={(event: any) =>
                                        setTaskInput(event.target.value)
                                    }
                                />
                            </ModalBody>
                            <ModalFooter>
                                <div
                                    style={{ display: 'block', width: '100%' }}
                                >
                                    <Button
                                        size='lg'
                                        fullWidth
                                        style={{ backgroundColor: '#3b82f6' }}
                                        className={'text-white'}
                                        isLoading={isLoading}
                                        onClick={() =>
                                            updateReferralLink(onClose)
                                        }
                                    >
                                        Update
                                    </Button>
                                </div>
                            </ModalFooter>
                        </>
                    )}
                </ModalContent>
            </Modal>
        </>
    )
}

export default ReferralLinkModal
