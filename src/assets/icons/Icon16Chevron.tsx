import React, {FC} from 'react';

interface Icon16ChevronProps {
    color?: string
}

const Icon16Chevron: FC<Icon16ChevronProps> = ({color="#8894a2"}: Icon16ChevronProps) => {
    return (
        <svg className="Icon16Chevron" width="13" height="16" viewBox="0 0 13 16" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path
                d="M7.72721 8.00001L4.36361 4.6364C4.01214 4.28493 4.01214 3.71508 4.36361 3.36361C4.71508 3.01214 5.28493 3.01214 5.6364 3.36361L9.6364 7.36361C9.98787 7.71508 9.98787 8.28493 9.6364 8.6364L5.6364 12.6364C5.28493 12.9879 4.71508 12.9879 4.36361 12.6364C4.01214 12.2849 4.01214 11.7151 4.36361 11.3636L7.72721 8.00001Z"
                fill={color}/>
        </svg>
    );
};

export default Icon16Chevron;