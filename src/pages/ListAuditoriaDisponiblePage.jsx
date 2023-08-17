import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Container,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AssistantIcon from "@mui/icons-material/Assistant";
import { AuditoriaDisponibleCard } from "../components/AuditoriaDisponibleCard";
import { getStorageData } from "../functions/functions";

export function ListAuditoriaDisponiblePage() {
    const storageData = getStorageData();
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Auditorias disponibles";
    }, []);

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="fixed">
                <Toolbar
                    variant="dense"
                    sx={{
                        bgcolor: "#59185E",
                    }}
                >
                    <IconButton
                        edge="start"
                        size="large"
                        color="inherit"
                        aria-label="volver"
                        onClick={() => navigate(-1)}
                        sx={{ mr: 2 }}
                    >
                        <ArrowBackIcon />
                    </IconButton>
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 1 }}
                    >
                        Auditorias disponibles
                    </Typography>
                </Toolbar>
            </AppBar>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                    pt: 8,
                    px: 1,
                    pb: 2,
                    bgcolor: "#ecf0f1",
                }}
            >
                {storageData?.auditorias.length === 0 ? (
                    <Container
                        sx={{
                            textAlign: "center",
                            pt: 2,
                        }}
                    >
                        <AssistantIcon sx={{ fontSize: 64 }} />
                        <Typography variant="h6" sx={{ color: "black" }}>
                            No se encontraron auditorias disponibles
                        </Typography>
                    </Container>
                ) : (
                    <>
                        {storageData?.auditorias.map((auditoria) => (
                            <AuditoriaDisponibleCard
                                key={auditoria.id}
                                auditoria={auditoria}
                            />
                        ))}
                    </>
                )}
            </Box>
        </Box>
    );
}
