import {useEffect} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {Box, Container, AppBar, Toolbar, IconButton, Typography, Divider, Paper, Stack} from '@mui/material';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import CancelIcon from '@mui/icons-material/Cancel';
import RemoveCircleIcon from '@mui/icons-material/RemoveCircle';
import CircleIcon from '@mui/icons-material/Circle';
import {
    getConfigFromStorage,
    stringToLocalDateTime,
    getEvaluacionFromStorage,
    getAuditoriaFromStorage,
    getTrabajadorFromStorage,
    getCriticidadFromStorage,
} from '../functions/functions';
import {AuditoriaRespuesta} from '../components/AuditoriaRespuesta';

export function ViewAuditoriaRealizadaPage() {
    const {uuid} = useParams();
    const auditoria = getAuditoriaFromStorage(uuid)
    const evaluacion = getEvaluacionFromStorage(auditoria.evaluacion_id)
    const navigate = useNavigate();
    const storageConfig = getConfigFromStorage();

    useEffect(() => {
        document.title = 'Ver auditoría realizada';
        window.scrollTo(0, 0);
        if (!storageConfig.userToken) return navigate('/config');
        if (!storageConfig.empresaID) return navigate('/empresa');
    }, []);

    const getAplicada = () => {
        let aplicada = undefined;
        switch (evaluacion.tipo_id) {
            case 2:
                switch (evaluacion.categoria_id) {
                    case 1:
                        aplicada = `Trabajador (${auditoria.trabajador})`;
                        break;
                    case 2:
                        aplicada = `Maquinaria (${auditoria.maquinaria})`;
                        break;
                    case 3:
                        aplicada = `Herramienta (${auditoria.herramienta})`;
                        break;
                    case 4:
                        aplicada = `Equipo (${auditoria.equipo})`;
                        break;
                    case 5:
                        aplicada = `Instalación (${auditoria.instalacion})`;
                        break;
                    case 6:
                        aplicada = `Trasporte (${auditoria.transporte})`;
                        break;
                    case 7:
                        aplicada = `Equipo de emergencia (${auditoria.equipo_emergencia})`;
                        break;
                    default:
                        aplicada = 'No aplica';
                        break;
                }
                break;
            case 3:
                aplicada = `Sucursal (${auditoria.sucursal})`;
                break;
            case 4:
                aplicada = `Faena (${auditoria.faena})`;
                break;
            case 5:
                aplicada = `Contratista (${auditoria.contratista})`;
                break;
            default:
                break;
        }
        return aplicada;
    };

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
                        Auditoria realizada
                    </Typography>
                </Toolbar>
            </AppBar>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    justifyContent: 'start',
                    alignItems: 'center',
                    pt: 8,
                    px: 2,
                    pb: 2,
                    backgroundColor: 'background.main',
                }}
            >
                <Paper
                    elevation={3}
                    sx={{
                        width: '100%',
                        backgroundColor: 'white',
                        mb: 2,
                    }}
                >
                    <Container
                        sx={{
                            textAlign: 'center',
                            p: 2,
                            backgroundColor: 'background.primary',
                            borderTopLeftRadius: 4,
                            borderTopRightRadius: 4,
                        }}
                    >
                        <Typography variant="h6" component="div" sx={{color: 'white'}}>
                            Antecedentes de la auditoría
                        </Typography>
                    </Container>
                    <Container
                        sx={{
                            textAlign: 'left',
                            p: 2,
                        }}
                    >
                        <Typography variant="body2" component="div">
                            <strong>Fecha de realización:</strong> {stringToLocalDateTime(auditoria.fecha)}
                        </Typography>
                        <Typography variant="body2" component="div">
                            <strong>Aplicada por:</strong> {auditoria.realizador}
                        </Typography>
                        <Typography variant="body2" component="div">
                            <strong>ID:</strong> {auditoria.uuid}
                        </Typography>
                        <Typography variant="body2" component="div">
                            <strong>Descripción:</strong> {evaluacion.descripcion}
                        </Typography>
                        <Typography variant="body2" component="div">
                            <strong>Tipo:</strong> {evaluacion.tipo}
                        </Typography>
                        <Typography variant="body2" component="div">
                            <strong>Categoría:</strong> {evaluacion.categoria || 'No aplica'}
                        </Typography>
                        <Typography variant="body2" component="div">
                            <strong>Subárea:</strong> {auditoria.subarea}
                        </Typography>
                        <Typography variant="body2" component="div">
                            <strong>Aplicada a:</strong> {getAplicada()}
                        </Typography>
                        <Typography variant="body2" component="div">
                            <strong>Operador:</strong> {auditoria.operador || 'No aplica'}
                        </Typography>
                    </Container>
                    <Paper
                        variant="outlined"
                        sx={{
                            backgroundColor: 'white',
                            m: 2,
                        }}
                    >
                        <Typography
                            variant="h6"
                            sx={{
                                textAlign: 'center',
                                mb: 2,
                            }}
                        >
                            Simbología
                        </Typography>
                        <Stack
                            direction="row"
                            divider={<Divider orientation="vertical" flexItem/>}
                            sx={{
                                display: 'flex',
                                justifyContent: 'space-between',
                                alignItems: 'center',
                            }}
                        >
                            <Container
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'start',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    height: '64px',
                                    p: 0,
                                }}
                            >
                                <CheckCircleIcon fontSize="small" color="success"/>
                                <Typography variant="body2" component="em">
                                    Cumple
                                </Typography>
                            </Container>
                            <Container
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'start',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    height: '64px',
                                    p: 0,
                                }}
                            >
                                <CancelIcon fontSize="small" color="error"/>
                                <Typography variant="body2" component="em">
                                    No cumple
                                </Typography>
                            </Container>
                            <Container
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'start',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    height: '64px',
                                    p: 0,
                                }}
                            >
                                <RemoveCircleIcon fontSize="small" color="warning"/>
                                <Typography variant="body2" component="em">
                                    Corrección
                                </Typography>
                            </Container>
                            <Container
                                sx={{
                                    display: 'flex',
                                    flexDirection: 'column',
                                    justifyContent: 'start',
                                    alignItems: 'center',
                                    textAlign: 'center',
                                    height: '64px',
                                    p: 0,
                                }}
                            >
                                <CircleIcon fontSize="small" color="grey"/>
                                <Typography variant="body2" component="em">
                                    No aplica
                                </Typography>
                            </Container>
                        </Stack>
                    </Paper>
                </Paper>
                {evaluacion.grupos?.map((grupo) => (
                    <Paper
                        key={grupo.id}
                        sx={{
                            width: '100%',
                            backgroundColor: 'white',
                            mb: 2,
                        }}
                    >
                        <Container
                            sx={{
                                textAlign: 'center',
                                p: 2,
                                backgroundColor: 'background.primary',
                                borderTopLeftRadius: 4,
                                borderTopRightRadius: 4,
                            }}
                        >
                            <Typography variant="h6" component="div" sx={{color: 'white'}}>
                                {grupo.nombre}
                            </Typography>
                        </Container>
                        {grupo.preguntas?.map((pregunta) => (
                            <AuditoriaRespuesta
                                key={pregunta.id}
                                pregunta={pregunta}
                                auditoria={auditoria}
                            />
                        ))}
                    </Paper>
                ))}
                <Paper
                    elevation={3}
                    sx={{
                        width: '100%',
                        backgroundColor: 'white',
                        mb: 2,
                    }}
                >
                    <Container
                        sx={{
                            textAlign: 'center',
                            p: 2,
                            backgroundColor: 'background.primary',
                            borderTopLeftRadius: 4,
                            borderTopRightRadius: 4,
                        }}
                    >
                        <Typography variant="h6" component="div" sx={{color: 'white'}}>
                            <b>Observaciones</b>
                        </Typography>
                    </Container>
                    {auditoria.observaciones === '' ? (
                        <Container
                            sx={{
                                textAlign: 'center',
                                p: 2,
                            }}
                        >
                            <Typography variant="body1" component="div" sx={{color: 'black'}}>
                                No se registraron observaciones
                            </Typography>
                        </Container>
                    ) : (
                        <Container
                            sx={{
                                p: 2,
                            }}
                        >
                            <Typography variant="body1" component="div">
                                {auditoria.observaciones}
                            </Typography>
                        </Container>
                    )}
                </Paper>
                <Paper
                    elevation={3}
                    sx={{
                        width: '100%',
                        backgroundColor: 'white',
                        mb: 2,
                    }}
                >
                    <Container
                        sx={{
                            textAlign: 'center',
                            p: 2,
                            backgroundColor: 'background.primary',
                            borderTopLeftRadius: 4,
                            borderTopRightRadius: 4,
                        }}
                    >
                        <Typography variant="h6" component="div" sx={{color: 'white'}}>
                            <b>Asignación de tareas</b>
                        </Typography>
                    </Container>
                    {auditoria.tareas.length === 0 ? (
                        <Container
                            sx={{
                                textAlign: 'center',
                                p: 2,
                            }}
                        >
                            <Typography variant="body1" component="div" sx={{color: 'black'}}>
                                No se registraron tareas
                            </Typography>
                        </Container>
                    ) : (
                        <>
                            {auditoria.tareas.map((tarea) => (
                                <Container
                                    sx={{
                                        p: 2,
                                    }}
                                >
                                    <Typography variant="body1" component="div">
                                        <b>Tarea:</b> {tarea.tarea}
                                    </Typography>
                                    <Typography variant="body1" component="div">
                                        <b>Descripción:</b> {tarea.descripcion}
                                    </Typography>
                                    <Typography variant="body1" component="div">
                                        <b>Supervisor:</b> {getTrabajadorFromStorage(tarea.supervisor_id)?.nombre}
                                    </Typography>
                                    <Typography variant="body1" component="div">
                                        <b>Responsable:</b> {getTrabajadorFromStorage(tarea.responsable_id)?.nombre}
                                    </Typography>
                                    <Typography variant="body1" component="div">
                                        <b>Criticidad:</b> {getCriticidadFromStorage(tarea.criticidad_id)?.nivel}
                                    </Typography>
                                    <Typography variant="body1" component="div">
                                        <b>Fecha de cierre:</b> {tarea.fecha_cierre}
                                    </Typography>
                                    <Divider
                                        sx={{
                                            my: 2,
                                        }}
                                    />
                                </Container>
                            ))}
                        </>
                    )}
                </Paper>
                <Divider/>
            </Box>
        </Box>
    );
}
