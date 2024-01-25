import { useState } from "react";

const useFetchCoordinates = () => {
    const [coordinatesList, setCoordinatesList] = useState([]);
    const [loadingC, setLoadingC] = useState(false);

    const fetchCoordinates = async (address) => {
        setCoordinatesList([]);
        if (address) {
            setLoadingC(true);
            const response = await fetch(
                `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
                    address
                )}.json?access_token=${import.meta.env.VITE_MAPBOX_KEY}`
            );

            const json = await response.json();

            if (response.ok) {
                setCoordinatesList(
                    json.features.map((location) => ({
                        label: location.place_name,
                        value: {
                            longitude: location.center[0],
                            latitude: location.center[1],
                        },
                    }))
                );
            }
            setLoadingC(false);
        }
    };

    return { coordinatesList, fetchCoordinates, loadingC };
};

export default useFetchCoordinates;
