import {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';
import {toast} from 'react-toastify';
import {
    Box,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Card,
    CardHeader,
    CardContent,
    CardActions,
    Button,
    Stack,
    CircularProgress,
    Typography,
    Divider,
    Paper,
    Alert,
} from '@mui/material';
import CloudDoneIcon from '@mui/icons-material/CloudDone';
import CloudSyncIcon from '@mui/icons-material/CloudSync';
import VisibilityIcon from '@mui/icons-material/Visibility';
import DeleteIcon from '@mui/icons-material/Delete';
import {getConfigFromStorage, getEvaluacionFromStorage, stringToLocalDateTime} from '../functions/functions';
import {apiAuditoriaPost} from '../functions/api';

export function AuditoriaRealizadaCard({auditoriaRealizada, setAuditoriasRealizada}) {
    const storageConfig = getConfigFromStorage();
    const evaluacion = getEvaluacionFromStorage(auditoriaRealizada.evaluacion_id);
    const [isLoading, setIsLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [online, setOnline] = useState(navigator.onLine);
    const [sync, setSync] = useState(auditoriaRealizada.sync);
    const [syncing, setSyncing] = useState(false);
    const [nPreguntas, setNPreguntas] = useState(0);
    const [nRespuestasSi, setNRespuestasSi] = useState(0);
    const [nRespuestasNo, setNRespuestasNo] = useState(0);
    const [nRespuestasNC, setNRespuestasNC] = useState(0);
    const [nRespuestasNA, setNRespuestasNA] = useState(0);

    useEffect(() => {
        setIsLoading(true);
        window.addEventListener('online', () => setOnline(true));
        window.addEventListener('offline', () => setOnline(false));
        setIsLoading(false);
    }, []);

    useEffect(() => {
        countPreguntas();
        countRespuestasSi();
        countRespuestasNo();
        countRespuestasNC();
        countRespuestasNA();
    }, [evaluacion]);

    useEffect(() => {
        if (!sync && online) {
            syncAuditoria();
        }
    }, [online]);

    const countPreguntas = () => {
        let contador = 0;
        evaluacion?.grupos?.map((grupo) => {
            grupo.preguntas?.map((pregunta) => {
                if (pregunta.tipo_id === 2) {
                    contador++;
                }
                return null;
            });
            return null;
        });
        setNPreguntas(contador);
    };

    const countRespuestasSi = () => {
        const respuestas = auditoriaRealizada.respuestas.filter((x) => x.respuesta === 1);
        setNRespuestasSi(respuestas.length);
    };

    const countRespuestasNo = () => {
        const respuestas = auditoriaRealizada.respuestas.filter((x) => x.respuesta === 2);
        setNRespuestasNo(respuestas.length);
    };

    const countRespuestasNC = () => {
        const respuestas = auditoriaRealizada.respuestas.filter((x) => x.respuesta === 3);
        setNRespuestasNC(respuestas.length);
    };

    const countRespuestasNA = () => {
        const respuestas = auditoriaRealizada.respuestas.filter((x) => x.respuesta === 0);
        setNRespuestasNA(respuestas.length);
    };

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const syncAuditoria = () => {
        setSyncing(true);
        apiAuditoriaPost(storageConfig.serverUrl, auditoriaRealizada)
            .then((response) => {
                if (response.status === 200) {
                    setSync(true);
                    auditoriaRealizada.sync = true;
                    updateSyncAuditoriaRealizada(auditoriaRealizada.uuid);
                } else {
                    toast.error(`Error al sincronizar auditoria ID: ${auditoriaRealizada.uuid} ${response.statusText}`);
                }
                setSyncing(false);
            })
            .catch((error) => {
                console.log(error);
                toast.error(`Error al sincronizar auditoria ID: ${auditoriaRealizada.uuid} ${error}`);
                setSyncing(false);
            });
    };

    const updateSyncAuditoriaRealizada = (uuid) => {
        const auditoriasRealizadas = JSON.parse(localStorage.getItem('auditoria'));
        const index = auditoriasRealizadas.findIndex((x) => x.uuid === uuid);
        auditoriasRealizadas[index].sync = true;
        localStorage.setItem('auditoria', JSON.stringify(auditoriasRealizadas));
        setAuditoriasRealizada(auditoriasRealizadas);
    };

    const deleteAuditoriaRealizada = (uuid) => {
        console.log(`Auditoria delete: ${uuid}`);
        const auditoriasRealizadas = JSON.parse(localStorage.getItem('auditoria'));
        const index = auditoriasRealizadas.findIndex((x) => x.uuid === uuid);
        auditoriasRealizadas.splice(index, 1);
        localStorage.setItem('auditoria', JSON.stringify(auditoriasRealizadas));
        setAuditoriasRealizada(auditoriasRealizadas);
        handleCloseDialog();
    };

    const CircularProgressWithLabel = ({label, value, maxValue, color}) => {
        return (
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "start",
                    alignItems: "center",
                }}
            >
                <Box
                    sx={{
                        position: "relative",
                        display: "inline-flex"
                    }}
                >
                    <CircularProgress
                        variant="determinate"
                        value={Math.round((value / maxValue) * 100)}
                        size={48}
                        thickness={4}
                        color={color}
                    />
                    <Box
                        sx={{
                            top: 0,
                            left: 0,
                            bottom: 0,
                            right: 0,
                            position: "absolute",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <Typography variant="caption" component="div" color="black">
                            {`${Math.round((value / maxValue) * 100)}%`}
                        </Typography>
                    </Box>
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "center",
                        alignItems: "center",
                        pt: 1,
                    }}
                >
                    <Typography
                        variant="caption"
                        color="black"
                        align="center"
                    >
                        {label}
                    </Typography>
                    <Typography variant="caption" color="black" align="center">
                        {value}/{maxValue}
                    </Typography>
                </Box>
            </Box>
        );
    };

    return (
        <>
            {isLoading ? (
                <>
                    <Paper
                        elevation={3}
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            mb: 2,
                            p: 1,
                            width: "95%",
                        }}
                    >
                        <Alert
                            severity="info"
                            icon={<CircularProgress color="inherit" size={24}/>}
                            sx={{width: "100%"}}
                        >
                            Cargando...
                        </Alert>
                    </Paper>
                </>
            ) : (
                <>
                    {evaluacion ? (
                        <>
                            <Dialog
                                open={openDialog}
                                onClose={handleCloseDialog}
                                aria-labelledby="alert-dialog-title"
                                aria-describedby="alert-dialog-description"
                            >
                                <DialogTitle id="alert-dialog-title">
                                    {"¿Desea eliminar esta auditoría realizada?"}
                                </DialogTitle>
                                <DialogContent>
                                    <DialogContentText id="alert-dialog-description">
                                        Esta auditoría <b>({evaluacion.descripcion})</b> realizada el día
                                        <b>{stringToLocalDateTime(auditoriaRealizada.fecha)}</b>,
                                        no está sincronizada con el servidor y será eliminada de forma permanente,
                                        lo que implicará que no podrá ser recuperada.
                                        <br/>
                                        <br/>
                                        ¿Desea continuar?
                                    </DialogContentText>
                                </DialogContent>
                                <DialogActions>
                                    <Button onClick={handleCloseDialog}>Cancelar</Button>
                                    <Button onClick={() => deleteAuditoriaRealizada(auditoriaRealizada.uuid)}>
                                        Continuar
                                    </Button>
                                </DialogActions>
                            </Dialog>
                            <Card
                                raised={true}
                                elevation={3}
                                sx={{
                                    mb: 2,
                                    width: "98%",
                                    overflow: "visible",
                                }}
                            >
                                <CardContent sx={{py: 1}}>
                                    <Typography variant="body2" color="text.secondary" sx={{mb: 1}}>
                                        <b>Fecha de realización: </b>
                                        {stringToLocalDateTime(auditoriaRealizada.fecha)}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{mb: 1}}>
                                        <b>Aplicada por: </b>
                                        {auditoriaRealizada.realizador}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{mb: 1}}>
                                        <b>ID: </b>
                                        {auditoriaRealizada.uuid}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{mb: 1}}>
                                        <b>Descripción: </b>
                                        {evaluacion.descripcion}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{mb: 1}}>
                                        <b>Tipo: </b>
                                        {evaluacion.tipo}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{mb: 1}}>
                                        <b>Categoría: </b>
                                        {evaluacion.categoria || "N/A"}
                                    </Typography>
                                    <Typography variant="body2" color="text.secondary" sx={{mb: 1}}>
                                        <b>Subárea: </b>
                                        {auditoriaRealizada.subarea || "N/A"}
                                    </Typography>
                                    {nRespuestasNA > 0 && (
                                        <Alert
                                            severity="warning"
                                            sx={{
                                                my: 2
                                            }}
                                        >
                                            <b>Nota:</b> La auditoría contiene preguntas con la respuesta "No aplica"
                                            ({nRespuestasNA}).
                                            <Divider
                                                sx={{
                                                    my: 1,
                                                    opacity: 0.5,
                                                }}
                                            />
                                            Estas preguntas no se consideran para el cálculo de cumplimiento.
                                        </Alert>
                                    )}
                                    <Stack
                                        direction="row"
                                        divider={<Divider orientation="vertical" flexItem/>}
                                        spacing={2}
                                        sx={{
                                            display: "flex",
                                            justifyContent: "space-around",
                                            p: 2,
                                        }}
                                    >
                                        <CircularProgressWithLabel
                                            label="Cumple"
                                            value={nRespuestasSi}
                                            maxValue={nPreguntas - nRespuestasNA}
                                            color="success"
                                        />
                                        <CircularProgressWithLabel
                                            label="No cumple"
                                            value={nRespuestasNo}
                                            maxValue={nPreguntas - nRespuestasNA}
                                            color="error"
                                        />
                                        <CircularProgressWithLabel
                                            label="Corrección"
                                            value={nRespuestasNC}
                                            maxValue={nPreguntas - nRespuestasNA}
                                            color="warning"
                                        />
                                    </Stack>
                                </CardContent>
                                <CardActions
                                    sx={{
                                        display: "flex",
                                        justifyContent: "space-around",
                                    }}
                                >
                                    {!sync && (
                                        <Button
                                            size="small"
                                            variant="contained"
                                            color="error"
                                            alt="Eliminar"
                                            startIcon={<DeleteIcon/>}
                                            onClick={handleOpenDialog}
                                        >
                                            Eliminar
                                        </Button>
                                    )}
                                    {syncing ? (
                                        <CircularProgress size={24}/>
                                    ) : (
                                        <>
                                            {sync ? (
                                                <Button
                                                    size="small"
                                                    variant="text"
                                                    color="success"
                                                >
                                                    <CloudDoneIcon/>
                                                </Button>
                                            ) : (
                                                <Button
                                                    size="small"
                                                    variant="contained"
                                                    color="warning"
                                                    alt="Sincronizar"
                                                    startIcon={<CloudSyncIcon/>}
                                                    onClick={syncAuditoria}
                                                    disabled={!navigator.onLine}
                                                >
                                                    Sincronizar
                                                </Button>
                                            )}
                                        </>
                                    )}
                                    <Link to={`/auditoria/realizada/ver/${auditoriaRealizada.uuid}`}>
                                        <Button
                                            size="small"
                                            variant="contained"
                                            alt="Ver"
                                            startIcon={<VisibilityIcon/>}
                                            sx={{
                                                backgroundColor: "#59185E",
                                            }}
                                        >
                                            Ver
                                        </Button>
                                    </Link>
                                </CardActions>
                            </Card>
                        </>
                    ) : (
                        <>
                            <Paper
                                elevation={3}
                                sx={{
                                    display: "flex",
                                    justifyContent: "center",
                                    alignItems: "center",
                                    mb: 2,
                                    p: 1,
                                }}
                            >
                                <Alert severity="warning">
                                    La auditoría realizada <strong>ID: {auditoriaRealizada.uuid}</strong> no se
                                    encuentra en la base de datos o esta deshabilitada
                                    <br/>
                                    <em>
                                        <strong>Servidor: </strong>
                                        {storageConfig.serverUrl}
                                    </em>
                                </Alert>
                            </Paper>
                        </>
                    )}
                </>
            )}
        </>
    );
}
