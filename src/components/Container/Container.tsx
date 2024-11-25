import React, {FC, ReactNode} from 'react';
import './Container.css';

interface ContainerProps {
    children: ReactNode
    title: string
}

const Container: FC<ContainerProps> = ({ children, title }) => {
    return (
        <div className="Container--container">
            <h3>{title}</h3>

            <div className="Container--content">
                {children}
            </div>
        </div>
    );
};

export default Container;