import { useState, useEffect } from 'react';

function useKeyboardStatus() {
    const [isKeyboardOpen, setIsKeyboardOpen] = useState(false);
    const [viewportHeight, setViewportHeight] = useState(window.innerHeight);

    useEffect(() => {
        const handleResize = () => {
            const currentHeight = window.innerHeight;
            // Check if the new height is significantly smaller than the initial viewport height
            if (viewportHeight > currentHeight + 100) {
                setIsKeyboardOpen(true);
            } else {
                setIsKeyboardOpen(false);
            }
            setViewportHeight(currentHeight);
        };

        window.addEventListener('resize', handleResize);

        return () => {
            window.removeEventListener('resize', handleResize);
        };
    }, [viewportHeight]);

    return isKeyboardOpen;
}

export default useKeyboardStatus;
