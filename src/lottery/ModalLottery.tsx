import React, { useState, useEffect, useRef } from 'react'
import {
    AnimationTags,
    ROTATING_STAR,
    WHEEL_BASE,
} from './Animations/InterfacesAndConstants'
import getAnimationFromTag from './Animations/getAnimationFromTag'

interface LotteryModalProps {
    isOpen: boolean
    onClose: () => void
}

interface Page {
    title: string
    content: string
    image?: string
    animation?: AnimationTags
}

const LotteryModal: React.FC<LotteryModalProps> = ({ isOpen, onClose }) => {
    const [currentPage, setCurrentPage] = useState(0)
    const totalPages = 4
    const containerRef = useRef<HTMLDivElement>(null)

    useEffect(() => {
        if (isOpen) {
            setCurrentPage(0)
            containerRef.current?.scrollTo(0, 0)
        }
    }, [isOpen])

    const pages: Page[] = [
        {
            title: 'What is this?',
            content:
                'Welcome to the Wheel of Luck. Spin it to win Telegram Premium, the cryptocurrency TON, and in-game bonuses!',
            animation: ROTATING_STAR,
        },
        {
            title: 'How to Play',
            content:
                "Simply spin the wheel and see what prize you win! It's that easy!",
            animation: WHEEL_BASE,
        },
        {
            title: 'Prizes',
            content:
                'Win amazing prizes including Telegram Premium, TON cryptocurrency, and special in-game bonuses!',
            animation: ROTATING_STAR,
        },
        {
            title: 'Ready?',
            content: "Let's start spinning and winning! Good luck!",
            animation: WHEEL_BASE,
        },
    ]

    const nextPage = () => {
        if (currentPage < totalPages - 1) {
            setCurrentPage((prevPage) => prevPage + 1)
        } else {
            onClose()
        }
    }

    const prevPage = () => {
        if (currentPage > 0) {
            setCurrentPage((prevPage) => prevPage - 1)
        }
    }

    useEffect(() => {
        if (isOpen) {
            document.body.style.overflow = 'hidden'
        } else {
            document.body.style.overflow = 'unset'
        }
        return () => {
            document.body.style.overflow = 'unset'
        }
    }, [isOpen])

    useEffect(() => {
        if (containerRef.current) {
            containerRef.current.style.transform = `translateX(-${currentPage * 100}%)`
        }
    }, [currentPage])

    if (!isOpen) return null

    return (
        <div className='Modal-Lottery--overlay'>
            <div className='Modal-Lottery--container'>
                <div className='Modal-Lottery--header'>
                    <span className='Modal-Lottery--title'>Lottery</span>
                </div>
                <div className='Modal-Lottery--content'>
                    <div
                        className='Modal-Lottery--pages-container'
                        ref={containerRef}
                    >
                        {pages.map((page, index) => (
                            <div key={index} className='Modal-Lottery--page'>
                                <div className='Modal-Lottery--image-container'>
                                    {page.animation ? (
                                        getAnimationFromTag(page.animation)
                                    ) : (
                                        <img
                                            src={page.image}
                                            alt={page.title}
                                            className='Modal-Lottery--image'
                                        />
                                    )}
                                </div>
                                <h2 className='Modal-Lottery--content-title'>
                                    {page.title}
                                </h2>
                                <p className='Modal-Lottery--description'>
                                    {page.content}
                                </p>
                            </div>
                        ))}
                    </div>
                    {currentPage > 0 && (
                        <button
                            className='Modal-Lottery--arrow Modal-Lottery--arrow-left'
                            onClick={prevPage}
                        >
                            <svg
                                width='24'
                                height='24'
                                viewBox='0 0 24 24'
                                fill='none'
                                xmlns='http://www.w3.org/2000/svg'
                            >
                                <path
                                    d='M15 18L9 12L15 6'
                                    stroke='currentColor'
                                    strokeWidth='2'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                />
                            </svg>
                        </button>
                    )}
                    {currentPage < totalPages - 1 && (
                        <button
                            className='Modal-Lottery--arrow Modal-Lottery--arrow-right'
                            onClick={nextPage}
                        >
                            <svg
                                width='24'
                                height='24'
                                viewBox='0 0 24 24'
                                fill='none'
                                xmlns='http://www.w3.org/2000/svg'
                            >
                                <path
                                    d='M9 18L15 12L9 6'
                                    stroke='currentColor'
                                    strokeWidth='2'
                                    strokeLinecap='round'
                                    strokeLinejoin='round'
                                />
                            </svg>
                        </button>
                    )}
                    <div className='Modal-Lottery--pagination'>
                        {[...Array(totalPages)].map((_, i) => (
                            <div
                                key={i}
                                className={`Modal-Lottery--dot ${i === currentPage ? 'active' : ''}`}
                            />
                        ))}
                    </div>
                </div>
                <div className='Modal-Lottery--footer'>
                    <button
                        onClick={nextPage}
                        className='Modal-Lottery--next-button btn-gradient'
                    >
                        {currentPage === totalPages - 1
                            ? 'Get Started'
                            : 'Next'}
                    </button>
                </div>
            </div>
        </div>
    )
}

export default LotteryModal
