import {useEffect, useState} from "react";
import {useNavigate} from "react-router-dom";
import {toast} from "react-toastify";
import {
    Box,
    Backdrop,
    CircularProgress,
    Typography,
    Avatar,
} from "@mui/material";
import {apiData} from "../functions/api";
import {getStorageConfig} from "../functions/functions";

export function EmpresaPage() {
    const navigate = useNavigate();
    const [open, setOpen] = useState(false);
    const configData = getStorageConfig();

    useEffect(() => {
        document.title = "Seleccionar Empresa";
        if (!configData.loginStatus) return navigate("/config");
    }, []);

    const loadData = async () => {
        setOpen(true);
        await apiData(configData.server, configData.empresaID)
            .then((response) => response.json())
            .then((data) => {
                localStorage.setItem("data", JSON.stringify(data));
                setOpen(false);
                navigate("/");
            })
            .catch((error) => {
                console.log("Error al conectar con el servidor: ", error);
                toast.error(
                    "Error al conectar con el servidor. Por favor, intente más tarde."
                );
                setOpen(false);
            });
    };

    const handleSubmit = (e) => {
        const empresaID = e.currentTarget.getAttribute("data-id");
        configData?.unidades?.map((unidad) => {
            unidad.empresas?.map((empresa) => {
                if (empresa.id === parseInt(empresaID)) {
                    configData.empresaID = empresa.id;
                    configData.empresa = empresa.nombre;
                }
                return null;
            });
            return null;
        });
        localStorage.setItem("config", JSON.stringify(configData));
        loadData();
    };

    const getShortCompanyName = (name) => {
        const words = name.toUpperCase().split(" ");
        if (words.length > 1) {
            return `${words[0].substring(0, 1)} ${words[1].substring(0, 1)}`;
        }
        return `${words[0].substring(0, 1)} ${words[0].substring(1, 2)}`;
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "start",
                alignItems: "start",
                minHeight: "100vh",
                p: 2,
                background:
                    "linear-gradient(135deg, #010b02, #010b02, #59185E, #59185E)",
            }}
        >
            <Typography
                variant="h5"
                align="center"
                color="white"
                sx={{mb: 2}}
            >
                Seleccione la empresa con la cual trabajará
            </Typography>
            {configData?.unidades?.map((unidad) => (
                <Box
                    key={unidad.id}
                    sx={{
                        width: "100%",
                        mb: 2,
                    }}
                >
                    <Typography
                        variant="h5"
                        sx={{color: "white"}
                        }>
                        {unidad.nombre}
                    </Typography>
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: "repeat(4, 1fr)",
                            gap: 2,
                            py: 1,
                            px: 2,
                            backgroundColor: "rgba(255, 255, 255, 0.34)",
                            borderRadius: 2,
                        }}
                    >
                        {unidad?.empresas?.map((empresa) => (
                            <Box
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "start",
                                    alignItems: "center",
                                    gap: 1,
                                }}
                            >
                                <Avatar
                                    key={empresa.id}
                                    data-id={empresa.id}
                                    alt={empresa.nombre}
                                    src={empresa.logo}
                                    onClick={handleSubmit}
                                    sx={{
                                        width: 64,
                                        height: 64,
                                        backgroundColor: "white",
                                        color: "black",
                                        cursor: "pointer",
                                    }}
                                    imgProps={{
                                        style: {
                                            objectFit: "contain",
                                            width: "95%",
                                        },
                                    }}
                                >
                                    {getShortCompanyName(empresa.nombre)}
                                </Avatar>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        textAlign: "center",
                                        color: "white",
                                    }}
                                >{empresa.nombre}</Typography>
                            </Box>
                        ))}
                    </Box>
                </Box>
            ))}
            <Backdrop
                sx={{
                    color: "white",
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
                open={open}
            >
                <CircularProgress color="inherit"/>
            </Backdrop>
        </Box>
    );
}
