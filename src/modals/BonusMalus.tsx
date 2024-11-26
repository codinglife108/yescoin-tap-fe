import InformationModal from './InformationModal'
import { useEffect, useState } from 'react'
import logoBonus from '../assets/images/emoji/robot_big.png'
import logoMalus from '../assets/images/emoji/fire.png'
import { formatNumberWithSpaces } from '../utils/mathUtils'
import { useSelector } from 'react-redux'
import { DefaultStateType } from '../store/reducer'

const BonusDescription = ({ bonus }: { bonus: number }) => (
    <p className={'text-center text-md'}>
        I've <span className={'text-lime-500'}>earned</span>
        {' ' + formatNumberWithSpaces(bonus)} tokens
        <br />
        while you were away.
        <br />
        <br />
        Just a reminder: I start working 15 minutes after you go offline, and I
        can work for a maximum of 4 continuous hours.
    </p>
)
const MalusDescription = ({ bonus }: { bonus: number }) => (
    <p className={'text-center text-lg'}>
        I've <span className={'text-red-500'}>burned</span>
        {' ' + formatNumberWithSpaces(bonus)} tokens
        <br />
        while you were offline.
        <br />
        <br />
        <span className={'text-red-500'}>Muhahahahahha</span>
    </p>
)
export default function BonusMalus({
    onClose,
    bonusMalusValue,
}: {
    onClose: () => void
    bonusMalusValue: number
}) {
    const [bonus, setBonus] = useState(0)
    const isMalus = bonus < 0
    const icon = isMalus ? logoMalus : logoBonus
    const title = isMalus ? 'Welcome back Motherfu**er' : 'Welcome back boss!'
    const Description = isMalus ? MalusDescription : BonusDescription
    const buttonText = isMalus ? 'Ok 😢' : 'Thank you 😉'
    useEffect(() => {
        setBonus(bonusMalusValue)
    }, [bonusMalusValue])

    const selector = useSelector((s: DefaultStateType) => s)
    const screenPopup = selector.screenPopup

    if (bonus === 0) {
        return null
    }

    return (
        !screenPopup && (
            <InformationModal
                floatingCenter
                buttonText={buttonText}
                learnMoreLink={
                    isMalus
                        ? 'https://telegra.ph/How-does-the-Burn-works-08-09'
                        : 'https://telegra.ph/How-does-the-tapbot-work-08-09'
                }
                isBoost={false}
                close={onClose}
                callback={() => {}}
                itemData={{
                    icon: (
                        <img
                            src={icon}
                            width={140}
                            height={140}
                            alt={'modal-from-bottom'}
                        />
                    ),
                    title,
                    Description: () => <Description bonus={Math.abs(bonus)} />,
                    value: Math.abs(bonus),
                    level: 1,
                }}
            />
        )
    )
}
