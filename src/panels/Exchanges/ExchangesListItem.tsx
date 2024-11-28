import { ROUTE_SUPERTASKS } from "../../routes";
import EmojiRectangle from "../../components/EmojiRectangle/EmojiRectangle";
import Img from "../../components/Img/Img";
import IconText from "../../components/IconText/IconText";
import { formatNumberWithSpaces } from "../../utils/mathUtils";
import React from "react";
import { useNavigate } from "react-router-dom";
import Cell from "../../components/Cell/Cell";
import CellContainer from "../../components/CellContainer/CellContainer";
export default function ExchangesListItem({ task, onTaskClick }: any) {
    const navigate = useNavigate();
    const isLarge = task.media_url != null;
    const superTask = task.steps?.length > 0;
    const handleClick = async () => {
        if (superTask) {
            navigate(`${ROUTE_SUPERTASKS}/${task.id}`);
        } else {
            onTaskClick(task)
        }
    };

    return (
        // isLarge && <div
        //     key={task.id}
        //     onClick={handleClick}
        //     className={`campaign-card pb-0 ${isLarge ? 'campaign-card-large pb-0' : ''}`}
        // >
        //     {isLarge && (
        //         <>
        //             <div className="campaign-image h-[80px]" style={{ backgroundImage: `url(${task.media_url})` }} />
        //             <div className="campaign-image-overlay py-2">
        //                 <h2 className="campaign-title text-center">{task.title}</h2>
        //             </div>
        //         </>
        //     )}
        //     <div className="campaign-info px-0 bg-gradient-to-r from-transparent via-red-500/20 to-transparent">
        //         <div className="flex justify-center items-center gap-1">
        //             <div className={"reward-text my-4"}>
        //                     <>
        //                         Earn:
        //                         <IconText
        //                             size="mediumTasks"
        //                             imgPath={require('../../assets/images/coins/rocket_coin_back_100x100.png')}
        //                             text={formatNumberWithSpaces(superTask ? task.total_reward : task.award)}
        //                         />

        //                     </>
        //             </div>
        //         </div>
        //     </div>
        // </div>
        <div className="p-2 bg-[#FFFFFF1F]  border border-gray-500 rounded-[16px] mb-2">
            <Cell
                key="adsgramAdReward"
                title={task.title=="BingX x Yescoin"?"Bingx":task.title}
                onClick={() => handleClick()}
                before={
                // <EmojiRectangle>
                    <img
                    src={task.logourl||task.media_url}
                    className="rounded-[16px]"
                    />
                // </EmojiRectangle>
                }
            >
                {((task.total_reward || task.award) === -1  ? (
                "rewarded"
                ) : ( 
                <IconText
                    size="small"
                    imgPath={require("../../assets/images/coins/rocket_coin_back_36x36.png")}
                    text={`${formatNumberWithSpaces(superTask ? task.total_reward : task.award)}`}
                />
                ))}
            </Cell>
        </div>
    );
};
