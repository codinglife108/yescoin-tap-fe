import React, { FC } from 'react';
import './LoadingScreenGiveawayBitGet.css';

const LoadingScreenGiveawayBitGet: FC = () => {

    return (
        <div style={{width: '100%', height: '100%', position: 'fixed', inset: 0}}>
            <img
                src={'https://yescoinleaderboardprod.blr1.cdn.digitaloceanspaces.com/task/IMG_2593.PNG'}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                alt=""
            />
        </div>
    );
};

export default LoadingScreenGiveawayBitGet;