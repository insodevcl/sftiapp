import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    initStorage,
    getStorageConfig,
    getStorageData,
} from "../functions/functions";
import { getApiData } from "../functions/api";

export function HomePage() {
    const [dataState, setDataState] = useState({});
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Inicio";
        initStorage();
        const configData = getStorageConfig();
        if (!configData.loginStatus) return navigate("/config");
        if (!configData.empresaID) return navigate("/empresa");

        const loadData = async () => {
            const response = await getApiData(
                configData.server,
                configData.empresaID
            );
            setDataState(response.data);
            localStorage.setItem("data", JSON.stringify(response.data));
        };

        if (navigator.onLine) {
            console.log("online");
            loadData();
        } else {
            console.log("offline");
            const storageData = getStorageData();
            setDataState(storageData);
        }
    }, []);

    return <div>HomePage</div>;
}
