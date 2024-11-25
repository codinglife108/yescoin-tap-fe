import React, {FC, ReactNode} from 'react';
import './Div.css';

interface DivProps {
    children: ReactNode
}

const Div: FC<DivProps> = ({ children }) => {
    return (
        <div className="Div--container">
            {children}
        </div>
    );
};

export default Div;