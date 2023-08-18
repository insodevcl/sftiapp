import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import {
    Box,
    AppBar,
    Toolbar,
    Paper,
    IconButton,
    Typography,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import AssistantIcon from "@mui/icons-material/Assistant";
import { AuditoriaRealizadaCard } from "../components/AuditoriaRealizadaCard";
import {
    getStorageConfig,
    getStorageAuditoriasRealizadas,
} from "../functions/functions";

export function ListAuditoriaRealizadaPage() {
    const storageConfig = getStorageConfig();
    const [auditoriasRealizadas, setAuditoriasRealizadas] = useState([]);

    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Auditorias realizadas";
        setAuditoriasRealizadas(getStorageAuditoriasRealizadas(storageConfig.empresaID));
    }, []);

    useEffect(() => {
        localStorage.setItem(
            "auditorias",
            JSON.stringify(auditoriasRealizadas)
        );
    }, [auditoriasRealizadas])

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="fixed">
                <Toolbar
                    variant="dense"
                    sx={{
                        bgcolor: "background.primary",
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
                        Auditorias realizadas
                    </Typography>
                </Toolbar>
            </AppBar>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "top",
                    alignItems: "center",
                    pt: 8,
                    px: 1,
                    pb: 2,
                    bgcolor: "background.main",
                    minHeight: "100vh",
                }}
            >
                {auditoriasRealizadas.length === 0 ? (
                    <Paper
                        elevation={3}
                        sx={{
                            textAlign: "center",
                            p: 2,
                        }}
                    >
                        <AssistantIcon sx={{ fontSize: 64 }} />
                        <Typography variant="h6" sx={{ color: "black" }}>
                            Aún no has realizado ninguna auditoria
                        </Typography>
                    </Paper>
                ) : (
                    <>
                        {auditoriasRealizadas.map((auditoriaRealizada) => (
                            <AuditoriaRealizadaCard
                                key={auditoriaRealizada.id}
                                auditoriaRealizada={auditoriaRealizada}
                                setAuditoriasRealizadas={setAuditoriasRealizadas}
                            />
                        ))}
                    </>
                )}
            </Box>
        </Box>
    );
}
