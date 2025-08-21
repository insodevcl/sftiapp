import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Box, AppBar, Toolbar, IconButton, Typography, Paper, Skeleton} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SpeakerNotesOffIcon from '@mui/icons-material/SpeakerNotesOff';
import {AuditoriaDisponibleCard} from '../components/AuditoriaDisponibleCard';
import {getConfigFromStorage} from "../functions/functions";

export function ListAuditoriaDisponiblePage() {
    const [evaluacionesDisponible, setEvaluacionesDisponible] = useState(undefined);
    const navigate = useNavigate();
    const storageConfig = getConfigFromStorage();

    useEffect(() => {
        document.title = 'Auditorias disponibles';
        window.scrollTo(0, 0);
        if (!storageConfig.userToken) return navigate('/config');
        if (!storageConfig.empresaID) return navigate('/empresa');
        setTimeout(() => {
            setEvaluacionesDisponible(JSON.parse(localStorage.getItem('evaluacion')) || []);
        }, 200);
    }, []);

    return (
        <Box sx={{flexGrow: 1}}>
            <AppBar position="fixed">
                <Toolbar
                    variant="dense"
                    sx={{
                        backgroundColor: 'background.primary',
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
                        Auditorias disponibles
                    </Typography>
                </Toolbar>
            </AppBar>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center',
                    pt: 8,
                    px: 1,
                    pb: 2,
                    backgroundColor: 'background.main',
                }}
            >
                {!evaluacionesDisponible ? (
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
                    evaluacionesDisponible.length === 0 ? (
                        <Paper
                            elevation={3}
                            sx={{
                                width: "98%",
                                pt: 2,
                                pb: 2,
                                textAlign: "center",
                            }}
                        >
                            <SpeakerNotesOffIcon sx={{fontSize: 64}}/>
                            <Typography variant="h6" sx={{color: 'black'}}>
                                No se encontraron auditorias disponibles
                            </Typography>
                        </Paper>
                    ) : (
                        evaluacionesDisponible.map((auditoria) => (
                            <AuditoriaDisponibleCard
                                key={auditoria.id}
                                auditoria={auditoria}
                            />
                        ))
                    )
                )}
            </Box>
        </Box>
    );
}
