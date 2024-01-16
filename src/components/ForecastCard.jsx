import React from "react";
import { GoDot } from "react-icons/go";
import { Tooltip } from "react-tooltip";

function ForecastCard({ data, title }) {
    return (
        <div className="px-5 pt-4 pb-6 bg-blue-500 bg-opacity-20 rounded-md ">
            <h2 className="flex items-center gap-2 mb-5 xs:mb-6 pl-1 text-slate-600">
                {title}
            </h2>
            <div
                className={`flex gap-[1.7rem] justify-between xs:px-7 overflow-auto xs:flex-col ${
                    data.length <= 4 ? "px-7" : null
                }`}
            >
                {data.map((item, i) => (
                    <div
                        className="flex flex-col xs:flex-row gap-1.5 items-center justify-between "
                        key={i}
                    >
                        <span className="text-[0.9rem] xs:text-base">
                            {item.time}
                        </span>

                        <div className="flex gap-1 items-start">
                            {item.weatherIcon.map((icon, i) => (
                                <React.Fragment key={i}>
                                    <img
                                        src={icon}
                                        className=" max-w-[3rem] xxs:max-w-[2.5rem]"
                                        data-tooltip-id={`my-tooltip-${
                                            item.time + icon
                                        }`}
                                    />
                                    <Tooltip
                                        id={`my-tooltip-${item.time + icon}`}
                                        place="right-center"
                                    >
                                        {item.weatherCondition[i]}
                                    </Tooltip>
                                </React.Fragment>
                            ))}
                        </div>
                        <div className="flex  gap-1 text-sm xs:text-base">
                            {item.temp.map((t, i) => (
                                <span
                                    className={`flex ${
                                        i === 1 ? "text-slate-600" : null
                                    }`}
                                    key={i}
                                >
                                    {t}
                                    <GoDot size={10} />
                                </span>
                            ))}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}

export default ForecastCard;
