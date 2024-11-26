import React, { useCallback, useEffect, useState } from 'react'
import useModal from '../../hooks/useModal'
import { fetchData } from '../../utils/api'
import { MODAL_INFO } from '../../routes'
import { formatNumberWithSpaces } from '../../utils/mathUtils'

const tg = (window as any).Telegram.WebApp

const ModalStories = ({
    images,
    onClose,
    taskdata,
    fetchSettings,
    fromWheel,
    hasViewedStories,
}: {
    images: string[]
    onClose: () => void
    taskdata: any
    fetchSettings: () => void
    fromWheel?: boolean
    hasViewedStories: boolean
}) => {
    const [selectedIndex, setSelectedIndex] = useState<number>(0)
    const handleTelegramClick = useCallback(() => {
        const isNotLastStep = selectedIndex < images.length - 1
        if (!isNotLastStep) {
            if (
                taskdata?.story_reward &&
                taskdata?.story_reward > 0 &&
                !hasViewedStories
            ) {
                checkStoriesAward()
            } else {
                onClose()
            }
        } else {
            setSelectedIndex(selectedIndex + 1)
        }
    }, [selectedIndex, images, onClose, hasViewedStories])
    const { setActiveModal } = useModal()
    const checkStoriesAward = useCallback(async () => {
        if (!taskdata) return
        try {
            const response = await fetchData('/supertasks/checkStories', {
                id: taskdata.id,
            })
            //@ts-expect-error emer
            if (response.status !== 'error') {
                setActiveModal(MODAL_INFO, {
                    icon: '/rocket_coin_back_36x36.png',
                    title: 'You have received',
                    buttonText: 'Thank you 🥳',
                    description: () => (
                        <p>
                            {formatNumberWithSpaces(taskdata.story_reward)}{' '}
                            YesCoin!
                        </p>
                    ),
                })
                fetchSettings()
            }
            onClose()
        } catch {}
    }, [taskdata?.story_reward])

    useEffect(() => {
        // @ts-ignore
        tg.MainButton.show()
        const isNotLastStep = selectedIndex < images.length - 1
        if (!isNotLastStep) {
            if (
                taskdata?.story_reward &&
                taskdata?.story_reward > 0 &&
                !hasViewedStories
            ) {
                // @ts-ignore
                tg.MainButton.setText('Redeem prize')
            } else {
                // @ts-ignore
                tg.MainButton.setText('Close')
            }
        } else {
            // @ts-ignore
            tg.MainButton.setText('Next')
        }
        // @ts-ignore
        tg.MainButton.onClick(handleTelegramClick)
        return () => {
            // @ts-ignore
            tg.MainButton.offClick(handleTelegramClick)
        }
    }, [selectedIndex, handleTelegramClick, images, onClose])
    useEffect(() => {
        return () => {
            // @ts-ignore
            tg.MainButton.hide()
        }
    }, [])
    const handleImageClick = (event: React.MouseEvent<HTMLDivElement>) => {
        const { clientX, currentTarget } = event
        const { left, width } = currentTarget.getBoundingClientRect()
        const clickPosition = clientX - left

        if (clickPosition < width / 2) {
            // Clicked on the left side, go backward
            setSelectedIndex(
                (prevIndex) => (prevIndex - 1 + images.length) % images.length
            )
        } else {
            // Clicked on the right side, go forward
            if (fromWheel && selectedIndex === images.length - 1) {
                onClose()
            } else {
                setSelectedIndex((prevIndex) => (prevIndex + 1) % images.length)
            }
        }
    }

    return (
        <div className='fixed z-50 inset-0'>
            <div className='flex w-full gap-1'>
                {images.length > 0 && (
                    <div
                        className={
                            'py-2 w-full absolute left-0 top-0 flex gap-2 px-1'
                        }
                    >
                        {images.map((e, index) => (
                            <div
                                key={`story${index}`}
                                className='bg-white flex-1 rounded-2xl'
                                style={{
                                    minHeight: '3px',
                                    opacity: index === selectedIndex ? 1 : 0.5,
                                }}
                            />
                        ))}
                    </div>
                )}
            </div>
            <div className='w-full h-full' onClick={handleImageClick}>
                <img
                    src={images[selectedIndex]}
                    alt=''
                    className='w-full h-full object-cover'
                />
            </div>
        </div>
    )
}

export default ModalStories
