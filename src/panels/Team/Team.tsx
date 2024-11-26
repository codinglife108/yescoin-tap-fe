import React, { FC, useCallback, useEffect, useState } from 'react'
import Panel from '../../components/Panel/Panel'
import TelegramBackButton from '../../components/TelegramBackButton/TelegramBackButton'
import TeamHeader from './components/TeamHeader/TeamHeader'
import TeamInfo from './components/TeamInfo/TeamInfo'
import Spacing from '../../components/Spacing/Spacing'
import CellContainer from '../../components/CellContainer/CellContainer'
import Cell from '../../components/Cell/Cell'
import Img from '../../components/Img/Img'
import { useDispatch, useSelector } from 'react-redux'
import {
    DefaultStateType,
    getDispatchObject,
    SET_TEAM,
    TeamType,
} from '../../store/reducer'
import {
    fetchData,
    getImageUrl,
    getTelegramImageUrlPlaceholder,
} from '../../utils/api'
import LetterAvatar from '../../components/LetterAvatar/LetterAvatar'
import { getIdFromPathname } from '../../utils/locationUtils'
import BackgroundGlow from '../../components/BackgroundGlow/BackgroundGlow'
import { CircularProgress } from '@mui/material'
import { useLocation, Location } from 'react-router-dom'
import CoinAmountLabel from '../../components/CoinAmountLabel/CoinAmountLabel'

const Team: FC = () => {
    const [loading, setLoading] = useState(false)
    const [team, setTeam] = useState<TeamType | null>(null)
    /* const { t } = useTranslation(); */
    const dispatch = useDispatch()

    const myTeam = useSelector((selector: DefaultStateType) => selector.team)

    const getTeamIdFromStateIfPresent = (location: Location) => {
        if (location.state && location.state.id) {
            const id = Number(location.state.id)

            return isNaN(id) ? null : id
        }

        return null
    }

    const location = useLocation()
    const id =
        getTeamIdFromStateIfPresent(location) || getIdFromPathname(location)

    const fetchTeam = useCallback(async (teamId: number) => {
        if (!teamId) {
            return myTeam
        }

        setLoading(true)

        const response = await fetchData('/team/get', { id: teamId })
        if (response.error) {
            return
        }
        setTeam(response.result)
        setLoading(false)

        return response.result
    }, [])

    const fetch = useCallback(async () => {
        //@ts-expect-error type declaration wrong
        const _id = myTeam?.id
        if (id === null && _id === null) {
            return
        }
        await fetchTeam(id || _id)
    }, [id, myTeam, fetchTeam])

    useEffect(() => {
        fetch().then()
    }, [fetch])

    const onJoin = async () => {
        if (team === null) {
            return
        }

        const data = await fetchTeam(team.id)
        dispatch(getDispatchObject(SET_TEAM, data))
    }

    const onLeave = async () => {
        if (team === null) {
            return
        }

        await fetchTeam(team.id)
        dispatch(getDispatchObject(SET_TEAM, 'no'))
    }

    return (
        <Panel overflowToContent={true} style={{ height: '100%' }}>
            <BackgroundGlow
                color1='#FE2B3A'
                color2='#B01908'
                color3='#000'
                vertical='bottom'
            />
            <TelegramBackButton />
            {loading && (
                <div
                    className={
                        'flex absolute inset-0 items-center justify-center w-full h-full min-h-full'
                    }
                >
                    <CircularProgress />
                </div>
            )}

            {!loading && team && (
                <>
                    <TeamHeader
                        image={
                            team.image ? (
                                <div className={'team-image-container'}>
                                    <Img
                                        src={getImageUrl(team.image)}
                                        width={60}
                                        height={60}
                                        radius={60}
                                    />
                                </div>
                            ) : (
                                <div className={'team-image-container large'}>
                                    <LetterAvatar
                                        radius={60}
                                        width={60}
                                        height={60}
                                    >
                                        {team.name.charAt(0).toUpperCase()}
                                    </LetterAvatar>
                                </div>
                            )
                        }
                        name={team.name}
                        link={team.link}
                    />

                    {/* <Spacing size={16}/> */}
                    <TeamInfo
                        id={team.id}
                        gold={team.gold}
                        players={team.usersCount}
                        role={team.role}
                        onJoin={onJoin}
                        onLeave={onLeave}
                    />

                    <Spacing size={8} />
                    <CellContainer
                        extraStyle={{ maxHeight: '220px', overflowY: 'auto' }}
                    >
                        {team.topUsers &&
                            team.topUsers?.map((user, index) => (
                                <Cell
                                    key={index}
                                    before={
                                        <Img
                                            radius={100}
                                            src={getTelegramImageUrlPlaceholder(
                                                user.tgId.toString()
                                            )}
                                        />
                                    }
                                    title={user.name}
                                >
                                    <CoinAmountLabel amount={user.gold} />
                                </Cell>
                            ))}
                    </CellContainer>
                </>
            )}
        </Panel>
    )
}

export default Team
