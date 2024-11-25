// hooks/useDebounce.js
import { useEffect, useRef } from 'react';

const useDebounce = (callback: Function, delay: number) => {
    const timeoutRef = useRef<any>(null);

    const debouncedCallback = (...args: any) => {
        if (timeoutRef.current) {
            clearTimeout(timeoutRef.current);
        }
        timeoutRef.current = setTimeout(() => {
            callback(...args);
        }, delay);
    };

    // Cleanup the timeout on unmount
    useEffect(() => {
        return () => {
            if (timeoutRef.current) {
                clearTimeout(timeoutRef.current);
            }
        };
    }, []);

    return debouncedCallback;
};

export default useDebounce;
