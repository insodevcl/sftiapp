import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { toast } from "react-hot-toast";
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
} from "@mui/material";
import CloudDoneIcon from "@mui/icons-material/CloudDone";
import CloudSyncIcon from "@mui/icons-material/CloudSync";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import { getStorageConfig, getStorageData } from "../functions/functions";
import { apiSetAuditoria } from "../functions/api";

export function AuditoriaRealizadaCard({
    auditoriaRealizada,
    setAuditoriasRealizadas,
}) {
    const storageConfig = getStorageConfig();
    const storageData = getStorageData();
    const [auditoria, setAuditoria] = useState(undefined);
    const [subarea, setSubarea] = useState(undefined);
    const [openDialog, setOpenDialog] = useState(false);
    const [sync, setSync] = useState(false);
    const [syncing, setSyncing] = useState(false);
    const [nPreguntas, setNPreguntas] = useState(0);
    const [nRespuestasSi, setNRespuestasSi] = useState(0);
    const [nRespuestasNo, setNRespuestasNo] = useState(0);
    const [nRespuestasNC, setNRespuestasNC] = useState(0);
    const [nRespuestasNA, setNRespuestasNA] = useState(0);

    useEffect(() => {
        setSync(auditoriaRealizada.sync);
        const auditoria = storageData.auditorias.find(
            (x) => x.id === auditoriaRealizada.auditoria_id
        );
        setAuditoria(auditoria);
        storageData.areas.map((area) => {
            const subarea = area.subareas.find(
                (x) => x.id === auditoriaRealizada.subarea_id
            );
            if (subarea) {
                setSubarea(subarea);
            }
        });
        // const realizador = storageData.usuarios.find(
        //     (x) => x.id === auditoriaRealizada.realizador_id
        // );
        if (navigator.onLine) {
            if (!auditoriaRealizada.sync) {
                syncAuditoria();
            }
        }
    }, []);

    useEffect(() => {
        countPreguntas();
        countRespuestasSi();
        countRespuestasNo();
        countRespuestasNC();
        countRespuestasNA();
    }, [auditoria, subarea]);

    const countPreguntas = () => {
        let n = 0;
        auditoria?.grupos?.map((grupo) => {
            grupo.preguntas.map((pregunta) => {
                if (pregunta.tipo_id === 2) {
                    n++;
                }
            });
        });
        setNPreguntas(n);
    };

    const countRespuestasSi = () => {
        const respuestas = auditoriaRealizada.respuestas.filter(
            (x) => x.respuesta === 1
        );
        setNRespuestasSi(respuestas.length);
    };

    const countRespuestasNo = () => {
        const respuestas = auditoriaRealizada.respuestas.filter(
            (x) => x.respuesta === 2
        );
        setNRespuestasNo(respuestas.length);
    };

    const countRespuestasNC = () => {
        const respuestas = auditoriaRealizada.respuestas.filter(
            (x) => x.respuesta === 3
        );
        setNRespuestasNC(respuestas.length);
    };

    const countRespuestasNA = () => {
        const respuestas = auditoriaRealizada.respuestas.filter(
            (x) => x.respuesta === 0
        );
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
        apiSetAuditoria(storageConfig.server, auditoriaRealizada)
            .then((response) => {
                if (response.status === 200) {
                    setSync(true);
                }
                setSyncing(false);
            })
            .catch((error) => {
                console.log(error);
                toast.error(`Error al sincronizar auditoria ID: ${auditoriaRealizada.id} ${error}`);
                setSyncing(false);
            });
    };

    const deleteAuditoriaRealizada = (id) => {
        console.log("delete: " + id);
        const realizadas = JSON.parse(localStorage.getItem("auditorias"));
        const index = realizadas.findIndex((x) => x.id === id);
        realizadas.splice(index, 1);
        localStorage.setItem("auditorias", JSON.stringify(realizadas));
        setAuditoriasRealizadas(realizadas);
        handleCloseDialog();
    };

    const stringToDatetime = (string) => {
        const date = new Date(string);
        return date.toLocaleString();
    };

    const CircularProgressWithLabel = ({ label, value, maxValue, color }) => {
        return (
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                <Box sx={{ position: "relative", display: "inline-flex" }}>
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
                        <Typography
                            variant="caption"
                            component="div"
                            color="black"
                        >
                            {`${Math.round((value / maxValue) * 100)}%`}
                        </Typography>
                    </Box>
                </Box>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "top",
                        alignItems: "center",
                        pt: 1,
                    }}
                >
                    <Typography variant="caption" component="div" color="black">
                        {label}
                    </Typography>
                    <Typography variant="caption" component="div" color="black">
                        {value}/{maxValue}
                    </Typography>
                </Box>
            </Box>
        );
    };

    return (
        <>
            {auditoria && subarea ? (
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
                                Esta auditoría <b>({auditoria?.nombre})</b>{" "}
                                realizada el día{" "}
                                <b>
                                    {stringToDatetime(auditoriaRealizada.fecha)}
                                </b>
                                , no está sincronizada con el servidor y será
                                eliminada de forma permanente
                                <br />
                                <br />
                                ¿Desea continuar?
                            </DialogContentText>
                        </DialogContent>
                        <DialogActions>
                            <Button onClick={handleCloseDialog}>
                                Cancelar
                            </Button>
                            <Button
                                onClick={() =>
                                    deleteAuditoriaRealizada(
                                        auditoriaRealizada.id
                                    )
                                }
                            >
                                Continuar
                            </Button>
                        </DialogActions>
                    </Dialog>
                    <Card
                        raised={true}
                        elevation={3}
                        sx={{ mb: 2, width: "98%", overflow: "visible" }}
                    >
                        <CardHeader title={auditoria.nombre} sx={{ py: 1 }} />
                        <CardContent sx={{ py: 1 }}>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mb: 1 }}
                            >
                                <b>Fecha de realización: </b>
                                {stringToDatetime(auditoriaRealizada.fecha)}
                            </Typography>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mb: 1 }}
                            >
                                <b>Descripción: </b>
                                {auditoria.descripcion}
                            </Typography>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mb: 1 }}
                            >
                                <b>Tipo: </b>
                                {auditoria.tipo}
                            </Typography>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mb: 1 }}
                            >
                                <b>Categoría: </b>
                                {auditoria.categoria
                                    ? auditoria.categoria
                                    : "N/A"}
                            </Typography>
                            <Typography
                                variant="body2"
                                color="text.secondary"
                                sx={{ mb: 1 }}
                            >
                                <b>Subárea: </b>
                                {subarea ? subarea.nombre : "N/A"}
                            </Typography>
                            <Stack
                                direction="row"
                                divider={
                                    <Divider orientation="vertical" flexItem />
                                }
                                spacing={2}
                                sx={{
                                    display: "flex",
                                    justifyContent: "space-around",
                                    p: 2,
                                }}
                            >
                                <CircularProgressWithLabel
                                    label="Si"
                                    value={nRespuestasSi}
                                    maxValue={nPreguntas - nRespuestasNA}
                                    color="success"
                                />
                                <CircularProgressWithLabel
                                    label="No"
                                    value={nRespuestasNo}
                                    maxValue={nPreguntas - nRespuestasNA}
                                    color="error"
                                />
                                <CircularProgressWithLabel
                                    label="N/C"
                                    value={nRespuestasNC}
                                    maxValue={nPreguntas - nRespuestasNA}
                                    color="warning"
                                />
                                <CircularProgressWithLabel
                                    label="N/A"
                                    value={nRespuestasNA}
                                    maxValue={nPreguntas}
                                    color="info"
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
                                    startIcon={<DeleteIcon />}
                                    onClick={handleOpenDialog}
                                >
                                    Eliminar
                                </Button>
                            )}
                            {syncing ? (
                                <CircularProgress size={24} />
                            ) : (
                                <>
                                    {sync ? (
                                        <Button
                                            size="small"
                                            variant="contained"
                                            disabled={true}
                                            color="success"
                                        >
                                            <CloudDoneIcon />
                                        </Button>
                                    ) : (
                                        <Button
                                            size="small"
                                            variant="contained"
                                            color="warning"
                                            alt="Sincronizar"
                                            startIcon={<CloudSyncIcon />}
                                            onClick={syncAuditoria}
                                        >
                                            Sincronizar
                                        </Button>
                                    )}
                                </>
                            )}
                            <Link
                                to={`/auditoria/ver/${auditoriaRealizada.id}`}
                            >
                                <Button
                                    size="small"
                                    variant="contained"
                                    alt="Ver"
                                    startIcon={<VisibilityIcon />}
                                    sx={{
                                        bgcolor: "#59185E",
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
                    <p>Cargando...</p>
                </>
            )}
        </>
    );
}
