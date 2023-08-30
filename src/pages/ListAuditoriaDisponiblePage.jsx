import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Paper,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import SpeakerNotesOffIcon from "@mui/icons-material/SpeakerNotesOff";
import { AuditoriaDisponibleCard } from "../components/AuditoriaDisponibleCard";
import { getStorageData } from "../functions/functions";

export function ListAuditoriaDisponiblePage() {
    const storageData = getStorageData();
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Auditorias disponibles";
        window.scrollTo(0, 0);
    }, []);

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="fixed">
                <Toolbar
                    variant="dense"
                    sx={{
                        backgroundColor: "background.primary",
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
                    backgroundColor: "background.main",
                }}
            >
                {storageData["auditorias"] === undefined ? (
                    <Paper
                        elevation={3}
                        sx={{
                            textAlign: "center",
                            p: 2,
                        }}
                    >
                        <SpeakerNotesOffIcon sx={{ fontSize: 64 }} />
                        <Typography variant="h6" sx={{ color: "black" }}>
                            No se encontraron auditorias disponibles
                        </Typography>
                    </Paper>
                ) : (
                    <>
                        {storageData?.auditorias
                            .filter((x) => x.estado_id === 2)
                            .map((auditoria) => (
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
