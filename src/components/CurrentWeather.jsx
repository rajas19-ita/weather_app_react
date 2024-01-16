import React from "react";
import { GoDot } from "react-icons/go";
import roundTemperature from "../utils/roundTemperature";
import WeatherIcon from "./WeatherIcon";

function CurrentWeather({ data, units }) {
    return (
        <div className="flex pb-6 pt-3 justify-between items-center">
            <div className="flex items-center gap-4 xxs:gap-3 pl-2 xs:pl-0">
                <WeatherIcon icon={`/${data.weather[0].icon}.png`} size="L" />

                <div className="flex flex-col  ">
                    <div className="flex items-center gap-1">
                        <span className="text-4xl xs:text-[2rem] font-medium">
                            {roundTemperature(data.main.temp)}
                        </span>
                        <span className={`flex self-start pt-1`}>
                            <GoDot size={10} />
                            {units === "metric" ? "C" : "F"}
                        </span>
                    </div>

                    <h3 className=" text-slate-600 ">
                        Humidity {data.main.humidity}%
                    </h3>
                </div>
            </div>
            <div className="flex flex-col justify-center items-end pr-1">
                <h2 className="text-xl">Weather</h2>
                <span className="text-slate-600">
                    {new Date((data.dt + data.timezone) * 1000).toLocaleString(
                        "en-US",
                        {
                            timeZone: "UTC",
                            weekday: "short",
                            hour: "numeric",
                            minute: "numeric",
                            hour12: true,
                        }
                    )}
                </span>
                <span className="text-slate-600">{data.weather[0].main}</span>
            </div>
        </div>
    );
}

export default CurrentWeather;
