import React, {
    FC,
    createContext,
    useContext,
    useState,
    useEffect,
    ReactNode,
} from 'react'
import { OKXUniversalProvider } from '@okxconnect/universal-provider'
import { useSelector, useDispatch } from 'react-redux'
import { DefaultStateType } from '../store/reducer'
import { fetchData } from './api'
import useModal from '../hooks/useModal'
import { MODAL_INFO } from '../routes'
import { formatNumberWithSpaces } from './mathUtils'
import { getDispatchObject } from '../store/reducer'
import { SET_USER_ACTIVTY, SET_TOAST } from '../store/reducer'
import { ADD_GOLD } from '../store/reducer'
import { OKXUniversalConnectUI, THEME } from '@okxconnect/ui'

interface OkxWalletContextType {
    provider: OKXUniversalProvider | null
    connectWallet: Function
    disconnect: Function
    walletAddress: string | null
    sendZeroTransaction: Function
    sendClaimTransaction: Function
    isWalletConnected: boolean
    isClaimed: boolean
    isConfirming: boolean
}

const OkxWalletContext = createContext<OkxWalletContextType | undefined>(
    undefined
)

interface OkxWalletProviderProps {
    children: ReactNode
}

export const OkxWalletProvider: FC<OkxWalletProviderProps> = ({ children }) => {
    const [provider, setProvider] = useState<OKXUniversalProvider | null>(null)
    const [universalUiState, setUiState] = useState<any>(null)
    const [walletAddress, setWalletAddress] = useState<string | null>(null)
    const userActivities = useSelector(
        (state: DefaultStateType) => state.userActivities
    )
    const { setActiveModal } = useModal()
    const dispatch = useDispatch()
    const isWalletConnected =
        userActivities?.hasOwnProperty('mantleWalletConnectAt') || true
    const isClaimed = userActivities?.hasOwnProperty('claimedAt') ? true : false
    const getLastActivities = async () => {
        const response = await fetchData('/user/getSettings')
        dispatch(
            getDispatchObject(SET_USER_ACTIVTY, response?.result?.settings)
        )
    }

    const [isConfirming, setConfirming] = useState(false)

    useEffect(() => {
        // const initProvider = async () => {
        //   try {
        //     const okxUniversalProvider = await OKXUniversalProvider.init({
        //       dappMetaData: {
        //         name: "Yescoin",
        //         icon: "https://miniapp.yesco.in/yescoin_icon.png"
        //       },
        //     })
        //     const universalUi = await OKXUniversalConnectUI.init({
        //       dappMetaData: {
        //         icon: "https://static.okx.com/cdn/assets/imgs/247/58E63FEA47A2B7D7.png",
        //         name: "OKX WalletConnect UI Demo"
        //       },
        //       actionsConfiguration: {
        //         returnStrategy: 'tg://resolve',
        //         modals:"all",
        //         tmaReturnUrl:'back'
        //       },
        //       language: "en_US",
        //       uiPreferences: {
        //         theme: THEME.LIGHT
        //       },
        //     });
        //     setProvider(okxUniversalProvider);
        //     if(okxUniversalProvider.session) {
        //       const acc = okxUniversalProvider.session?.namespaces?.eip155?.accounts[0];
        //       setWalletAddress(acc?.split(':')?.[2]||null);
        //     }
        //     // Generate universalLink
        //     okxUniversalProvider.on("display_uri", (uri:any) => {
        //       console.log(uri);
        //     });

        //     // Session information changes (e.g. adding a custom chain) will trigger this event;
        //     okxUniversalProvider.on("session_update", (session:any) => {
        //       console.log(JSON.stringify(session));
        //     });

        //     // Disconnecting triggers this event;
        //     okxUniversalProvider.on("session_delete", ({topic}:any) => {
        //       console.log(topic);
        //     });
        //   } catch (error) {
        //     console.error('Failed to initialize OKXUniversalProvider:', error);
        //   }
        // };

        // initProvider();
        const initUI = async () => {
            try {
                const universalUi = await OKXUniversalConnectUI.init({
                    dappMetaData: {
                        icon: 'https://miniapp.yesco.in/yescoin_icon.png',
                        name: 'Yescoin',
                    },
                    actionsConfiguration: {
                        returnStrategy: 'tg://resolve',
                        modals: 'all',
                        tmaReturnUrl: 'back',
                    },
                    language: 'en_US',
                    uiPreferences: {
                        theme: THEME.DARK,
                    },
                })
                console.log('initUI ----->', universalUi, universalUi?.session)
                setUiState(universalUi)

                if (universalUi?.session) {
                    const acc =
                        universalUi.session?.namespaces?.eip155?.accounts[0]
                    setWalletAddress(acc?.split(':')?.[2] || null)
                }
            } catch (error) {
                console.error(
                    'Failed to initialize OKXUniversalProvider:',
                    error
                )
            }
        }
        initUI()
        getLastActivities()
    }, [])

    const connectWallet = async () => {
        if (walletAddress && isWalletConnected) return walletAddress
        if (universalUiState) {
            try {
                const session = await universalUiState.openModal({
                    namespaces: {
                        eip155: {
                            chains: ['eip155:5000'],
                            defaultChain: '5000',
                        },
                    },
                    optionalNamespaces: {
                        eip155: {
                            chains: [],
                        },
                    },
                })
                const acc = session?.namespaces?.eip155?.accounts[0]
                setWalletAddress(acc?.split(':')?.[2] || null)
                if (acc) {
                    if (
                        !userActivities?.hasOwnProperty('mantleWalletConnectAt')
                    ) {
                        await fetchData('/user/updateLastActivities', {
                            type: 'mantleWalletConnectAt',
                        })
                        await getLastActivities()
                        dispatch(getDispatchObject(ADD_GOLD, 500000))
                        setActiveModal(MODAL_INFO, {
                            icon: '/rocket_coin_back_36x36.png',
                            title: 'You have received',
                            buttonText: 'Thank you 🥳',

                            description: () => (
                                <p>{formatNumberWithSpaces(500000)} YesCoin!</p>
                            ),
                        })
                    }
                }
                return acc?.split(':')?.[2] || null
            } catch (err) {
                console.log(err)
                return null
            }
        }
    }

    const sendZeroTransaction = async () => {
        if (universalUiState && walletAddress && isWalletConnected) {
            try {
                const data = {
                    method: 'eth_sendTransaction',
                    params: [
                        {
                            to: '0x0809ec3202a0f76bb349fd392f76b20c64ceffce',
                            from: walletAddress,
                            gas: '0x76c0',
                            value: '0x0',
                            data: '0x',
                            gasPrice: '0x4a817c800',
                        },
                    ],
                }
                var resOfTran = await universalUiState.request(
                    data,
                    'eip155:5000'
                )

                return true
            } catch (err) {
                console.log(err)
                dispatch(
                    getDispatchObject(SET_TOAST, {
                        open: true,
                        message: 'Reward Claim Failed',
                        type: 'error',
                    })
                )
                return false
            }
        } else {
            connectWallet()
            // dispatch(getDispatchObject(SET_TOAST, { open: true, message: "Connect your wallet first", type: "error" }));
        }
    }

    const sendClaimTransaction = async () => {
        if (isClaimed) return false
        if (universalUiState && walletAddress && isWalletConnected) {
            try {
                setConfirming(true)
                await fetchData('/user/getClaimMantle', {
                    walletAddress: walletAddress,
                })
                await getLastActivities()
                dispatch(getDispatchObject(ADD_GOLD, 100000))
                setActiveModal(MODAL_INFO, {
                    icon: '/rocket_coin_back_36x36.png',
                    title: 'You have received',
                    buttonText: 'Thank you 🥳',

                    description: () => (
                        <p>{formatNumberWithSpaces(100000)} YesCoin!</p>
                    ),
                })
                setConfirming(false)
                return true
            } catch (err) {
                setConfirming(false)
                console.log(err)
                dispatch(
                    getDispatchObject(SET_TOAST, {
                        open: true,
                        message: 'Reward Claim Failed',
                        type: 'error',
                    })
                )
                return false
            }
        } else {
            connectWallet()
            // dispatch(getDispatchObject(SET_TOAST, { open: true, message: "Connect your wallet first", type: "error" }));
        }
    }

    const disconnect = async () => {
        try {
            // await provider?.disconnect();
            setWalletAddress(null)
            await universalUiState.disconnect()
        } catch (err) {
            console.log(err)
        }
    }

    return (
        <OkxWalletContext.Provider
            value={{
                provider,
                connectWallet,
                disconnect,
                walletAddress,
                sendZeroTransaction,
                sendClaimTransaction,
                isWalletConnected,
                isClaimed,
                isConfirming,
            }}
        >
            {children}
        </OkxWalletContext.Provider>
    )
}

// Custom hook to use the wallet context
export const useOkxWallet = (): OkxWalletContextType => {
    const context = useContext(OkxWalletContext)

    if (!context) {
        throw new Error('useOkxWallet must be used within an OkxWalletProvider')
    }

    return context
}
