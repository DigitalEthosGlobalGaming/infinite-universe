import { useState } from "react";
import { useEffectOnce } from "react-use";

export const useClientOnly = () => {
    const [loaded, setLoaded] = useState(false);

    useEffectOnce(() => {
        setLoaded(true);
    });

    return loaded;
};
