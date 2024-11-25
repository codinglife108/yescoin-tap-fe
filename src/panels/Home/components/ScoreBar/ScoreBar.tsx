import React, {FC} from 'react';
import IconText from "../../../../components/IconText/IconText";
import Spacing from "../../../../components/Spacing/Spacing";

/* import {useNavigate} from "react-router-dom"; */

import {useSelector} from "react-redux";
import {
    DefaultStateType
} from "../../../../store/reducer";
import {convertLevelIdToLevel} from "../../../../utils/levelsUtils";
import {Skeleton} from "@nextui-org/react";
import {formatNumberWithSpaces} from "../../../../utils/mathUtils";
import {ROUTE_LEAGUE} from "../../../../routes";
import {useNavigate} from "react-router-dom";

interface ScoreBarProps {
    noLeague?: boolean
}

const ScoreBar: FC<ScoreBarProps> = ({noLeague}: ScoreBarProps) => {

    const navigate = useNavigate()
    const {
        level,
        gold,
    } = useSelector((selector: DefaultStateType) => ({
        level: selector.level,
        gold: selector.gold,
        rocket: selector.rocket,
    }));
    return (
        <>
            {gold !== null ? (
                <IconText
                    size="xl"
                    centered
                    imgPath={require('../../../../assets/images/coins/rocket_coin_back_100x100.png')}
                    text={formatNumberWithSpaces(gold)}
                    stretched
                />
            ) : (
                <Skeleton
                    style={{
                        height: 51,
                        width: 200,
                        borderRadius: 16,
                        margin: '0 auto'
                    }}
                />
            )}

            <Spacing size={0}/>
            {!noLeague && <>
                {level !== null ? (
                    <IconText
                        size="mediumLevels"
                        onClick={() => {
                            navigate(ROUTE_LEAGUE)
                        }}
                        imgPath={require(`../../../../assets/league/${convertLevelIdToLevel(level)?.icon}.png`)}
                        text={convertLevelIdToLevel(level).name}
                        stretched
                    />
                ) : (
                    <Skeleton
                        style={{
                            height: 24,
                            width: 180,
                            borderRadius: 16,
                            margin: '0 auto'
                        }}
                    />
                )}
            </>}
        </>
    );
};

export default ScoreBar;