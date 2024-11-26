import { FC, useState } from 'react'
import ShiningIcon from '../../assets/icons/shine-icon.png'
import WalletIcon from "../../assets/icons/wallet-icon.png"
import DocIcon from "../../assets/icons/doc.png"
import ExchangesListItem from './ExchangesListItem';
import TelegramBackButton from "../../components/TelegramBackButton/TelegramBackButton";
import FriendsListSkeleton from '../Friends/components/FriendsListSkeleton/FriendsListSkeleton';
import Panel from '../../components/Panel/Panel';

import { SET_TASKS, SET_USER_ACTIVTY, SET_TOAST } from '../../store/reducer';
import { DefaultStateType } from '../../store/reducer';
import { fetchData } from '../../utils/api';
import { getDispatchObject } from '../../store/reducer';

import { useOkxWallet } from '../../utils/OkxWalletProvider';
import { useDispatch } from 'react-redux';
import { useCallback } from 'react';
import { useEffect } from 'react';
import { useSelector } from 'react-redux';




// @ts-ignore
const tg = window['Telegram'].WebApp;
const Exhchanges: FC = () => {

    const [loading, setLoading] = useState(false);
    const [err, setError] = useState(false);

    const okxContext = useOkxWallet();
    const dispatch = useDispatch();

    const selector = useSelector((s: DefaultStateType) => s);
    const campaigns = selector?.tasks;

    const tasksOfExchanges = campaigns?.filter((campaign: any) => campaign.sectiontype == 'exchanges')

    const readableAddress = (address: string) => {
        return address.slice(0, 6) + "..." + address.slice(-6)
    }

    const fetchCampaigns = useCallback(async () => {
        try {
            setLoading(true);
            const response = await fetchData("/tasks/get");

            const tasks = response.result.tasks;
            let sections = response.result.sections;
            const superTasks = response.result.superTasks;

            sections = sections.map((section: any) => ({
                ...section,
                steps: tasks.filter((task: any) => task.section_id === section.id)
            }));

            // Filtra le task indipendenti (senza supertask_id)
            const independentTasks = tasks.filter((task: any) => (!task.supertask_id && task.visible !== false));


            // Crea un oggetto per mappare le supertask con i loro step
            const superTasksWithSteps = superTasks.map((superTask: any) => ({
                ...superTask,
                type: 'supertask',
                sections: sections.filter((section: any) => section.supertask_id === superTask.id),
                steps: tasks.filter((task: any) => (task.supertask_id === superTask.id && (task?.section_id == null || task?.section_id == '' || task?.section_id == undefined)))
            })).sort((a: any, b: any) => a.orderpriority - b.orderpriority);

            // Combina task indipendenti e supertask in un unico array
            const allCampaigns = [
                ...(superTasksWithSteps?.reverse() || []),
                ...independentTasks.map((task: any) => ({ ...task, type: 'task' })),
            ];

            dispatch(getDispatchObject(SET_TASKS, allCampaigns));
            setLoading(true);
        } catch (e: any) {
            setError(e?.message || 'An error occurred');
        } finally {
            setLoading(false);
        }
    }, [dispatch]);

    const categorizeCampaigns = (campaigns: any) => {
        return campaigns.reduce((acc: any, campaign: any) => {
            if (campaign.visible == false) return acc;
            const isCompleted = campaign.award === -1 || (campaign.steps && campaign.total_reward === -1);
            const isDaily = (campaign.daily && !isCompleted) || (campaign.sectiontype == 'daily');
            const sections = ["yescoin", "accelerator", "exchanges"];
            if (isCompleted) {
                acc.completed.push(campaign);
            } else if (isDaily) {
                acc.daily.push(campaign);
            } else if (sections.includes(campaign.sectiontype)) {
                acc[campaign.sectiontype].push(campaign);
            } else {
                acc.new.push(campaign);
            }
            return acc;
        }, { new: [], yescoin: [], accelerator: [], daily: [], completed: [], exchanges: [] });
    };

    const categorizedCampaigns = categorizeCampaigns(campaigns || []);

    useEffect(() => {
        fetchCampaigns();
    }, [fetchCampaigns]);

    const clickHandler = async () => {
        if (okxContext.walletAddress) {
            // @ts-ignore
            tg.showConfirm("Would you like to disconnect your wallet?", async (response: boolean) => {
                if (response) {
                    await okxContext?.disconnect();
                }
            })
        } else {
            console.log('Wallet is already not connected!')
        }
    }

    const userActivities = useSelector((state: DefaultStateType) => state.userActivities);
    const isWalletRewarded = userActivities?.hasOwnProperty('mantleWalletConnectAt');

    const _renderHeader = () => {
        return (
            <div className="flex flex-col justify-center items-center mt-[20px] w-full ">
                <div className="flex gap-2">
                    <p className="text-[36px]">Exchanges</p>
                    <img src={ShiningIcon} alt='shining-icon' width={51} />
                </div>
                <div className='mt-1 text-[24px] text-gray-400'>Probably something</div>
            </div>
        )
    }

    const _renderWalletConnect = () => {
        const handleConnectWallet = async () => {
            // if (!okxContext.walletAddress) {
            await okxContext.connectWallet();
            // }
        }
        return (
            <div className='bg-[#FFFFFF1F] p-1 px-4 mt-4 rounded-[16px] flex items-center gap-4' onClick={(okxContext.walletAddress && isWalletRewarded) ? clickHandler : () => handleConnectWallet()}>
                <img src={WalletIcon} width={43} />
                {okxContext.walletAddress && isWalletRewarded ? (
                    <div className='w-full flex justify-between items-end text-[20px]'>Wallet<p className='text-gray-400 text-[18px]'>{readableAddress(okxContext.walletAddress || "")}</p></div>
                ) : (
                    <>
                        <p className='text-[20px]'>Connect wallet</p>
                    </>
                )}
            </div>
        )
    }

    const handleTaskClick = (task: any) => { }

    const _renderTasks = () => {
        return (
            <div className='mt-4'>
                {
                    tasksOfExchanges?.map((task: any) => <ExchangesListItem
                        onTaskClick={handleTaskClick}
                        fetchCampaigns={fetchCampaigns}
                        task={task}
                        key={task.id}
                    />)
                }

            </div>
        )
    }

    const handleDocClick = () => {
        dispatch(
            getDispatchObject(SET_TOAST, {
                open: true,
                message: <p className="whitespace-nowrap">👀 Snapshot coming</p>,
                type: "noicon",
            })
        );
    }

    const _renderDocIcon = () => {
        return (
            <div className='absolute bottom-4 right-4' onClick={() => handleDocClick()}>
                {/* <img src="/doc-ani.gif" alt="GIF image" className="absolute w-48 h-48 object-cover" /> */}
                <img src={DocIcon} alt="docs-icon" width={78} className="relative" />
            </div>
        )
    }

    return (
        <>
            <div className='Panel--container p-0'>
                {loading ?
                    <div className='pt-[40px] px-4'>
                        <FriendsListSkeleton />
                    </div> :
                    <div className="p-4 bg-black min-h-[100vh]  overflow-y-auto" >
                        <TelegramBackButton />
                        {_renderHeader()}
                        {_renderWalletConnect()}
                        {_renderTasks()}
                    </div>
                }
            </div>
            {_renderDocIcon()}
        </>
    )
}

export default Exhchanges;