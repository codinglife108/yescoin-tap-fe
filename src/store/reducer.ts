import { ModalTypes } from '../hooks/useModal'

export interface TeamUserType {
    image: string
    name: string
    tgId: number
    gold: number
}

export interface TeamType {
    id: number
    image: string
    name: string
    tgId: number
    gold: number
    usersCount: number
    topUsers: TeamUserType[]
    role: 'member' | 'admin' | 'guest'
    link?: string
    nbMembers?: number
}

export type LevelType = 'wood' | 'bronze' | 'silver' | 'gold' | 'platinum' /*|
    'diamond'|
    'master'|
    'grandmaster'|
    'elite'|
    'legendary'|
    'mythic'*/

export interface DefaultStateType {
    screenPopup: null | 'connection' | 'unSupportPlatform' | 'manyConnections'
    activeModal: null | string
    modalType: ModalTypes
    activeModalParams: null | string | number | object
    tasks: null | object[]
    toast: { open: boolean; message: string; type: string }
    lotteryPrice: null | number
    // null - не загружено, no - не состоит в команде
    team: null | 'no' | TeamType

    level: null | LevelType
    gold: null | number
    usdt: null | number
    lastAutoClickActivityMs: null | number
    rocket: null | number
    energyLeft: null | number
    ticket: null | number
    dailyEnergy: null | number
    dailyReward: null | object
    goldPerClick: null | number
    userActivities: null | object
    viewedSuperTask: null | string
}

const defaultState: DefaultStateType = {
    screenPopup: 'connection',
    activeModal: null,
    modalType: ModalTypes.INFORM_USER,
    activeModalParams: null,
    tasks: [],
    team: null,
    dailyReward: {},
    level: null,
    toast: { open: false, message: '', type: 'success' },
    gold: null,
    usdt: null,
    lotteryPrice: null,
    lastAutoClickActivityMs: null,
    rocket: null,
    energyLeft: null,
    dailyEnergy: null,
    ticket: null,
    goldPerClick: null,
    userActivities: null,
    viewedSuperTask: null,
}

export type ActionType = {
    type: string
    payload: any
}

export const SET_SCREEN_POPUP = 'SET_SCREEN_POPUP'
export const SET_TOAST = 'SET_TOAST'
export const SET_ACTIVE_MODAL = 'SET_ACTIVE_MODAL'
export const SET_ACTIVE_MODAL_PARAMS = 'SET_ACTIVE_MODAL_PARAMS'
export const SET_MODAL_TYPE = 'SET_MODAL_TYPE'

export const SET_TEAM = 'SET_TEAM'

export const SET_LEVEL = 'SET_LEVEL'
export const SET_GOLD = 'SET_GOLD'
export const SET_USDT = 'SET_USDT'
export const ADD_GOLD = 'ADD_GOLD'
export const REDUCE_GOLD = 'REDUCE_GOLD'
export const SET_ROCKET = 'SET_ROCKET'
export const ADD_ROCKET = 'ADD_ROCKET'
export const REDUCE_ROCKET = 'REDUCE_ROCKET'
export const SET_ENERGY_LEFT = 'SET_ENERGY_LEFT'
export const SET_CHAT_ID = 'SET_CHAT_ID'
export const SET_DAILY_ENERGY = 'SET_DAILY_ENERGY'
export const REDUCE_ENERGY_LEFT = 'REDUCE_ENERGY_LEFT'
export const SET_GOLD_PER_CLICK = 'SET_GOLD_PER_CLICK'
export const SET_TICKET = 'SET_TICKET'
export const SET_TASKS = 'SET_TASKS'
export const SET_DAYLY_REWARD = 'SET_DAYLY_REWARD'
export const SET_AUTOCLICK_LAST_ACTIVITY_MS = 'SET_AUTOCLICK_LAST_ACTIVITY_MS'
export const SET_LOTTERY_PRICE = 'SET_LOTTERY_PRICE'
export const SET_USER_ACTIVTY = 'SET_USER_ACTIVTY'
export const SET_VIEWED_SUPERTASK = 'SET_VIEWED_SUPERTASK'
export const reducer = (state = defaultState, action: ActionType) => {
    const payload = action.payload

    switch (action.type) {
        case SET_SCREEN_POPUP:
            return { ...state, screenPopup: payload }

        case SET_ACTIVE_MODAL:
            return { ...state, activeModal: payload }

        case SET_MODAL_TYPE:
            return { ...state, modalType: payload }

        case SET_VIEWED_SUPERTASK:
            return { ...state, viewedSuperTask: payload }

        case SET_ACTIVE_MODAL_PARAMS:
            return { ...state, activeModalParams: payload }

        case SET_TEAM:
            return { ...state, team: payload }

        case SET_LEVEL:
            return { ...state, level: payload }

        case SET_GOLD:
            return { ...state, gold: payload }

        case SET_USDT:
            return { ...state, usdt: payload }

        case SET_LOTTERY_PRICE:
            return { ...state, lotteryPrice: payload }

        case ADD_GOLD:
            if (state.gold === null) {
                return { ...state }
            }

            return { ...state, gold: state.gold + Number(payload) }

        case REDUCE_GOLD:
            if (state.gold === null) {
                return { ...state }
            }
            return { ...state, gold: state.gold - Number(payload) }
        case SET_ROCKET:
            return { ...state, rocket: payload }
        case SET_TICKET:
            return { ...state, ticket: payload }

        case SET_TOAST:
            return { ...state, toast: payload }

        case ADD_ROCKET:
            if (state.rocket === null) {
                return { ...state }
            }

            return { ...state, rocket: state.rocket + Number(payload) }

        case REDUCE_ROCKET:
            if (state.rocket === null) {
                return { ...state }
            }

            return { ...state, rocket: state.rocket - Number(payload) }

        case SET_ENERGY_LEFT:
            return { ...state, energyLeft: payload }
        case SET_CHAT_ID:
            return { ...state, chatId: payload }

        case SET_DAILY_ENERGY:
            return { ...state, dailyEnergy: payload }

        case SET_AUTOCLICK_LAST_ACTIVITY_MS:
            return { ...state, lastAutoClickActivityMs: payload }

        case REDUCE_ENERGY_LEFT:
            if (state.energyLeft === null) {
                return { ...state }
            }
            return { ...state, energyLeft: state.energyLeft - Number(payload) }
        case SET_GOLD_PER_CLICK:
            return { ...state, goldPerClick: payload }
        case SET_TASKS: {
            return { ...state, tasks: payload }
        }
        case SET_DAYLY_REWARD: {
            return { ...state, dailyReward: payload }
        }

        case SET_USER_ACTIVTY: {
            return { ...state, userActivities: payload }
        }

        default:
            return state
    }
}

export const getDispatchObject = (type: string, payload: any) => {
    return { type, payload }
}
