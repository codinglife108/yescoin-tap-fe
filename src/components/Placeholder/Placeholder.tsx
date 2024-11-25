import {FC, ReactNode} from 'react';
import './Placeholder.css';

interface PlaceholderProps {
    children?: ReactNode
    title: string
    text?: string
}

const Placeholder: FC<PlaceholderProps> = ({ children, title, text }) => {
    return (
        <div className="Placeholder--container">
            {children}
            <h1>{title}</h1>

            {text && (
                <p>{text}</p>
            )}
        </div>
    );
};

export default Placeholder;