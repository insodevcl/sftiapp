import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getStorageConfig } from "../functions/functions";
import { Box, Typography, Avatar, Button } from "@mui/material";

export function EmpresaPage() {
    const navigate = useNavigate();
    const configData = getStorageConfig();

    useEffect(() => {
        document.title = "Seleccionar Empresa";
        if (!configData.loginStatus) return navigate("/config");
    }, []);

    const handleSubmit = (e) => {
        const empresaID = e.currentTarget.getAttribute("data-id");
        configData.unidades.map((unidad) => {
            unidad.empresas.map((empresa) => {
                if (empresa.id === parseInt(empresaID)) {
                    configData.empresaID = empresa.id;
                    configData.empresa = empresa.nombre;
                }
            });
        });
        localStorage.setItem("config", JSON.stringify(configData));
        navigate("/");
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "top",
                alignItems: "start",
                height: "100vh",
                p: 2,
                background:
                    "linear-gradient(135deg, #010b02, #010b02, #59185E, #59185E)",
            }}
        >
            <Typography
                variant="h5"
                align="center"
                color="white"
                sx={{ mb: 2 }}
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
                    <Typography variant="h5" sx={{ color: "white" }}>
                        {unidad.nombre}
                    </Typography>
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: "repeat(4, 1fr)",
                            gap: 2,
                            py: 1,
                            px: 2,
                            bgcolor: "rgba(255, 255, 255, 0.34)",
                            borderRadius: 2,
                        }}
                    >
                        {unidad.empresas.map((empresa) => (
                            <Avatar
                                key={empresa.id}
                                data-id={empresa.id}
                                alt={empresa.nombre}
                                src={empresa.logo}
                                onClick={handleSubmit}
                                sx={{
                                    width: 64,
                                    height: 64,
                                    bgcolor: "white",
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
                                {`${empresa.nombre.split(" ")[0][0]}`}{" "}
                                {`${empresa.nombre.split(" ")[1][0]}`}
                            </Avatar>
                        ))}
                    </Box>
                </Box>
            ))}
        </Box>
    );
}
