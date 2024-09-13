"use client";
import React, { useState, useEffect } from "react";

export default function CountdownTimer() {
    const initialTime = 3 * 24 * 60 * 60 * 1000; // 3 days in milliseconds
    const resetTime = 1 * 60 * 60 * 1000; // 1 hour in milliseconds

    const [timeLeft, setTimeLeft] = useState(initialTime);
    const [isPaused, setIsPaused] = useState(false);

    useEffect(() => {
        let interval;

        if (timeLeft > 0 && !isPaused) {
            interval = setInterval(() => {
                setTimeLeft((prevTime) => prevTime - 1000);
            }, 1000);
        } else if (timeLeft <= 0) {
            setIsPaused(true); // Pause for 1 hour when the timer hits 0
            setTimeLeft(0);
            setTimeout(() => {
                setTimeLeft(initialTime); // Reset to 3 days after 1 hour
                setIsPaused(false);
            }, resetTime);
        }

        return () => clearInterval(interval); // Clean up interval on unmount
    }, [timeLeft, isPaused]);

    // Helper function to format time
    const formatTime = (time) => {
        const days = Math.floor(time / (1000 * 60 * 60 * 24));
        const hours = Math.floor((time % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((time % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((time % (1000 * 60)) / 1000);
        return { days, hours, minutes, seconds };
    };

    const { days, hours, minutes, seconds } = formatTime(timeLeft);

    return (
        <div className="flex gap-2 md:gap-4 text-white text-center">
            <div className="bg-red-600 px-3 md:px-4 py-2  rounded-lg">
                <div className="text-xl md:text-3xl font-bold">{days}</div>
                <div className="text-xs md:text-sm">Days</div>
            </div>
            <div className="bg-red-600 px-4 py-2 rounded-lg">
                <div className="text-xl md:text-3xl font-bold">{hours}</div>
                <div className="text-xs md:text-sm">Hours</div>
            </div>
            <div className="bg-red-600 px-4 py-2 rounded-lg">
                <div className="text-xl md:text-3xl font-bold">{minutes}</div>
                <div className="text-xs md:text-sm">Minutes</div>
            </div>
            <div className="bg-red-600 px-4 py-2 rounded-lg">
                <div className="text-xl md:text-3xl font-bold">{seconds}</div>
                <div className="text-xs md:text-sm">Seconds</div>
            </div>
        </div>
    );
}
