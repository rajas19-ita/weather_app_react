import React, { useState } from "react";
import { GoGear } from "react-icons/go";
import { GoDot } from "react-icons/go";

function UnitSelect({ units, setUnits }) {
    const [open, setOpen] = useState(false);
    return (
        <div className=" relative">
            <button className={`p-2`} onClick={() => setOpen(!open)}>
                <GoGear size={20} />
            </button>
            {open ? (
                <div className="flex absolute right-0 top-[2.35rem] bg-blue-400  rounded-md">
                    <button
                        className={`flex p-1 ${
                            units === "metric" ? "bg-blue-500" : "bg-blue-400"
                        }  rounded-md`}
                        onClick={() => {
                            setUnits("metric");
                            setOpen(false);
                        }}
                    >
                        <GoDot size={10} />C
                    </button>
                    <button
                        className={`flex p-1 ${
                            units === "imperial" ? "bg-blue-500" : "bg-blue-400"
                        }  rounded-md`}
                        onClick={() => {
                            setUnits("imperial");
                            setOpen(false);
                        }}
                    >
                        <GoDot size={10} />F
                    </button>
                </div>
            ) : null}
        </div>
    );
}

export default UnitSelect;
