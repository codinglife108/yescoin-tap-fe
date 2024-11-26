import React, { useState, useEffect, useCallback } from 'react'
import { CancelOutlined, CheckCircleOutlined } from '@mui/icons-material'
import { useDispatch, useSelector } from 'react-redux'
import {
    DefaultStateType,
    getDispatchObject,
    SET_TOAST,
} from '../store/reducer'

export default function CustomToast() {
    const [isIconAnimated, setIsIconAnimated] = useState(false)
    const {
        open: isVisible,
        message,
        type,
    } = useSelector((state: DefaultStateType) => state.toast)
    const dispatch = useDispatch()
    const close = useCallback(() => {
        dispatch(getDispatchObject(SET_TOAST, { open: false, message, type }))
    }, [dispatch, message, type])

    useEffect(() => {
        if (isVisible) {
            const iconTimer = setTimeout(() => setIsIconAnimated(true), 300)
            const hideTimer = setTimeout(() => close(), 4000)

            return () => {
                clearTimeout(iconTimer)
                clearTimeout(hideTimer)
            }
        } else {
            setIsIconAnimated(false)
        }
    }, [close, isVisible])

    const LinkIcon = (props: any) => {
        return (
            <div
                className='p-1 bg-white rounded-full mr-2'
                style={{ borderRadius: '100%' }}
            >
                <img
                    width={15}
                    src={
                        'https://yes-coin-img-teams.blr1.cdn.digitaloceanspaces.com/icons8-link-100.png'
                    }
                />
            </div>
        )
    }

    const Icon =
        type === 'success'
            ? (props: any) => <CheckCircleOutlined {...props} />
            : type == 'link'
              ? (props: any) => <LinkIcon {...props} />
              : type === 'noicon'
                ? (props: any) => <></>
                : (props: any) => <CancelOutlined {...props} />
    const bgColor = 'bg-gray-800'

    return (
        <div
            className={`
        fixed bottom-4 left-1/2 transform -translate-x-1/2
        transition-all duration-500 ease-in-out
        ${isVisible ? 'translate-y-0 opacity-100 z-50' : 'translate-y-full opacity-0'}
      `}
        >
            <div
                className={`${bgColor} text-white p-4 rounded-lg shadow-lg flex items-center`}
                style={{ width: '90vw' }}
            >
                <div
                    className={`transition-all duration-300 ${isIconAnimated ? 'scale-100' : 'scale-0'}`}
                >
                    <Icon className='mr-2' size={'xl'} />
                </div>
                <span>{message}</span>
            </div>
        </div>
    )
}
