import React, { useEffect, useState, useCallback } from 'react'
import { AnimatePresence, motion } from 'framer-motion'
import tempLogo from '../../assets/lottery/tempSlider.svg'

interface BottomPopupProps {
    content: string
}

const TempLogo = () => {
    return <img src={tempLogo} alt='tempLogo' />
}

const BottomPopup: React.FC<BottomPopupProps> = ({ content }) => {
    return (
        <motion.div
            initial={{ opacity: 0, x: '100%' }}
            animate={{ opacity: 1, x: '0%' }}
            exit={{ opacity: 0, x: '-100%' }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className='fixed flex rounded-xl items-center justify-center p-1 gap-2'
            style={{
                backgroundColor: '#0007',
                width: 'max-content',
                height: '50px',
                bottom: '36px',
                left: '12px',
                right: '0',
            }}
        >
            <TempLogo />
            <h4 className='text-sm text-center'>User won {content}</h4>
            <span className='text-2xl'>🎉</span>
        </motion.div>
    )
}

interface Popup {
    id: string
    content: string
}

const PopupInstantiator: React.FC = () => {
    const [activePopup, setActivePopup] = useState<Popup | null>(null)

    const addPopup = useCallback(() => {
        if (activePopup) return // Non aggiungere un nuovo popup se ce n'è già uno attivo

        fetch(
            `https://yescoinleaderboard.blr1.cdn.digitaloceanspaces.com/last_win/last_win.json?refresh=true&timestamp=${new Date().getTime()}`,
            {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json',
                    'Cache-Control':
                        'no-store, no-cache, must-revalidate, max-age=0',
                    Pragma: 'no-cache',
                    Expires: '0',
                },
            }
        ).then((res) =>
            res.json().then((data) => {
                console.log(data)
                let toShow = ''
                let alreadyShownLocalStorage = localStorage.getItem('last_win')
                let alreadyShown = alreadyShownLocalStorage
                    ? JSON.parse(alreadyShownLocalStorage)
                    : []

                Object.keys(data).forEach((key) => {
                    if (!alreadyShown.includes(data[key])) {
                        toShow = key
                    }
                })

                if (toShow) {
                    alreadyShown.push(data[toShow])
                    localStorage.setItem(
                        'last_win',
                        JSON.stringify(alreadyShown)
                    )
                    setActivePopup({
                        id: `popup-${Date.now()}`,
                        content: toShow,
                    })
                }
            })
        )
    }, [activePopup])

    useEffect(() => {
        const interval = setInterval(addPopup, 2500)
        return () => clearInterval(interval)
    }, [addPopup])

    useEffect(() => {
        if (activePopup) {
            const timer = setTimeout(() => {
                setActivePopup(null)
            }, 3000)

            return () => clearTimeout(timer)
        }
    }, [activePopup])

    return (
        <AnimatePresence>
            {activePopup && (
                <BottomPopup
                    key={activePopup.id}
                    content={activePopup.content}
                />
            )}
        </AnimatePresence>
    )
}

export default PopupInstantiator
