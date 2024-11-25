import React, {FC, useState, useEffect} from 'react';
import { Progress } from "@nextui-org/react";

import "./CountdownToDate.css";

interface CountdownToDateProps {
    targetDate: Date;
}

const CountdownToDate: FC<CountdownToDateProps> = ({ targetDate }) => {
    

    const calculateTimeLeft = () => {
        const difference = Math.max(+targetDate - +new Date(), 0);
        let timeLeft = {};
    
        if (difference > 0) {
          timeLeft = {
            Days: Math.floor(difference / (1000 * 60 * 60 * 24)),
            Hours: Math.floor((difference / (1000 * 60 * 60)) % 24),
            Minutes: Math.floor((difference / 1000 / 60) % 60),
            //seconds: Math.floor((difference / 1000) % 60),
          };
        }
    
        return timeLeft;
    };

    const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());
    const [loadingPercentage, setLoadingPercentage] = useState(0);

    useEffect(() => {
        const timer = setTimeout(() => {
          setTimeLeft(calculateTimeLeft());
        }, 1000);
    
        // Cleanup the timer on component unmount
        return () => {
            clearTimeout(timer);
        }
    }, [timeLeft]);

    useEffect(() => {
    
        const timerProgressBar = setInterval(() => {
            setLoadingPercentage((v) => Math.min(v + 10, 100)) // This completes in 3 seconds
        }, 300)
    
        // Cleanup the timer on component unmount
        return () => {
            clearInterval(timerProgressBar);
        }
    }, [timeLeft, loadingPercentage]);


    return (
        <div className="CountdownToDate--coutndown-container">
            <h1 className="CountdownToDate--coutndown-yescoin">Yescoin</h1>

            <h2 className="CountdownToDate--coutndown-title">Something really big is coming 👀</h2>

            <h2 className="CountdownToDate--coutndown-title">Probably everything</h2>

            <div className="CountdownToDate--coutndown-wrapper">
                {Object.keys(timeLeft).map(interval => 
                    <span key={interval} className="CountdownToDate--coutndown-block">
                        <span className="CountdownToDate--coutndown-number">{(timeLeft as any)[interval]}</span>
                        <span className="CountdownToDate--coutndown-text">{interval}</span>
                    </span>
                )}
            </div>

            <div className="CountdownToDate--progress">
                <Progress
                    size="md"
                    aria-label="Loading..."
                    value={loadingPercentage}
                    classNames={{
                        indicator: "CountdownToDate--progress-bar",
                    }}
                />
            </div>
                        
        </div>
    );
};

export default CountdownToDate;