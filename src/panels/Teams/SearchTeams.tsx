import React from 'react';

const SearchSquad = ({ searchSquad }:{ searchSquad: (value: string) => void}) => {
    const inputRef = React.useRef(null);

    return (
        <div className={"search-container flex items-center "}>
            <SearchIcon/>
            <div className={"pl-8"}>
                <p>Search Squad</p>
                <input
                    ref={inputRef}
                    onChange={(e) => searchSquad(e.target.value)}
                    className={"bg-transparent border-0 outline-0 focus:outline-0 focus:border-0 text-white"}
                    placeholder="@username / squad ID"
                />
            </div>
        </div>
    );
};

const SearchIcon = () => (
    <svg
        fill="none"
        height="36" // Increased height by 1.5 times (24 * 1.5)
        shapeRendering="geometricPrecision"
        stroke="currentColor"
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth="2.25" // Increased stroke width by 1.5 times (1.5 * 1.5)
        viewBox="0 0 36 36" // Increased viewBox dimensions by 1.5 times (24 * 1.5)
        width="36" // Increased width by 1.5 times (24 * 1.5)
        style={{color: '#fff'}}
    >
        <circle cx="16.5" cy="16.5" r="12"/>
        {/* Increased radius and center by 1.5 times */}
        <line x1="31.5" x2="24.975" y1="31.5" y2="24.975"/>
        {/* Increased coordinates by 1.5 times */}
    </svg>
);

/* const styles = {
    container: {
        display: 'flex',
        alignItems: 'center',
        borderRadius: '30px',
        padding: '5px 10px',
        width: 'fit-content',
        height: '40px',
    },
    textContainer: {
        marginLeft: '10px',
        color: '#fff', // White text
    },
}; */

export default SearchSquad;
