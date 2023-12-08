import React, { useEffect, useRef } from 'react';

const TypingIndicator = () => {
    const dotsRef = useRef();

    useEffect(() => {
        const animateBounce = () => {
            if (dotsRef.current) {
                dotsRef.current.childNodes.forEach((dot, index) => {
                    setTimeout(() => {
                        dot.classList.add('animate-bounce');
                        setTimeout(() => {
                            dot.classList.remove('animate-bounce');
                        }, 500); // Adjust the animation duration as needed
                    }, index * 200); // Adjust the delay between bounces as needed
                });
            }
        };

        const intervalId = setInterval(animateBounce, 800); // Adjust the interval between sets of bounces as needed

        return () => clearInterval(intervalId);
    }, []);

    return (
        <div className="flex items-center">
            <div ref={dotsRef} className="flex">
                {[1, 2, 3].map((index) => (
                    <div key={index} className={`w-2 h-2 bg-white rounded-full mr-1`}></div>
                ))}
            </div>
        </div>
    );
};

export default TypingIndicator;
