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
import AssignmentTurnedInIcon from "@mui/icons-material/AssignmentTurnedIn";
import { AuditoriaRealizadaCard } from "../components/AuditoriaRealizadaCard";
import {
    getStorageConfig,
    getStorageAuditoriasRealizadas,
} from "../functions/functions";

export function ListAuditoriaRealizadaPage() {
    const storageConfig = getStorageConfig();
    const [auditoriasRealizadas, setAuditoriasRealizadas] = useState([]);
    const [auditoriasRealizadasOrdenadas, setAuditoriasRealizadasOrdenadas] =
        useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        document.title = "Auditorias realizadas";
        window.scrollTo(0, 0);
        const storageAuditoriasRealizadas = getStorageAuditoriasRealizadas(
            storageConfig.empresaID
        );
        setAuditoriasRealizadas(storageAuditoriasRealizadas);
    }, []);

    useEffect(() => {
        localStorage.setItem(
            "auditorias",
            JSON.stringify(auditoriasRealizadas)
        );
        setAuditoriasRealizadasOrdenadas([...auditoriasRealizadas].reverse());
    }, [auditoriasRealizadas]);

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
                        Auditorias realizadas
                    </Typography>
                </Toolbar>
            </AppBar>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "start",
                    alignItems: "center",
                    pt: 8,
                    px: 1,
                    pb: 2,
                    backgroundColor: "background.main",
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
                        <AssignmentTurnedInIcon sx={{ fontSize: 64 }} />
                        <Typography variant="h6" sx={{ color: "black" }}>
                            Aún no has realizado ninguna auditoria
                        </Typography>
                    </Paper>
                ) : (
                    <>
                        {auditoriasRealizadasOrdenadas.map(
                            (auditoriaRealizada) => (
                                <AuditoriaRealizadaCard
                                    key={auditoriaRealizada.id}
                                    auditoriaRealizada={auditoriaRealizada}
                                    setAuditoriasRealizadas={
                                        setAuditoriasRealizadas
                                    }
                                />
                            )
                        )}
                    </>
                )}
            </Box>
        </Box>
    );
}
