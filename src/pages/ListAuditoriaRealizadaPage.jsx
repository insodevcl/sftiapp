import {useState, useEffect} from 'react';
import {useNavigate} from 'react-router-dom';
import {Box, AppBar, Toolbar, Paper, IconButton, Typography, Skeleton} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import AssignmentTurnedInIcon from '@mui/icons-material/AssignmentTurnedIn';
import {AuditoriaRealizadaCard} from '../components/AuditoriaRealizadaCard';
import {getConfigFromStorage} from '../functions/functions';

export function ListAuditoriaRealizadaPage() {
    const [auditoriasRealizada, setAuditoriasRealizada] = useState(undefined);
    const navigate = useNavigate();
    const storageConfig = getConfigFromStorage();

    useEffect(() => {
        document.title = 'Auditorias realizadas';
        window.scrollTo(0, 0);
        if (!storageConfig.userToken) return navigate('/config');
        if (!storageConfig.empresaID) return navigate('/empresa');
        setTimeout(() => {
            searchAuditorias();
        }, 200);
    }, []);

    const searchAuditorias = () => {
        let filteredAuditorias = JSON.parse(localStorage.getItem('auditoria')) || [];
        filteredAuditorias = filteredAuditorias.filter(auditoria => auditoria.servidor_id === null || auditoria.servidor_id === undefined);
        setAuditoriasRealizada(filteredAuditorias);
    }

    return (
        <Box sx={{flexGrow: 1}}>
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
                        sx={{mr: 2}}
                    >
                        <ArrowBackIcon/>
                    </IconButton>
                    <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
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
                {!auditoriasRealizada ? (
                    <Paper
                        elevation={3}
                        sx={{
                            width: "90%",
                            p: 2,
                            textAlign: "center",
                        }}
                    >
                        <Skeleton
                            height={60}
                        />
                        <Skeleton width="60%"/>
                        <Skeleton width="40%"/>
                        <Box
                            sx={{
                                display: "flex",
                                justifyContent: "end",
                                pt: 2,
                            }}
                        >
                            <Skeleton
                                variant="rounded"
                                width="30%"
                                height={30}
                            />
                        </Box>
                    </Paper>
                ) : (
                    auditoriasRealizada.length === 0 ? (
                        <Paper
                            elevation={3}
                            sx={{
                                textAlign: "center",
                                p: 2,
                            }}
                        >
                            <AssignmentTurnedInIcon sx={{fontSize: 64}}/>
                            <Typography variant="h6" sx={{color: "black"}}>
                                Aún no has realizado ninguna auditoria
                            </Typography>
                        </Paper>
                    ) : (
                        auditoriasRealizada?.reverse().map((auditoriaRealizada) => (
                            <AuditoriaRealizadaCard
                                key={auditoriaRealizada.uuid}
                                auditoriaRealizada={auditoriaRealizada}
                                setAuditoriasRealizada={setAuditoriasRealizada}
                            />
                        ))
                    )
                )}
            </Box>
        </Box>
    );
}
