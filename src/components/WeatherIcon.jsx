import React, { useState } from "react";

function WeatherIcon({ icon, size }) {
    const [loading, setLoading] = useState(true);

    return (
        <>
            {loading ? (
                <div
                    className={`${
                        size === "L"
                            ? "w-[3.75rem] h-[3.75rem]"
                            : "w-[3rem] xxs:w-[2.5rem] h-[3rem] xxs:h-[2.5rem]"
                    } rounded-full bg-blue-500 animate-pulse`}
                ></div>
            ) : null}
            <img
                src={icon}
                className={`${
                    size === "L"
                        ? "max-w-[3.75rem]"
                        : "max-w-[3rem] xxs:max-w-[2.5rem]"
                }  ${loading ? "none" : "block"} `}
                onLoad={() => setLoading(false)}
            />
        </>
    );
}

export default WeatherIcon;
