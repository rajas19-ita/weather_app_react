import React, { useState, useEffect } from "react";
import ReactSelect from "react-select";
import useFetchCoordinates from "./hooks/useFetchCoordinates";
import useFetchWeather from "./hooks/useFetchWeather";
import debounce from "./utils/debounce";
import { FaRegClock } from "react-icons/fa";
import { FaRegCalendarAlt } from "react-icons/fa";
import ForecastCard from "./components/ForecastCard";
import CurrentWeather from "./components/CurrentWeather";
import UnitSelect from "./components/UnitSelect";
import gif from "./assets/loadingGif.gif";

function App() {
    const { coordinatesList, fetchCoordinates, loadingC } =
        useFetchCoordinates();
    const {
        currentData,
        hourlyForecast,
        upcomingDaysForecast,
        fetchWeather,
        loadingW,
    } = useFetchWeather();
    const [location, setLocation] = useState();
    const [units, setUnits] = useState("metric");

    const debouncedFetchCoordinates = debounce(fetchCoordinates, 300);

    useEffect(() => {
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(
                async (position) => {
                    const respones = await fetch(
                        `https://api.mapbox.com/geocoding/v5/mapbox.places/${position.coords.longitude},${position.coords.latitude}.json?access_token=pk.eyJ1IjoicmFqYXMxNTQyIiwiYSI6ImNsNm9wNnVtbzA0ZDgzam41Y3h0eDEzeTAifQ.5Hnk2vKCKK1osFGS413cog`
                    );

                    const json = await respones.json();

                    if (respones.ok) {
                        setLocation({
                            label: json.features[0].place_name,
                            value: {
                                latitude: position.coords.latitude,
                                longitude: position.coords.longitude,
                            },
                        });
                    }
                },
                (error) => {
                    console.error("Error getting location:", error.message);
                }
            );
        } else {
            console.error("Geolocation is not supported by this browser.");
        }
    }, []);

    useEffect(() => {
        if (location && units) {
            fetchWeather(location.value, units);
        }
    }, [location, units]);

    return (
        <div className=" w-full max-w-xl aspect-[1] xs:h-screen mx-auto flex flex-col">
            <div className="flex items-center w-full">
                <ReactSelect
                    isSearchable
                    value={location}
                    onInputChange={(input) => debouncedFetchCoordinates(input)}
                    options={coordinatesList}
                    isLoading={loadingC}
                    onChange={(location) => setLocation(location)}
                    placeholder="Location"
                    className="w-[93.5%]"
                />
                <UnitSelect units={units} setUnits={setUnits} />
            </div>

            <div className="flex-grow bg-blue-300 px-6">
                {loadingW ? (
                    <img src={gif} className="w-14 mx-auto pt-4" />
                ) : (
                    <div className="flex flex-col justify-start h-full py-6">
                        <CurrentWeather data={currentData} units={units} />

                        <div className="flex flex-col gap-4 xs:gap-6">
                            <ForecastCard
                                data={hourlyForecast}
                                title={
                                    <>
                                        <FaRegClock />3 Hourly Forecast
                                    </>
                                }
                            />
                            <ForecastCard
                                data={upcomingDaysForecast}
                                title={
                                    <>
                                        <FaRegCalendarAlt />
                                        Upcoming Days Forecast
                                    </>
                                }
                            />
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}

export default App;
