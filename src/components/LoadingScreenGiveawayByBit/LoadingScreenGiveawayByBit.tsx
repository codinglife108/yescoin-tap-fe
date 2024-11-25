import React, { FC } from 'react';
import './LoadingScreenGiveawayByBit.css';

const LoadingScreenGiveawayByBit: FC = () => {

    return (
        <div style={{width: '100%', height: '100%', position: 'fixed', inset: 0}} className='bg-black'>
            {/* <a href='https://partner.bybit.com/b/yeswsot'>
                <img
                    src={'https://yescoinleaderboardprod.blr1.cdn.digitaloceanspaces.com/task/bybit_preload.png'}
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                    alt=""
                    />
            </a> */}
            {/* <p className='text-3xl font-bold mt-[100px] text-center leading-[44px]'>Connect Wallet<br></br> is live</p> */}
            <video
                className=""
                autoPlay
                loop
                muted
                playsInline
                style={{width:"100%" , height:'100%' }}
            >
            <source src={'https://yescoinleaderboardprod.blr1.cdn.digitaloceanspaces.com/task/preload_video.mp4'} type="video/mp4" />
            Your browser does not support the video tag.
            </video>
        </div>
    );
};

export default LoadingScreenGiveawayByBit;