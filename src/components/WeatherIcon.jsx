import React, { useState } from "react";

function WeatherIcon({ icon }) {
    const [loading, setLoading] = useState(true);

    if (loading) {
        return (
            <div className="w-[3rem] xxs:w-[2.5rem] h-[3rem] xxs:h-[2.5rem] rounded-full bg-blue-600 animate-pulse"></div>
        );
    } else {
        return (
            <img
                src={icon}
                className={` max-w-[3rem] xxs:max-w-[2.5rem] ${
                    loading ? "none" : "block"
                } `}
                onLoad={() => setLoading(false)}
            />
        );
    }
}

export default WeatherIcon;
