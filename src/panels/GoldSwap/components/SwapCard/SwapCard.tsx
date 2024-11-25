import React, {FC, ReactNode} from 'react';
import './SwapCard.css';

interface SwapCardProps {
    //mode: 'receive' | 'give'
    before: ReactNode
    beforeText: string
    after: ReactNode
    afterText?: string
    onClick?: React.MouseEventHandler<HTMLDivElement>
}

const SwapCard: FC<SwapCardProps> = (props) => {
    return (
        <div className="SwapCard--container" onClick={props.onClick}>
            <div className="SwapCard--header">
                <div className="SwapCard--header--before">
                    <p className="text-14-medium text-gray">{props.beforeText}</p>
                </div>

                {props.afterText && (
                    <div className="SwapCard--header--after">
                        <p className="text-14-medium text-gray">{props.afterText}</p>
                    </div>
                )}
            </div>

            <div className="SwapCard--body">
                <div className="SwapCard--body--before">
                    {props.before}
                </div>

                <div className="SwapCard--body--after">
                    {props.after}
                </div>
            </div>
        </div>
    );
};

export default SwapCard;