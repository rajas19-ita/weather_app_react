import { useState } from "react";
import conditionIcons from "../utils/conditionIcons";
import roundTemperature from "../utils/roundTemperature";

const groupByDay = (data, timezone) => {
    return data.reduce((result, entry) => {
        const date = new Date(entry.dt * 1000 + timezone * 1000); // Convert timestamp to date
        const day = date.toLocaleString("en-US", {
            timeZone: "UTC",
            weekday: "short",
        });

        if (!result[day]) {
            result[day] = [];
            result["days"] = result["days"] ? [...result["days"], day] : [day];
        }

        result[day].push(entry);

        return result;
    }, {});
};

const processForecastData = (f) => {
    let upcomingDaysForecast = [];

    f.days.forEach((day) => {
        let conditions = {};
        let weightage = [];
        let data = {
            time: day,
            weatherIcon: [],
            temp: [],
            weatherCondition: [],
        };

        data.temp.push(
            roundTemperature(
                f[day]
                    .map((d) => d.main.temp_max)
                    .reduce((max, entry) => Math.max(max, entry), -Infinity)
            )
        );

        data.temp.push(
            roundTemperature(
                f[day]
                    .map((d) => d.main.temp_min)
                    .reduce((min, entry) => Math.min(min, entry), Infinity)
            )
        );

        for (let [index, d] of f[day].entries()) {
            if (index === 0 || index === 1) {
                continue;
            }
            let key = "";
            if (
                d.weather[0].description === "scattered clouds" ||
                d.weather[0].description === "few clouds"
            ) {
                key = d.weather[0].description;
            } else {
                key = d.weather[0].main;
            }

            if (conditions[key] === undefined) {
                conditions[key] = weightage.length;
                weightage.push({
                    condition: key,
                    w: 1,
                });
                continue;
            }
            weightage[conditions[key]].w += 1;
        }

        weightage.forEach((c) => {
            if (
                c.condition === "Rain" ||
                c.condition === "Tornado" ||
                c.condition === "Snow" ||
                c.condition === "Thunderstorm"
            ) {
                data.weatherIcon.push(conditionIcons[c.condition]);
                data.weatherCondition.push(c.condition);
            }
        });

        if (data.weatherIcon.length === 0) {
            let max = Math.max(...weightage.map((c) => c.w));
            let c = weightage.find((c) => c.w === max);

            data.weatherIcon.push(conditionIcons[c.condition]);
            data.weatherCondition.push(c.condition);
        }
        upcomingDaysForecast.push(data);
    });

    return upcomingDaysForecast;
};

const useFetchWeather = () => {
    const [currentData, setCurrentData] = useState();
    const [hourlyForecast, setHourlyForecast] = useState();
    const [upcomingDaysForecast, setUpcomingDaysForecast] = useState();
    const [loadingW, setLoadingW] = useState(true);

    const fetchWeather = async (coordinate, units = "metric") => {
        if (coordinate) {
            setLoadingW(true);
            const [currentWeatherResponse, forecastResponse] =
                await Promise.all([
                    fetch(
                        `https://api.openweathermap.org/data/2.5/weather?lat=${
                            coordinate.latitude
                        }&lon=${coordinate.longitude}&units=${units}&appid=${
                            import.meta.env.VITE_OPENWEATHER_KEY
                        }`
                    ),
                    fetch(
                        `https://api.openweathermap.org/data/2.5/forecast?lat=${
                            coordinate.latitude
                        }&lon=${coordinate.longitude}&units=${units}&appid=${
                            import.meta.env.VITE_OPENWEATHER_KEY
                        }`
                    ),
                ]);
            const [currentWeather, forecast] = await Promise.all([
                currentWeatherResponse.json(),
                forecastResponse.json(),
            ]);

            if (currentWeatherResponse.ok && forecastResponse.ok) {
                setCurrentData(currentWeather);
                setHourlyForecast(
                    forecast.list.slice(0, 6).map((item) => ({
                        time: new Date(
                            (item.dt + forecast.city.timezone) * 1000
                        ).toLocaleString("en-US", {
                            timeZone: "UTC",
                            hour: "numeric",
                            hour12: true,
                        }),
                        weatherIcon: ["/" + item.weather[0].icon + ".png"],
                        temp: [roundTemperature(item.main.temp)],
                        weatherCondition: [item.weather[0].description],
                    }))
                );

                let f = groupByDay(forecast.list, forecast.city.timezone);
                delete f[f.days[0]];
                if (f[f.days[f.days.length - 1]].length < 4) {
                    delete f[f.days[f.days.length - 1]];
                    f.days.pop();
                }
                f.days = f.days.slice(1);

                setUpcomingDaysForecast(processForecastData(f));
            }
            setLoadingW(false);
        }
    };

    return {
        currentData,
        hourlyForecast,
        upcomingDaysForecast,
        fetchWeather,
        loadingW,
    };
};

export default useFetchWeather;
