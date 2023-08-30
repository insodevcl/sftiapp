import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-toastify";
import {
    Backdrop,
    CircularProgress,
    Box,
    Container,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Button,
    TextField,
    InputLabel,
    Select,
    ListSubheader,
    Autocomplete,
    MenuItem,
    Alert,
    Divider,
    ButtonGroup,
    Paper,
} from "@mui/material";
import { LoadingButton } from "@mui/lab";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CancelIcon from "@mui/icons-material/Cancel";
import SaveIcon from "@mui/icons-material/Save";
import {
    getStorageConfig,
    getStorageData,
    updateSyncAuditoria,
} from "../functions/functions";
import { Pregunta } from "../components/Pregunta";
import { Tarea } from "../components/Tarea";
import { apiAuditoria } from "../functions/api";

export function NewAuditoriaPage() {
    const { id } = useParams();
    const [auditoria, setAuditoria] = useState({});
    const [respuestas, setRespuestas] = useState([]);
    const [tareas, setTareas] = useState([]);
    const [openLoading, setOpenLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const navigate = useNavigate();
    const storageConfig = getStorageConfig();
    const storageData = getStorageData();
    const [nPreguntas, setNPreguntas] = useState(0);
    const [nRespuestas, setNRespuestas] = useState(0);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        document.title = "Nueva Auditoría";
        window.scrollTo(0, 0);
        setAuditoria(storageData.auditorias.find((x) => x.id === parseInt(id)));
        setTimeout(() => {
            setOpenLoading(false);
        }, 3000);
    }, []);

    useEffect(() => {
        countPreguntas();
    }, [auditoria]);

    useEffect(() => {
        if (nPreguntas === 0) return;
        if (nPreguntas < 25) {
            setOpenLoading(false);
        } else {
            setOpenLoading(true);
        }
    }, [nPreguntas]);

    useEffect(() => {
        setNRespuestas(countRespuestas());
    }, [respuestas]);

    const countPreguntas = () => {
        let n = 0;
        auditoria?.grupos?.map((grupo) => {
            grupo.preguntas.map((pregunta) => {
                if (pregunta.tipo_id === 2) {
                    n++;
                }
                return null;
            });
            return null;
        });
        setNPreguntas(n);
    };

    const countRespuestas = () => {
        return respuestas.filter((x) => x.respuesta !== null).length;
    };

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const onSubmit = handleSubmit((data) => {
        setSubmitting(true);
        if (nPreguntas !== nRespuestas) {
            setTimeout(() => {
                setSubmitting(false);
            }, 1000);
            return toast.warning(
                "Por favor, responda todas las preguntas antes de continuar"
            );
        }
        data["id"] = JSON.parse(localStorage.getItem("auditorias")).length + 1;
        data["fecha"] = new Date().toJSON();
        data["user_id"] = storageConfig.userID;
        data["empresa_id"] = storageConfig.empresaID;
        data["respuestas"] = respuestas;
        data["tareas"] = tareas;
        data["auditoria_id"] = auditoria.id;
        data["sync"] = false;
        const realizadas = JSON.parse(localStorage.getItem("auditorias"));
        realizadas.push(data);
        localStorage.setItem("auditorias", JSON.stringify(realizadas));
        toast.success("Auditoría guardada");
        if (navigator.onLine) {
            return syncAuditoria(data);
        } else {
            return navigate("/");
        }
    });

    const syncAuditoria = async (data) => {
        setOpenLoading(true);
        await apiAuditoria(storageConfig.server, data).then((response) => {
            if (response.status === 200) {
                updateSyncAuditoria(data.id);
            }
        });
        setTimeout(() => {
            setOpenLoading(false);
            return navigate("/");
        }, 1000);
    };

    const getPregunta = (id) => {
        const pregunta_id = id;
        let pregunta = { pregunta: "" };
        auditoria.grupos.map((grupo) => {
            if (grupo.preguntas.find((x) => x.id === pregunta_id)) {
                pregunta = grupo.preguntas.find((x) => x.id === pregunta_id);
            }
            return null;
        });
        return pregunta.pregunta;
    };

    // const getReference = (id) => {
    //     const pregunta_id = id;
    //     let pregunta = { referencia: "" };
    //     auditoria.grupos.map((grupo) => {
    //         if (grupo.preguntas.find((x) => x.id === pregunta_id)) {
    //             pregunta = grupo.preguntas.find((x) => x.id === pregunta_id);
    //         }
    //         return null;
    //     });
    //     return pregunta.referencia;
    // };

    const getRespuesta = (id) => {
        const r = respuestas.find((x) => x.id === id);
        if (r) {
            return r.respuesta;
        } else {
            return 0;
        }
    };

    const updateRespuestas = (id, respuesta) => {
        const index = respuestas.findIndex((x) => x.id === id);
        if (index > -1) {
            respuestas[index].respuesta = respuesta;
            setRespuestas([...respuestas]);
        } else {
            setRespuestas([
                ...respuestas,
                {
                    id: id,
                    respuesta: respuesta,
                    observacion: "",
                },
            ]);
        }
    };

    const updateObservacion = (id, observacion) => {
        const index = respuestas.findIndex((x) => x.id === id);
        if (index > -1) {
            respuestas[index].observacion = observacion;
            setRespuestas([...respuestas]);
        }
    };

    const removeObservacion = (id) => {
        const index = respuestas.findIndex((x) => x.id === id);
        if (index > -1) {
            respuestas[index].observacion = "";
            setRespuestas([...respuestas]);
        }
    };

    const updateTareas = (
        id,
        tarea,
        descripcion,
        supervisor_id,
        responsable_id,
        criticidad_id,
        fecha_cierre
    ) => {
        const index = tareas.findIndex((x) => x.id === id);
        if (index > -1) {
            tareas[index].tarea = tarea;
            tareas[index].descripcion = descripcion;
            tareas[index].supervisor_id = parseInt(supervisor_id);
            tareas[index].responsable_id = parseInt(responsable_id);
            tareas[index].criticidad_id = parseInt(criticidad_id);
            tareas[index].fecha_cierre = fecha_cierre;
            setTareas([...tareas]);
        } else {
            setTareas([
                ...tareas,
                {
                    id: id,
                    tarea: tarea,
                    descripcion: descripcion,
                    supervisor_id: parseInt(supervisor_id),
                    responsable_id: parseInt(responsable_id),
                    criticidad_id: parseInt(criticidad_id),
                    fecha_cierre: fecha_cierre,
                },
            ]);
        }
    };

    const removeTarea = (id) => {
        const index = tareas.findIndex((x) => x.id === id);
        if (index > -1) {
            tareas.splice(index, 1);
            setTareas([...tareas]);
        }
    };

    const handleOption = (event, respuesta) => {
        const id = parseInt(event.target.parentNode.dataset.id);
        updateRespuestas(id, respuesta);
        switch (respuesta) {
            case 1:
                removeObservacion(id);
                removeTarea(id);
                break;
            case 2:
                updateObservacion(id, "");
                updateTareas(id, "", "", null, null, null, "");
                break;
            case 3:
                updateObservacion(id, "");
                removeTarea(id);
                break;
            case 0:
                updateObservacion(id, "");
                removeTarea(id);
                break;
            default:
                removeObservacion(id);
                removeTarea(id);
                break;
        }
    };

    const handleObservacion = (event) => {
        const pregunta_id = parseInt(event.target.dataset.id);
        const observacion = event.target.value;
        updateObservacion(pregunta_id, observacion);
    };

    const renderSelectHerramienta = (tipo) => {
        if (tipo.herramientas.length > 0) {
            const items = tipo.herramientas.map((herramienta) => {
                return (
                    <MenuItem
                        value={herramienta.id}
                        key={herramienta.id}
                        divider={true}
                        sx={{
                            pl: 4,
                            whiteSpace: "normal",
                        }}
                    >
                        {herramienta.nombre}
                    </MenuItem>
                );
            });
            return [
                <ListSubheader
                    key={tipo.id}
                    sx={{
                        fontWeight: "bold",
                        backgroundColor: "background.main",
                    }}
                >
                    {tipo.nombre}
                </ListSubheader>,
                ...items,
            ];
        } else {
            return null;
        }
    };

    const renderSelectEquipo = (tipo) => {
        if (tipo.equipos.length > 0) {
            const items = tipo.equipos.map((equipo) => {
                return (
                    <MenuItem
                        value={equipo.id}
                        key={equipo.id}
                        divider={true}
                        sx={{
                            pl: 4,
                            whiteSpace: "normal",
                        }}
                    >
                        {equipo.nombre}
                    </MenuItem>
                );
            });
            return [
                <ListSubheader
                    key={tipo.id}
                    sx={{
                        fontWeight: "bold",
                        backgroundColor: "background.main",
                    }}
                >
                    {tipo.nombre}
                </ListSubheader>,
                ...items,
            ];
        } else {
            return null;
        }
    };

    const renderSelectMaquinaria = (tipo) => {
        if (tipo.maquinarias.length > 0) {
            const items = tipo.maquinarias.map((maquinaria) => {
                return (
                    <MenuItem
                        value={maquinaria.id}
                        key={maquinaria.id}
                        divider={true}
                        sx={{
                            pl: 4,
                            whiteSpace: "normal",
                        }}
                    >
                        {maquinaria.nombre}
                    </MenuItem>
                );
            });
            return [
                <ListSubheader
                    key={tipo.id}
                    sx={{
                        fontWeight: "bold",
                        backgroundColor: "background.main",
                    }}
                >
                    {tipo.nombre}
                </ListSubheader>,
                ...items,
            ];
        } else {
            return null;
        }
    };

    const renderSelectTransporte = (tipo) => {
        if (tipo.transportes.length > 0) {
            const items = tipo.transportes.map((transporte) => {
                return (
                    <MenuItem
                        value={transporte.id}
                        key={transporte.id}
                        divider={true}
                        sx={{
                            pl: 4,
                            whiteSpace: "normal",
                        }}
                    >
                        {transporte.nombre}
                    </MenuItem>
                );
            });
            return [
                <ListSubheader
                    key={tipo.id}
                    sx={{
                        fontWeight: "bold",
                        backgroundColor: "background.main",
                    }}
                >
                    {tipo.nombre}
                </ListSubheader>,
                ...items,
            ];
        } else {
            return null;
        }
    };

    const renderSelectEquipoEmergencia = (tipo) => {
        return null;
    };

    const renderSubarea = (area) => {
        if (area.subareas.length > 0) {
            const items = area.subareas.map((subarea) => {
                return (
                    <MenuItem
                        value={subarea.id}
                        key={subarea.id}
                        divider={true}
                        sx={{
                            pl: 4,
                            whiteSpace: "normal",
                        }}
                    >
                        {subarea.nombre}
                    </MenuItem>
                );
            });
            return [
                <ListSubheader
                    key={area.id}
                    sx={{
                        fontWeight: "bold",
                        backgroundColor: "background.main",
                    }}
                >
                    {area.nombre}
                </ListSubheader>,
                ...items,
            ];
        } else {
            return null;
        }
    };

    const renderOperador = () => {
        return (
            <>
                <InputLabel id="id_label_operador">Operador</InputLabel>
                <Select
                    labelId="id_label_operador"
                    name="operador"
                    fullWidth
                    defaultValue={""}
                    sx={{ mb: 2 }}
                    {...register("operador_id", {
                        required: true,
                    })}
                >
                    <MenuItem value="">Seleccione un operador</MenuItem>
                    {storageData.operadores.map((operador) => (
                        <MenuItem
                            value={operador.id}
                            key={operador.id}
                            divider={true}
                            sx={{
                                whiteSpace: "normal",
                            }}
                        >
                            {operador.nombre}
                        </MenuItem>
                    ))}
                </Select>
                {errors.operador && (
                    <Alert severity="error">Este campo es requerido</Alert>
                )}
            </>
        );
    };

    const renderObservacion = (respuesta) => {
        return (
            <Container
                key={respuesta.id}
                sx={{
                    mb: 2,
                    p: 2,
                    backgroundColor: "white",
                    borderBottomLeftRadius: 2,
                    borderBottomRightRadius: 2,
                }}
            >
                <Typography variant="body2" sx={{ mb: 2 }}>
                    <b>Cumplimiento:</b>{" "}
                    {getRespuesta(respuesta.id) === 2 && `No cumple`}
                    {getRespuesta(respuesta.id) === 3 && `Corrección`}
                    {getRespuesta(respuesta.id) === 0 && `No Aplica`}
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                    <b>Descripción:</b> {getPregunta(respuesta.id)}
                </Typography>
                <TextField
                    label="Observación"
                    multiline
                    rows={4}
                    fullWidth
                    onChange={handleObservacion}
                    inputProps={{
                        "data-id": respuesta.id,
                    }}
                    sx={{ mb: 2 }}
                ></TextField>
                <Divider />
            </Container>
        );
    };

    return (
        <>
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
                            onClick={handleOpenDialog}
                            sx={{ mr: 2 }}
                        >
                            <ArrowBackIcon />
                        </IconButton>
                        <Typography
                            variant="h6"
                            component="div"
                            sx={{ flexGrow: 1 }}
                        >
                            Nueva auditoría
                        </Typography>
                    </Toolbar>
                </AppBar>
                <Dialog
                    open={openDialog}
                    onClose={handleCloseDialog}
                    aria-labelledby="alert-dialog-title"
                    aria-describedby="alert-dialog-description"
                >
                    <DialogTitle id="alert-dialog-title">
                        {"¿Desea terminar la auditoría?"}
                    </DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Los cambios no guardados se perderán.
                            <br />
                            <br />
                            ¿Desea continuar?
                        </DialogContentText>
                    </DialogContent>
                    <DialogActions>
                        <Button onClick={handleCloseDialog}>Cancelar</Button>
                        <Button
                            onClick={() => {
                                navigate(-1);
                            }}
                        >
                            Continuar
                        </Button>
                    </DialogActions>
                </Dialog>
                <Box
                    sx={{
                        display: "flex",
                        flexDirection: "column",
                        justifyContent: "start",
                        alignItems: "center",
                        py: 8,
                        px: 2,
                        backgroundColor: "background.main",
                    }}
                >
                    <form onSubmit={onSubmit} style={{ width: "100%" }}>
                        <Paper
                            elevation={3}
                            sx={{
                                backgroundColor: "white",
                                mb: 2,
                            }}
                        >
                            <Container
                                sx={{
                                    textAlign: "center",
                                    p: 2,
                                    backgroundColor: "background.primary",
                                    borderTopLeftRadius: 4,
                                    borderTopRightRadius: 4,
                                }}
                            >
                                <Typography
                                    variant="h6"
                                    component="div"
                                    sx={{ color: "white" }}
                                >
                                    <b>{auditoria.nombre}</b>
                                </Typography>
                            </Container>
                            <Container
                                sx={{
                                    p: 2,
                                }}
                            >
                                {auditoria.tipo_id === 2 &&
                                    auditoria.categoria_id === 1 && (
                                        <>
                                            <InputLabel id="id_label_trabajador">
                                                Trabajador
                                            </InputLabel>
                                            <Select
                                                labelId="id_label_trabajador"
                                                name="trabajador"
                                                required
                                                fullWidth
                                                defaultValue={""}
                                                sx={{ mb: 2 }}
                                                {...register("trabajador_id", {
                                                    required: true,
                                                })}
                                            >
                                                <MenuItem value="">
                                                    Seleccione un trabajador
                                                </MenuItem>
                                                {storageData.trabajadores.map(
                                                    (trabajador) => (
                                                        <MenuItem
                                                            value={
                                                                trabajador.id
                                                            }
                                                            key={trabajador.id}
                                                            divider={true}
                                                            sx={{
                                                                whiteSpace:
                                                                    "normal",
                                                            }}
                                                        >
                                                            {trabajador.nombre}
                                                        </MenuItem>
                                                    )
                                                )}
                                            </Select>
                                        </>
                                    )}
                                {auditoria.tipo_id === 2 &&
                                    auditoria.categoria_id === 2 && (
                                        <>
                                            <InputLabel id="id_label_maquinaria">
                                                Maquinaria
                                            </InputLabel>
                                            <Select
                                                labelId="id_label_maquinaria"
                                                name="maquinaria"
                                                required
                                                fullWidth
                                                defaultValue={""}
                                                sx={{ mb: 2 }}
                                                {...register("maquinaria_id", {
                                                    required: true,
                                                })}
                                            >
                                                <MenuItem value="">
                                                    Seleccione una maquinaria
                                                </MenuItem>
                                                {storageData.maquinarias.map(
                                                    (tipo) =>
                                                        renderSelectMaquinaria(
                                                            tipo
                                                        )
                                                )}
                                            </Select>
                                            {renderOperador()}
                                        </>
                                    )}
                                {auditoria.tipo_id === 2 &&
                                    auditoria.categoria_id === 3 && (
                                        <>
                                            <InputLabel id="id_label_herramienta">
                                                Herramienta
                                            </InputLabel>
                                            <Select
                                                labelId="id_label_herramienta"
                                                name="herramienta"
                                                required
                                                fullWidth
                                                defaultValue={""}
                                                sx={{ mb: 2 }}
                                                {...register("herramienta_id", {
                                                    required: true,
                                                })}
                                            >
                                                <MenuItem value="">
                                                    Seleccione una herramienta
                                                </MenuItem>
                                                {storageData.herramientas.map(
                                                    (tipo) =>
                                                        renderSelectHerramienta(
                                                            tipo
                                                        )
                                                )}
                                            </Select>
                                            {renderOperador()}
                                        </>
                                    )}
                                {auditoria.tipo_id === 2 &&
                                    auditoria.categoria_id === 4 && (
                                        <>
                                            <InputLabel id="id_label_equipo">
                                                Equipo
                                            </InputLabel>
                                            <Select
                                                labelId="id_label_equipo"
                                                name="equipo"
                                                required
                                                fullWidth
                                                defaultValue={""}
                                                sx={{ mb: 2 }}
                                                {...register("equipo_id", {
                                                    required: true,
                                                })}
                                            >
                                                <MenuItem value="">
                                                    Seleccione un equipo
                                                </MenuItem>
                                                {storageData.equipos.map(
                                                    (tipo) =>
                                                        renderSelectEquipo(tipo)
                                                )}
                                            </Select>
                                            {renderOperador()}
                                        </>
                                    )}
                                {auditoria.tipo_id === 2 &&
                                    auditoria.categoria_id === 5 && (
                                        <>
                                            <InputLabel id="id_label_instalacion">
                                                Instalación
                                            </InputLabel>
                                            <Select
                                                labelId="id_label_instalacion"
                                                name="instalacion"
                                                required
                                                fullWidth
                                                defaultValue={""}
                                                sx={{ mb: 2 }}
                                                {...register("instalacion_id", {
                                                    required: true,
                                                })}
                                            >
                                                <MenuItem value="">
                                                    Seleccione una instalación
                                                </MenuItem>
                                                {storageData.instalaciones.map(
                                                    (instalacion) => (
                                                        <MenuItem
                                                            value={
                                                                instalacion.id
                                                            }
                                                            key={instalacion.id}
                                                            divider={true}
                                                            sx={{
                                                                whiteSpace:
                                                                    "normal",
                                                            }}
                                                        >
                                                            {instalacion.nombre}
                                                        </MenuItem>
                                                    )
                                                )}
                                            </Select>
                                        </>
                                    )}
                                {auditoria.tipo_id === 2 &&
                                    auditoria.categoria_id === 6 && (
                                        <>
                                            <InputLabel id="id_label_transporte">
                                                Transporte
                                            </InputLabel>
                                            <Select
                                                labelId="id_label_transporte"
                                                name="transporte"
                                                required
                                                fullWidth
                                                defaultValue={""}
                                                sx={{ mb: 2 }}
                                                {...register("transporte_id", {
                                                    required: true,
                                                })}
                                            >
                                                <MenuItem value="">
                                                    Seleccione un transporte
                                                </MenuItem>
                                                {storageData.transportes.map(
                                                    (tipo) =>
                                                        renderSelectTransporte(
                                                            tipo
                                                        )
                                                )}
                                            </Select>
                                            {renderOperador()}
                                        </>
                                    )}
                                {auditoria.tipo_id === 2 &&
                                    auditoria.categoria_id === 7 && (
                                        <>
                                            <InputLabel id="id_label_equipo_emergencia">
                                                Equipo de emergencia
                                            </InputLabel>
                                            <Select
                                                labelId="id_label_equipo_emergencia"
                                                name="equipo_emergencia"
                                                required
                                                fullWidth
                                                defaultValue={""}
                                                sx={{ mb: 2 }}
                                                {...register(
                                                    "equipo_emergencia_id",
                                                    {
                                                        required: true,
                                                    }
                                                )}
                                            >
                                                <MenuItem value="">
                                                    Seleccione un equipo de
                                                    emergencia
                                                </MenuItem>
                                                {storageData.equipos_emergencia.map(
                                                    (equipo_emergencia) =>
                                                        renderSelectEquipoEmergencia(
                                                            equipo_emergencia
                                                        )
                                                )}
                                            </Select>
                                        </>
                                    )}
                                {auditoria.tipo_id === 3 && (
                                    <>
                                        <InputLabel id="id_label_sucursal">
                                            Sucursal
                                        </InputLabel>
                                        <Select
                                            labelId="id_label_sucursal"
                                            name="sucursal"
                                            required
                                            fullWidth
                                            defaultValue={""}
                                            sx={{ mb: 2 }}
                                            {...register("sucursal_id", {
                                                required: true,
                                            })}
                                        >
                                            <MenuItem value="">
                                                Seleccione una sucursal
                                            </MenuItem>
                                            {storageData.sucursales.map(
                                                (sucursal) => (
                                                    <MenuItem
                                                        value={sucursal.id}
                                                        key={sucursal.id}
                                                        divider={true}
                                                        sx={{
                                                            whiteSpace:
                                                                "normal",
                                                        }}
                                                    >
                                                        {sucursal.nombre}
                                                    </MenuItem>
                                                )
                                            )}
                                        </Select>
                                    </>
                                )}
                                {auditoria.tipo_id === 4 && (
                                    <>
                                        <InputLabel id="id_label_faena">
                                            Faena
                                        </InputLabel>
                                        <Select
                                            labelId="id_label_faena"
                                            name="faena"
                                            required
                                            fullWidth
                                            defaultValue={""}
                                            sx={{ mb: 2 }}
                                            {...register("faena_id", {
                                                required: true,
                                            })}
                                        >
                                            <MenuItem value="">
                                                Seleccione una faena
                                            </MenuItem>
                                            {storageData.faenas.map((faena) => (
                                                <MenuItem
                                                    value={faena.id}
                                                    key={faena.id}
                                                    divider={true}
                                                    sx={{
                                                        whiteSpace: "normal",
                                                    }}
                                                >
                                                    {faena.nombre}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </>
                                )}
                                {auditoria.tipo_id === 5 && (
                                    <>
                                        <InputLabel id="id_label_contratista">
                                            Contratista
                                        </InputLabel>
                                        <Select
                                            labelId="id_label_contratista"
                                            name="contratista"
                                            required
                                            fullWidth
                                            defaultValue={""}
                                            sx={{ mb: 2 }}
                                            {...register("contratista_id", {
                                                required: true,
                                            })}
                                        >
                                            <MenuItem value="">
                                                Seleccione un contratista
                                            </MenuItem>
                                            {storageData.contratistas.map(
                                                (contratista) => (
                                                    <MenuItem
                                                        value={contratista.id}
                                                        key={contratista.id}
                                                        divider={true}
                                                        sx={{
                                                            whiteSpace:
                                                                "normal",
                                                        }}
                                                    >
                                                        {contratista.nombre}
                                                    </MenuItem>
                                                )
                                            )}
                                        </Select>
                                        <InputLabel id="id_label_sucursal">
                                            Sucursal (opcional)
                                        </InputLabel>
                                        <Select
                                            labelId="id_label_sucursal"
                                            name="sucursal"
                                            fullWidth
                                            defaultValue={""}
                                            sx={{ mb: 2 }}
                                            {...register("sucursal_id")}
                                        >
                                            <MenuItem value="">
                                                Seleccione una sucursal
                                            </MenuItem>
                                            {storageData.sucursales.map(
                                                (sucursal) => (
                                                    <MenuItem
                                                        value={sucursal.id}
                                                        key={sucursal.id}
                                                        divider={true}
                                                        sx={{
                                                            whiteSpace:
                                                                "normal",
                                                        }}
                                                    >
                                                        {sucursal.nombre}
                                                    </MenuItem>
                                                )
                                            )}
                                        </Select>
                                        <InputLabel id="id_label_faena">
                                            Faena (opcional)
                                        </InputLabel>
                                        <Select
                                            labelId="id_label_faena"
                                            name="faena"
                                            fullWidth
                                            defaultValue={""}
                                            sx={{ mb: 2 }}
                                            {...register("faena_id")}
                                        >
                                            <MenuItem value="">
                                                Seleccione una faena
                                            </MenuItem>
                                            {storageData.faenas.map((faena) => (
                                                <MenuItem
                                                    value={faena.id}
                                                    key={faena.id}
                                                    divider={true}
                                                    sx={{
                                                        whiteSpace: "normal",
                                                    }}
                                                >
                                                    {faena.nombre}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </>
                                )}
                                <InputLabel id="id_label_subarea">
                                    Subárea
                                </InputLabel>
                                <Select
                                    labelId="id_label_subarea"
                                    name="subarea"
                                    required
                                    fullWidth
                                    defaultValue={""}
                                    sx={{ mb: 2 }}
                                    {...register("subarea_id", {
                                        required: true,
                                    })}
                                >
                                    <MenuItem value="">
                                        Seleccione una subárea
                                    </MenuItem>
                                    {storageData.areas.map((area) =>
                                        renderSubarea(area)
                                    )}
                                </Select>
                                <InputLabel id="id_label_lugar">
                                    Lugar (opcional)
                                </InputLabel>
                                <Select
                                    labelId="id_label_lugar"
                                    name="lugar"
                                    fullWidth
                                    defaultValue={""}
                                    sx={{ mb: 2 }}
                                    {...register("lugar_id")}
                                >
                                    <MenuItem value="">
                                        Seleccione un lugar
                                    </MenuItem>
                                    {storageData.lugares.map((lugar) => (
                                        <MenuItem
                                            value={lugar.id}
                                            key={lugar.id}
                                            divider={true}
                                            sx={{
                                                whiteSpace: "normal",
                                            }}
                                        >
                                            {lugar.nombre}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </Container>
                        </Paper>
                        {auditoria?.grupos?.map((grupo) => (
                            <Paper
                                key={grupo.id}
                                sx={{
                                    backgroundColor: "white",
                                    mb: 2,
                                }}
                            >
                                <Container
                                    sx={{
                                        textAlign: "center",
                                        p: 2,
                                        backgroundColor: "background.primary",
                                        borderTopLeftRadius: 4,
                                        borderTopRightRadius: 4,
                                    }}
                                >
                                    <Typography
                                        variant="h6"
                                        component="div"
                                        sx={{ color: "white" }}
                                    >
                                        {grupo.nombre}
                                    </Typography>
                                </Container>
                                {grupo.preguntas.map((pregunta) => (
                                    <Pregunta
                                        pregunta={pregunta}
                                        handleOption={handleOption}
                                        key={pregunta.id}
                                    />
                                ))}
                            </Paper>
                        ))}
                        <Paper
                            elevation={3}
                            sx={{
                                backgroundColor: "white",
                                mb: 2,
                            }}
                        >
                            <Container
                                sx={{
                                    textAlign: "center",
                                    p: 2,
                                    backgroundColor: "background.primary",
                                    borderTopLeftRadius: 4,
                                    borderTopRightRadius: 4,
                                }}
                            >
                                <Typography
                                    variant="h6"
                                    component="div"
                                    sx={{ color: "white" }}
                                >
                                    <b>Observaciones</b>
                                </Typography>
                            </Container>
                            <Container
                                sx={{
                                    p: 2,
                                }}
                            >
                                <TextField
                                    label="Observaciones"
                                    multiline
                                    rows={4}
                                    fullWidth
                                    {...register("observaciones")}
                                ></TextField>
                            </Container>
                        </Paper>
                        <Paper
                            elevation={3}
                            sx={{
                                backgroundColor: "white",
                                mb: 2,
                            }}
                        >
                            <Container
                                sx={{
                                    textAlign: "center",
                                    p: 2,
                                    backgroundColor: "background.primary",
                                    borderTopLeftRadius: 4,
                                    borderTopRightRadius: 4,
                                }}
                            >
                                <Typography
                                    variant="h6"
                                    component="div"
                                    sx={{ color: "white" }}
                                >
                                    <b>Observaciones por pregunta</b>
                                </Typography>
                            </Container>
                            {respuestas.filter((x) => x.respuesta !== 1)
                                .length === 0 ? (
                                <Container
                                    sx={{
                                        textAlign: "center",
                                        p: 2,
                                    }}
                                >
                                    <Typography
                                        variant="body1"
                                        component="div"
                                        sx={{ color: "black" }}
                                    >
                                        No se registran observaciones
                                    </Typography>
                                </Container>
                            ) : (
                                <>
                                    {respuestas
                                        .filter((x) => x.respuesta !== 1)
                                        .map((respuesta) =>
                                            renderObservacion(respuesta)
                                        )}
                                </>
                            )}
                        </Paper>
                        <Paper
                            elevation={3}
                            sx={{
                                backgroundColor: "white",
                                mb: 2,
                            }}
                        >
                            <Container
                                sx={{
                                    textAlign: "center",
                                    p: 2,
                                    backgroundColor: "background.primary",
                                    borderTopLeftRadius: 4,
                                    borderTopRightRadius: 4,
                                }}
                            >
                                <Typography
                                    variant="h6"
                                    component="div"
                                    sx={{ color: "white" }}
                                >
                                    <b>Asignación de tareas</b>
                                </Typography>
                            </Container>
                            {tareas.length === 0 ? (
                                <Container
                                    sx={{
                                        textAlign: "center",
                                        p: 2,
                                    }}
                                >
                                    <Typography
                                        variant="body1"
                                        component="div"
                                        sx={{ color: "black" }}
                                    >
                                        No se registran tareas
                                    </Typography>
                                </Container>
                            ) : (
                                <>
                                    {tareas.map((tarea) => (
                                        <Tarea
                                            tarea={tarea}
                                            updateTareas={updateTareas}
                                            getPregunta={getPregunta}
                                            key={tarea.id}
                                        />
                                    ))}
                                </>
                            )}
                        </Paper>
                        <Divider />
                        <Box
                            sx={{
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                            }}
                        >
                            <ButtonGroup
                                variant="contained"
                                color="light"
                                aria-label="contained primary button group"
                                fullWidth
                                sx={{ mb: 2 }}
                            >
                                <Button
                                    type="button"
                                    alt="Cancelar"
                                    color="error"
                                    startIcon={<CancelIcon />}
                                    onClick={handleOpenDialog}
                                >
                                    Cancelar
                                </Button>
                                <LoadingButton
                                    type="submit"
                                    variant="contained"
                                    color="success"
                                    endIcon={<SaveIcon />}
                                    loading={submitting}
                                    loadingPosition="end"
                                >
                                    Guardar
                                </LoadingButton>
                            </ButtonGroup>
                        </Box>
                    </form>
                </Box>
            </Box>
            <Backdrop
                sx={{
                    color: "white",
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
                open={openLoading}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </>
    );
}
