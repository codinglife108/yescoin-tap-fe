import React, { FC, useCallback, useEffect, useState } from 'react'
import Panel from '../../components/Panel/Panel'
import TelegramBackButton from '../../components/TelegramBackButton/TelegramBackButton'
import Placeholder from '../../components/Placeholder/Placeholder'
import Img from '../../components/Img/Img'
import CellContainer from '../../components/CellContainer/CellContainer'
import Cell from '../../components/Cell/Cell'
import Spacing from '../../components/Spacing/Spacing'
import IconText from '../../components/IconText/IconText'
import Icon16Chevron from '../../assets/icons/Icon16Chevron'
import BottomLayout from '../../components/BottomLayout/BottomLayout'
import { Button, Skeleton } from '@nextui-org/react'
import Div from '../../components/Div/Div'
import { useNavigate } from 'react-router-dom'
import { ROUTE_CREATE_TEAM, ROUTE_HOME, ROUTE_TEAM } from '../../routes'
import { useTranslation } from 'react-i18next'
import { useSelector } from 'react-redux'
import { DefaultStateType } from '../../store/reducer'
import { fetchData, getImageUrl } from '../../utils/api'
import { formatNumberShort } from '../../utils/mathUtils'
import LetterAvatar from '../../components/LetterAvatar/LetterAvatar'
import BackgroundGlow from '../../components/BackgroundGlow/BackgroundGlow'
// @ts-ignore
import TeamLogo from '../../assets/images/other/teamLogo.png'
import './teams.css'
import { parseStringWithNewLine } from '../../utils/utils'
import SearchTeams from './SearchTeams'

const Teams: FC = () => {
    const [teams, setTeams] = useState<any>(null)
    const [teamsLoading, setTeamsLoading] = useState(false)
    const [timeoutId, setTimeoutId] = useState<any>(null)

    const navigate = useNavigate()

    const myTeam = useSelector((selector: DefaultStateType) => selector.team)
    const { t } = useTranslation()

    const fetchTeams = useCallback(async () => {
        if (myTeam !== null && myTeam !== 'no') {
            navigate(ROUTE_HOME, { replace: true })
            return
        }

        setTeamsLoading(true)

        const response = await fetchData('/teams/get')
        if (response.error) {
            return
        }

        setTeams(response.result)
        setTeamsLoading(false)
    }, [myTeam, navigate])

    const searchTeam = useCallback(async (search: string) => {
        setTeamsLoading(true)
        const response = await fetchData('/teams/search', { search: search })
        if (response.error) {
            return
        }
        setTeams(response.result)
        setTeamsLoading(false)
    }, [])

    useEffect(() => {
        fetchTeams().then()
    }, [fetchTeams])
    const handleSearch = (text: string) => {
        if (timeoutId) {
            clearTimeout(timeoutId)
        }
        if (text.length > 0) {
            const id = setTimeout(() => {
                searchTeam(text)
            }, 3000)
            setTimeoutId(id)
        }
    }
    return (
        <Panel>
            <TelegramBackButton />

            <BackgroundGlow
                color0={'#FF9416'}
                color1='#FE2B3A'
                color2='#B01908'
                color3='#000'
                vertical='bottom'
                fromTop
                height='40vh'
            />
            <div className={'justify-center flex'}>
                <img
                    src={TeamLogo}
                    width={'130px'}
                    height={160}
                    alt={'team-logo'}
                />
            </div>
            <Placeholder title={t('teamJoinTitle')} />
            <p className={'text-center mt-4'}>
                {parseStringWithNewLine(t('teamJoinSubTitle'))}
            </p>
            <Spacing size={32} />

            {/*<SearchTeams searchSquad={handleSearch}/>*/}
            {/*<Spacing size={28}/>*/}
            <CellContainer>
                {teamsLoading && (
                    <>
                        <Skeleton
                            style={{
                                width: '100%',
                                height: 48,
                                borderRadius: 16,
                            }}
                        />
                        <Skeleton
                            style={{
                                width: '100%',
                                height: 48,
                                borderRadius: 16,
                                marginTop: 16,
                            }}
                        />
                        <Skeleton
                            style={{
                                width: '100%',
                                height: 48,
                                borderRadius: 16,
                                marginTop: 16,
                            }}
                        />
                    </>
                )}

                {!teamsLoading &&
                    teams !== null &&
                    teams.map((team: any, index: number) => (
                        <Cell
                            key={index}
                            before={
                                team.photo ? (
                                    <div className={'teamAvatar--container'}>
                                        <Img
                                            radius={100}
                                            src={getImageUrl(team.photo)}
                                        />
                                    </div>
                                ) : (
                                    <div className={'teamAvatar--container'}>
                                        <LetterAvatar
                                            radius={100}
                                            small
                                            width={36}
                                            height={36}
                                        >
                                            {team.name
                                                ? team.name
                                                      .charAt(0)
                                                      .toUpperCase()
                                                : 'Y'}
                                        </LetterAvatar>
                                    </div>
                                )
                            }
                            after={<Icon16Chevron />}
                            title={team.name}
                            onClick={() =>
                                navigate(ROUTE_TEAM, { state: { id: team.id } })
                            }
                        >
                            <IconText
                                size='small'
                                imgPath={require('../../assets/images/coins/rocket_coin_back_36x36.png')}
                                text={formatNumberShort(team.gold)}
                                textColor='var(--gray_light_color)'
                            />
                        </Cell>
                    ))}
            </CellContainer>

            <Spacing size={80} />

            <BottomLayout>
                <Div>
                    <Button
                        size='lg'
                        className={'btn-gradient'}
                        color='primary'
                        onClick={() => navigate(ROUTE_CREATE_TEAM)}
                        fullWidth
                    >
                        {t('teamCreateNewButton')}
                    </Button>
                </Div>
                <Spacing />
            </BottomLayout>
        </Panel>
    )
}

export default Teams
