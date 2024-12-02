import { useNavigate } from "react-router-dom";

import EmojiRectangle from "../../../components/EmojiRectangle/EmojiRectangle";
import Img from "../../../components/Img/Img";
import IconText from "../../../components/IconText/IconText";

import { ROUTE_BLOCKGAME, ROUTE_SUPERTASKS } from "../../../routes";

import { formatNumberWithSpaces } from "../../../utils/mathUtils";
import { BLOCKGAME_TITLE } from "../../../utils/constant";

import { Pencils } from "../HardCodedSuperTaskData";

export default function CampaignListItem({ campaign, onCampaignClick }: any) {
    const navigate = useNavigate();
    const isLarge = campaign.media_url != null;
    const superTask = campaign.steps?.length > 0;
    const isPencil = campaign.id === Pencils.id
    const handleClick = async () => {
        if (campaign["title"] === BLOCKGAME_TITLE) navigate(ROUTE_BLOCKGAME);
        else {
            if (superTask) {
                navigate(`${ROUTE_SUPERTASKS}/${campaign.id}`);
            } else {
                onCampaignClick(campaign)
            }
        }
    };

    if (!superTask) {
        return (
            <div className="campaign-content mb-2 cursor-pointer" onClick={handleClick}>
                {campaign.media_url ? (
                    <Img radius={16} width={56} height={56} style={{ objectFit: 'cover', aspectRatio: '1/1' }} src={campaign.media_url} />
                ) : (
                    <EmojiRectangle big>
                        <Img
                            radius={0}
                            src={require("../../../assets/images/emoji/money_fly.png")}
                        />
                    </EmojiRectangle>
                )}
                <div className="campaign-info flex flex-col justify-center">
                    <h4 className="campaign-title">{campaign.title}</h4>
                    <div className="flex justify-start items-center gap-1">
                        <div className={"reward-text small "}>
                            {(campaign.total_reward || campaign.award) !== -1 ? (
                                <>
                                    Earn:
                                    <IconText
                                        size="small"
                                        imgPath={require('../../../assets/images/coins/rocket_coin_back_100x100.png')}
                                        text={formatNumberWithSpaces(superTask ? campaign.total_reward : campaign.award)}
                                    />
                                </>
                            ) : (
                                <p className={"text-success"}>Completed!</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        );
    }

    return (
        <div
            key={campaign.id}
            onClick={handleClick}
            className={`campaign-card ${isLarge ? 'campaign-card-large' : ''}`}
        >
            {isLarge && (
                <>
                    {campaign.media_url.endsWith('.mp4') || campaign.media_url.endsWith('.mov') ? (
                        <video
                            className="campaign-image"
                            autoPlay
                            loop
                            muted
                            playsInline
                            style={{ objectFit: 'cover', width: "100%" }}
                        >
                            <source src={campaign.media_url} type="video/mp4" />
                            Your browser does not support the video tag.
                        </video>
                    ) : (
                        <div
                            className="campaign-image"
                            style={{ backgroundImage: `url(${campaign.media_url})` }}
                        />
                    )}
                    <div className="campaign-image-overlay">
                        <h2 className="campaign-title">{campaign.title}</h2>
                    </div>
                </>
            )}
            <div className="campaign-content">
                {!isLarge && (
                    <EmojiRectangle>
                        <Img
                            radius={0}
                            src={require("../../../assets/images/emoji/money_fly.png")}
                        />
                    </EmojiRectangle>
                )}
                <div className="campaign-info">
                    {!isLarge && <h4 className="campaign-title">{campaign.title}</h4>}
                    {campaign.description && (
                        <p className="campaign-description">
                            {isPencil ? Pencils.shortDescription : campaign.description || 'No description available'}
                        </p>
                    )}
                    {isPencil && Pencils.extraCoinValue && Pencils.extraCoinLogo &&
                        <div className="flex justify-center items-center gap-1">
                            <div className={"reward-text"} style={{ gap: 0 }}>
                                <>
                                    Prize pool:
                                    <IconText
                                        containerStyle={{ flexDirection: "row-reverse", gap: 6 }}
                                        size="mediumTasks"
                                        imgPath={Pencils.extraCoinLogo}
                                        text={Pencils.extraCoinValue}
                                    />
                                </>
                            </div>
                        </div>
                    }
                    <div className="flex justify-center items-center gap-1">
                        <div className={"reward-text"}>
                            {(campaign.total_reward || campaign.award) !== -1 ? (
                                <>
                                    Earn:
                                    <IconText
                                        size="mediumTasks"
                                        imgPath={require('../../../assets/images/coins/rocket_coin_back_100x100.png')}
                                        text={formatNumberWithSpaces(superTask ? campaign.total_reward : campaign.award)}
                                    />

                                </>
                            ) : (
                                <p className={"text-success"}>Completed!</p>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};
