import {
    Button,
    Input,
    Modal,
    ModalBody,
    ModalContent,
    ModalFooter,
    ModalHeader,
} from '@nextui-org/react'
import React, { FC, useEffect, useState } from 'react'
import { MODAL_ADMIN_TASK } from '../routes'
import useModal from '../hooks/useModal'
/* import { useTranslation } from "react-i18next"; */
import { fetchData } from '../utils/api'
import Spacing from '../components/Spacing/Spacing'
import Img from '../components/Img/Img'

// @ts-ignore
const tg = window['Telegram'].WebApp

const AdminTaskModal: FC = () => {
    const [titleInput, setTitleInput] = useState('')
    const [awardInput, setAwardInput] = useState('')
    const [channelAddressInput, setChannelAddressInput] = useState('')
    const [linkInput, setLinkInput] = useState('')
    const [botInput, setBotInput] = useState('')

    /* const { t } = useTranslation(); */
    const { activeModal, setActiveModal, activeModalParams } = useModal()

    const deleteTask = async (onClose: () => void) => {
        if (!activeModalParams) {
            return
        }

        const response = await fetchData('/admin/deleteTask', {
            id: activeModalParams.id,
        })

        if (response.error) {
            return
        }

        const event = new Event('admin_update')
        document.dispatchEvent(event)

        onClose()
    }

    const save = async (onClose: () => void) => {
        const award = Number(awardInput)
        if (!award || award < 1) {
            // @ts-ignore
            tg.showAlert('select correct award')
            return
        }

        if (titleInput.length < 1 || titleInput.length > 200) {
            // @ts-ignore
            tg.showAlert('invalid title')
            return
        }

        if (
            channelAddressInput.length < 1 &&
            linkInput.length < 1 &&
            botInput.length < 1
        ) {
            // @ts-ignore
            tg.showAlert(
                'you need to specify either the link or the channel address'
            )
            return
        }

        const params: any = {
            award,
            title: titleInput,
        }

        if (channelAddressInput.length > 0) {
            if (
                channelAddressInput.length < 2 ||
                channelAddressInput.length > 150
            ) {
                // @ts-ignore
                tg.showAlert(
                    'select correct address of channel (format: @channel)'
                )
                return
            }

            const channelAddressRegex = /^@[A-Za-z0-9_]+$/
            if (!channelAddressRegex.test(channelAddressInput)) {
                // @ts-ignore
                tg.showAlert(
                    'select correct address of channel (format: @channel)'
                )
                return
            }

            params.channelAddress = channelAddressInput
        }

        if (botInput.length > 0) {
            if (botInput.length < 2 || botInput.length > 150) {
                // @ts-ignore
                tg.showAlert('select correct address of bot (format: @bot)')
                return
            }

            const botAddressRegex = /^@[A-Za-z0-9_]+$/
            if (!botAddressRegex.test(botInput)) {
                // @ts-ignore
                tg.showAlert('select correct address of bot (format: @bot)')
                return
            }

            params.botAddress = botInput
        }

        if (linkInput.length > 0) {
            if (linkInput.length < 2 || linkInput.length > 300) {
                // @ts-ignore
                tg.showAlert('select correct link (format: https://site.com)')
                return
            }

            const linkRegex =
                /^(?:https?:\/\/)?(?:\w+\.)?[a-zA-Z0-9-]+\.[a-zA-Z]{2,}(?:\/\S*)?$/
            if (!linkRegex.test(linkInput)) {
                // @ts-ignore
                tg.showAlert('select correct link (format: https://site.com)')
                return
            }

            params.link = linkInput
        }

        if (activeModalParams) {
            params.id = activeModalParams.id
        }

        const response = await fetchData('/admin/saveTask', params)

        if (response.error) {
            return
        }

        const event = new Event('admin_update')
        document.dispatchEvent(event)

        onClose()
    }

    useEffect(() => {
        if (activeModalParams) {
            setAwardInput(activeModalParams['award'])
            setChannelAddressInput(activeModalParams['channelAddress'])
            setLinkInput(activeModalParams['link'])
            setTitleInput(activeModalParams['title'])
        } else {
            setAwardInput('')
            setChannelAddressInput('')
            setLinkInput('')
            setTitleInput('')
        }
    }, [activeModalParams])

    return (
        <Modal
            isOpen={activeModal === MODAL_ADMIN_TASK}
            placement='center'
            onClose={() => setActiveModal(null)}
        >
            <ModalContent>
                {(onClose) => (
                    <>
                        <ModalHeader className='flex flex-col gap-1'>
                            {activeModalParams ? 'Edit task' : 'New task'}
                        </ModalHeader>

                        <ModalBody>
                            <Input
                                isRequired
                                size='md'
                                value={titleInput}
                                placeholder='Title'
                                type='text'
                                onChange={(event) =>
                                    setTitleInput(event.target.value)
                                }
                            />

                            <Input
                                isRequired
                                size='md'
                                value={awardInput}
                                placeholder='Award'
                                type='number'
                                startContent={
                                    <Img
                                        src={require('../assets/images/coins/rocket_coin_back_36x36.png')}
                                        width={19}
                                        height={19}
                                    />
                                }
                                onChange={(event) =>
                                    setAwardInput(event.target.value)
                                }
                            />

                            <div>
                                <Input
                                    isRequired
                                    size='md'
                                    value={linkInput}
                                    type='text'
                                    placeholder='Link (format: https://site.com)'
                                    onChange={(event) =>
                                        setLinkInput(event.target.value)
                                    }
                                />
                                <Spacing size={8} />
                                <p className='text-14-medium text-gray'>
                                    Not necessary if you specify the channel
                                    address below
                                </p>
                            </div>

                            <div>
                                <Input
                                    isRequired
                                    size='md'
                                    value={channelAddressInput}
                                    type='text'
                                    placeholder='Channel (format: @channel)'
                                    onChange={(event) =>
                                        setChannelAddressInput(
                                            event.target.value
                                        )
                                    }
                                />
                                <Spacing size={8} />
                                <p className='text-14-medium text-gray'>
                                    Not necessary if you specify the link above.
                                    The bot needs to be added to this channel
                                    and appointed as an administrator!
                                </p>
                            </div>

                            <div>
                                <Input
                                    isRequired
                                    size='md'
                                    value={botInput}
                                    type='text'
                                    placeholder='Bot (format: @bot)'
                                    onChange={(event) =>
                                        setBotInput(event.target.value)
                                    }
                                />
                                <Spacing size={8} />
                                <p className='text-14-medium text-gray'>
                                    Optional
                                </p>
                            </div>
                        </ModalBody>

                        <ModalFooter>
                            {activeModalParams && (
                                <Button
                                    fullWidth
                                    color='danger'
                                    variant='light'
                                    onClick={() => deleteTask(onClose)}
                                >
                                    Delete
                                </Button>
                            )}

                            <Button
                                fullWidth
                                color='primary'
                                onClick={() => save(onClose)}
                            >
                                Save
                            </Button>
                        </ModalFooter>
                    </>
                )}
            </ModalContent>
        </Modal>
    )
}

export default AdminTaskModal
