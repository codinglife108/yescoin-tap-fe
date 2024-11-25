import React, { FC, MouseEventHandler, ReactNode } from 'react';
import './Cell.css';

interface CellProps {
    title: string
    superTask?: boolean
    before?: ReactNode
    after?: ReactNode
    children?: ReactNode
    titleAfter?: ReactNode
    onClick?: MouseEventHandler<HTMLDivElement>
    smallBefore?: boolean
    titleColumn?: boolean
    style?: React.CSSProperties
}

const Cell: FC<CellProps> = (props) => {
    return (
        <div className="Cell--container" onClick={props.onClick} style={props.style||{}}>
            {props.before && (
                <div
                    className={`${props?.superTask ? 'Cell--before--bitget' : 'Cell--before'}`}
                    style={{ marginRight: props.smallBefore ? '8px' : '16px' }} >
                    {props.before}
                </div>
            )}

            <div className="Cell--content">
                <div className="Cell--title-container" style={{ flexDirection: props.titleColumn ? 'column' : 'row' }}>
                    <div className="Cell--title">
                        <p>{props.title}</p>
                    </div>

                    {props.titleAfter && (
                        <div className="Cell--title-after">
                            {props.titleAfter}
                        </div>
                    )}
                </div>

                {props.children && (
                    <div className="Cell--children">
                        {props.children}
                    </div>
                )}
            </div>

            {props.after && (
                <div className="Cell--after">
                    {props.after}
                </div>
            )}
        </div>
    );
};

export default Cell;