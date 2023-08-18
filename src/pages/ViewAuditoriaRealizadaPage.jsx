import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import {
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
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CancelIcon from "@mui/icons-material/Cancel";
import SaveIcon from "@mui/icons-material/Save";
import {
    getStorageConfig,
    getStorageData,
    getStorageAuditoriasRealizadas,
} from "../functions/functions";
import { Pregunta } from "../components/Pregunta";
import { Tarea } from "../components/Tarea";

export function NewAuditoriaPage() {
    const { id } = useParams();
    const [auditoria, setAuditoria] = useState({});
    const [observaciones, setObservaciones] = useState([]);
    const [respuestas, setRespuestas] = useState([]);
    const [tareas, setTareas] = useState([]);
    const [openDialog, setOpenDialog] = useState(false);
    const [openDialog2, setOpenDialog2] = useState(false);
    const navigate = useNavigate();
    const storageConfig = getStorageConfig();
    const storageData = getStorageData();
    const storageAuditoriasRealizadas = getStorageAuditoriasRealizadas();
    const [nPreguntas, setNPreguntas] = useState(0);
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        document.title = "Nueva Auditoría";
        setAuditoria(storageData.auditorias.find((x) => x.id === parseInt(id)));
    }, []);

    useEffect(() => {
        countPreguntas();
    }, [auditoria]);

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

    const countRespuestas = () => {
        let n = 0;
        respuestas.map((respuesta) => {
            if (respuesta.respuesta !== null) {
                n++;
            }
        });
        return n;
    };

    const handleOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleOpenDialog2 = () => {
        setOpenDialog2(true);
    };

    const handleCloseDialog2 = () => {
        setOpenDialog2(false);
    };

    const onSubmit = handleSubmit((data) => {
        if (nPreguntas !== countRespuestas()) {
            return handleOpenDialog2();
        }
        data["fecha"] = new Date().toJSON();
        data["user_id"] = storageConfig.userID;
        data["empresa_id"] = storageConfig.empresaID;
        data["respuestas"] = respuestas;
        data["observaciones"] = observaciones;
        data["tareas"] = tareas;
        data["auditoria_id"] = auditoria.id;
        data["sync"] = false;
        console.log("Data", data);
        storageAuditoriasRealizadas.push(data);
        localStorage.setItem(
            "auditorias",
            JSON.stringify(storageAuditoriasRealizadas)
        );
        toast.success("Auditoría guardada");
        return navigate("/");
    });

    const getReference = (id) => {
        const pregunta_id = id;
        let pregunta = { referencia: "" };
        auditoria.grupos.map((grupo) => {
            if (grupo.preguntas.find((x) => x.id === pregunta_id)) {
                pregunta = grupo.preguntas.find((x) => x.id === pregunta_id);
            }
        });
        return pregunta.referencia;
    };

    const getRespuesta = (id) => {
        const r = respuestas.find((x) => x.id === id);
        if (r) {
            return r.respuesta;
        } else {
            return 0;
        }
    };

    const updateRespuestas = (id, respuesta) => {
        const r = respuestas.find((x) => x.id === id);
        if (r) {
            r.respuesta = respuesta;
        } else {
            setRespuestas([
                ...respuestas,
                {
                    id: id,
                    respuesta: respuesta,
                },
            ]);
        }
        console.log("Respuestas", respuestas);
    };

    const updateObservaciones = (id, observacion) => {
        const o = observaciones.find((x) => x.id === id);
        if (o) {
            o.observacion = observacion;
        } else {
            setObservaciones([
                ...observaciones,
                {
                    id: id,
                    observacion: observacion,
                },
            ]);
        }
        console.log("Observaciones", observaciones);
    };

    const removeObservacion = (id) => {
        const oIndex = observaciones.findIndex((x) => x.id === id);
        if (oIndex > -1) {
            observaciones.splice(oIndex, 1);
            setObservaciones([...observaciones]);
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
        const t = tareas.find((x) => x.id === id);
        if (t) {
            t.tarea = tarea;
            t.descripcion = descripcion;
            t.supervisor_id = parseInt(supervisor_id);
            t.responsable_id = parseInt(responsable_id);
            t.criticidad_id = parseInt(criticidad_id);
            t.fecha_cierre = fecha_cierre;
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
        console.log("Tareas", tareas);
    };

    const removeTarea = (id) => {
        const tIndex = tareas.findIndex((x) => x.id === id);
        if (tIndex > -1) {
            tareas.splice(tIndex, 1);
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
                updateObservaciones(id, "");
                updateTareas(id, "", "", null, null, null, "");
                break;
            case 3:
                removeObservacion(id);
                updateObservaciones(id, "");
                removeTarea(id);
                break;
            case 0:
                removeObservacion(id);
                updateObservaciones(id, "");
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
        updateObservaciones(pregunta_id, observacion);
    };

    const renderSelectHerramienta = (tipo) => {
        if (tipo.herramientas.length > 0) {
            const items = tipo.herramientas.map((herramienta) => {
                return (
                    <MenuItem value={herramienta.id} key={herramienta.id}>
                        {herramienta.nombre}
                    </MenuItem>
                );
            });
            return [
                <ListSubheader key={tipo.id}>{tipo.nombre}</ListSubheader>,
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
                    <MenuItem value={equipo.id} key={equipo.id}>
                        {equipo.nombre}
                    </MenuItem>
                );
            });
            return [
                <ListSubheader key={tipo.id}>{tipo.nombre}</ListSubheader>,
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
                    <MenuItem value={maquinaria.id} key={maquinaria.id}>
                        {maquinaria.nombre}
                    </MenuItem>
                );
            });
            return [
                <ListSubheader key={tipo.id}>{tipo.nombre}</ListSubheader>,
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
                    <MenuItem value={transporte.id} key={transporte.id}>
                        {transporte.nombre}
                    </MenuItem>
                );
            });
            return [
                <ListSubheader key={tipo.id}>{tipo.nombre}</ListSubheader>,
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
                    <MenuItem value={subarea.id} key={subarea.id}>
                        {subarea.nombre}
                    </MenuItem>
                );
            });
            return [
                <ListSubheader key={area.id}>{area.nombre}</ListSubheader>,
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
                    label="Operador"
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
                        <MenuItem value={operador.id} key={operador.id}>
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

    const renderObservacion = (observacion) => {
        return (
            <Container
                key={observacion.id}
                sx={{
                    mb: 2,
                    p: 2,
                    bgcolor: "white",
                    borderRadius: 2,
                }}
            >
                <Typography variant="body2" sx={{ mb: 2 }}>
                    <b>Cumplimiento:</b>{" "}
                    {getRespuesta(observacion.id) === 2 && `No cumple`}
                    {getRespuesta(observacion.id) === 3 && `Corrección`}
                    {getRespuesta(observacion.id) === 0 && `No Aplica`}
                </Typography>
                <Typography variant="body2" sx={{ mb: 2 }}>
                    <b>Descripción:</b> {getReference(observacion.id)}
                </Typography>
                <TextField
                    label="Observación"
                    multiline
                    rows={4}
                    fullWidth
                    onChange={handleObservacion}
                    inputProps={{
                        "data-id": observacion.id,
                    }}
                    sx={{ mb: 2 }}
                ></TextField>
                <Divider
                    variant="fullWidth"
                    sx={{ borderColor: "text.primary", width: "100%" }}
                />
            </Container>
        );
    };

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
                        Auditorias disponibles
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
            <Dialog
                open={openDialog2}
                onClose={handleCloseDialog2}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"Faltan preguntas por responder"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Por favor, responda todas las preguntas antes de
                        continuar.
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog2}>Aceptar</Button>
                </DialogActions>
            </Dialog>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "top",
                    alignItems: "center",
                    pt: 8,
                    px: 2,
                    pb: 2,
                    bgcolor: "background.main",
                }}
            >
                <form onSubmit={onSubmit} style={{ width: "100%" }}>
                    <Container
                        sx={{
                            mb: 2,
                            bgcolor: "white",
                            borderRadius: 2,
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
                                        label="Trabajador"
                                        name="trabajador"
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
                                                    value={trabajador.id}
                                                    key={trabajador.id}
                                                >
                                                    {trabajador.nombre}
                                                </MenuItem>
                                            )
                                        )}
                                    </Select>
                                    {errors.trabajador && (
                                        <Alert severity="error">
                                            Este campo es requerido
                                        </Alert>
                                    )}
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
                                        label="Maquinaria"
                                        name="maquinaria"
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
                                        {storageData.maquinarias.map((tipo) =>
                                            renderSelectMaquinaria(tipo)
                                        )}
                                    </Select>
                                    {errors.maquinaria && (
                                        <Alert severity="error">
                                            Este campo es requerido
                                        </Alert>
                                    )}
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
                                        label="Herramienta"
                                        name="herramienta"
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
                                        {storageData.herramientas.map((tipo) =>
                                            renderSelectHerramienta(tipo)
                                        )}
                                    </Select>
                                    {errors.herramienta && (
                                        <Alert severity="error">
                                            Este campo es requerido
                                        </Alert>
                                    )}
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
                                        label="Equipo"
                                        name="equipo"
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
                                        {storageData.equipos.map((tipo) =>
                                            renderSelectEquipo(tipo)
                                        )}
                                    </Select>
                                    {errors.equipo && (
                                        <Alert severity="error">
                                            Este campo es requerido
                                        </Alert>
                                    )}
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
                                        label="Instalación"
                                        name="instalacion"
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
                                                    value={instalacion.id}
                                                    key={instalacion.id}
                                                >
                                                    {instalacion.nombre}
                                                </MenuItem>
                                            )
                                        )}
                                    </Select>
                                    {errors.instalacion && (
                                        <Alert severity="error">
                                            Este campo es requerido
                                        </Alert>
                                    )}
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
                                        label="Transporte"
                                        name="transporte"
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
                                        {storageData.transportes.map((tipo) =>
                                            renderSelectTransporte(tipo)
                                        )}
                                    </Select>
                                    {errors.transporte && (
                                        <Alert severity="error">
                                            Este campo es requerido
                                        </Alert>
                                    )}
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
                                        label="Equipo de emergencia"
                                        name="equipo_emergencia"
                                        fullWidth
                                        defaultValue={""}
                                        sx={{ mb: 2 }}
                                        {...register("equipo_emergencia_id", {
                                            required: true,
                                        })}
                                    >
                                        <MenuItem value="">
                                            Seleccione un equipo de emergencia
                                        </MenuItem>
                                        {storageData.equipos_emergencia.map(
                                            (equipo_emergencia) =>
                                                renderSelectEquipoEmergencia(
                                                    equipo_emergencia
                                                )
                                        )}
                                    </Select>
                                    {errors.equipo_emergencia && (
                                        <Alert severity="error">
                                            Este campo es requerido
                                        </Alert>
                                    )}
                                </>
                            )}
                        {auditoria.tipo_id === 3 && (
                            <>
                                <InputLabel id="id_label_sucursal">
                                    Sucursal
                                </InputLabel>
                                <Select
                                    labelId="id_label_sucursal"
                                    label="Sucursal"
                                    name="sucursal"
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
                                    {storageData.sucursales.map((sucursal) => (
                                        <MenuItem
                                            value={sucursal.id}
                                            key={sucursal.id}
                                        >
                                            {sucursal.nombre}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.sucursal && (
                                    <Alert severity="error">
                                        Este campo es requerido
                                    </Alert>
                                )}
                            </>
                        )}
                        {auditoria.tipo_id === 4 && (
                            <>
                                <InputLabel id="id_label_faena">
                                    Faena
                                </InputLabel>
                                <Select
                                    labelId="id_label_faena"
                                    label="Faena"
                                    name="faena"
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
                                        >
                                            {faena.nombre}
                                        </MenuItem>
                                    ))}
                                </Select>
                                {errors.faena && (
                                    <Alert severity="error">
                                        Este campo es requerido
                                    </Alert>
                                )}
                            </>
                        )}
                        {auditoria.tipo_id === 5 && (
                            <>
                                <InputLabel id="id_label_contratista">
                                    Contratista
                                </InputLabel>
                                <Select
                                    labelId="id_label_contratista"
                                    label="Contratista"
                                    name="contratista"
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
                                            >
                                                {contratista.nombre}
                                            </MenuItem>
                                        )
                                    )}
                                </Select>
                                {errors.contratista && (
                                    <Alert severity="error">
                                        Este campo es requerido
                                    </Alert>
                                )}
                                <InputLabel id="id_label_sucursal">
                                    Sucursal (opcional)
                                </InputLabel>
                                <Select
                                    labelId="id_label_sucursal"
                                    label="Sucursal"
                                    name="sucursal"
                                    fullWidth
                                    defaultValue={""}
                                    sx={{ mb: 2 }}
                                    {...register("sucursal_id")}
                                >
                                    <MenuItem value="">
                                        Seleccione una sucursal
                                    </MenuItem>
                                    {storageData.sucursales.map((sucursal) => (
                                        <MenuItem
                                            value={sucursal.id}
                                            key={sucursal.id}
                                        >
                                            {sucursal.nombre}
                                        </MenuItem>
                                    ))}
                                </Select>
                                <InputLabel id="id_label_faena">
                                    Faena (opcional)
                                </InputLabel>
                                <Select
                                    labelId="id_label_faena"
                                    label="Faena"
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
                                        >
                                            {faena.nombre}
                                        </MenuItem>
                                    ))}
                                </Select>
                            </>
                        )}
                        <InputLabel id="id_label_subarea">Subárea</InputLabel>
                        <Select
                            labelId="id_label_subarea"
                            label="Subárea"
                            name="subarea"
                            fullWidth
                            defaultValue={""}
                            sx={{ mb: 2 }}
                            {...register("subarea_id", {
                                required: true,
                            })}
                        >
                            <MenuItem value="">Seleccione una subárea</MenuItem>
                            {storageData.areas.map((area) =>
                                renderSubarea(area)
                            )}
                        </Select>
                        {errors.subarea && (
                            <Alert severity="error">
                                Este campo es requerido
                            </Alert>
                        )}
                        {/* <InputLabel id="id_label_lugar">
                            Lugar (opcional)
                        </InputLabel>
                        <Select
                            labelId="id_label_lugar"
                            label="Lugar"
                            name="lugar"
                            fullWidth
                            defaultValue={""}
                            sx={{ mb: 2 }}
                            {...register("lugar_id")}
                        >
                            <MenuItem value="">Seleccione un lugar</MenuItem>
                            {storageData.lugares.map((lugar) => (
                                <MenuItem value={lugar.id} key={lugar.id}>
                                    {lugar.nombre}
                                </MenuItem>
                            ))}
                        </Select> */}
                    </Container>
                    {auditoria?.grupos?.map((grupo) => (
                        <Box
                            key={grupo.id}
                            sx={{
                                mb: 2,
                                bgcolor: "white",
                                borderRadius: 2,
                            }}
                        >
                            <Container
                                sx={{
                                    textAlign: "center",
                                    p: 2,
                                    bgcolor: "background.primary",
                                    borderTopLeftRadius: 8,
                                    borderTopRightRadius: 8,
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
                        </Box>
                    ))}
                    <Box
                        sx={{
                            mb: 2,
                            bgcolor: "white",
                            borderRadius: 2,
                        }}
                    >
                        <Container
                            sx={{
                                textAlign: "center",
                                p: 2,
                                bgcolor: "background.primary",
                                borderTopLeftRadius: 8,
                                borderTopRightRadius: 8,
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
                                {...register("observacion")}
                            ></TextField>
                        </Container>
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "top",
                            alignItems: "start",
                            mb: 2,
                            bgcolor: "white",
                            borderRadius: 2,
                        }}
                    >
                        <Container
                            sx={{
                                textAlign: "center",
                                p: 2,
                                bgcolor: "background.primary",
                                borderTopLeftRadius: 8,
                                borderTopRightRadius: 8,
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
                        {observaciones.length === 0 ? (
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
                                    No hay observaciones
                                </Typography>
                            </Container>
                        ) : (
                            <>
                                {observaciones.map((observacion) =>
                                    renderObservacion(observacion)
                                )}
                            </>
                        )}
                    </Box>
                    <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            justifyContent: "top",
                            alignItems: "start",
                            mb: 2,
                            bgcolor: "white",
                            borderRadius: 2,
                        }}
                    >
                        <Container
                            sx={{
                                textAlign: "center",
                                p: 2,
                                bgcolor: "background.primary",
                                borderTopLeftRadius: 8,
                                borderTopRightRadius: 8,
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
                                    No hay tareas
                                </Typography>
                            </Container>
                        ) : (
                            <>
                                {tareas.map((tarea) => (
                                    <Tarea
                                        tarea={tarea}
                                        updateTareas={updateTareas}
                                        getReference={getReference}
                                        key={tarea.id}
                                    />
                                ))}
                            </>
                        )}
                    </Box>
                    <Divider
                        sx={{
                            mb: 2,
                        }}
                    />
                    <Box
                        sx={{
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                        }}
                    >
                        <ButtonGroup
                            variant="contained"
                            color="secondary"
                            aria-label="contained primary button group"
                            fullWidth
                            sx={{ mb: 2 }}
                        >
                            <Button
                                type="button"
                                variant="contained"
                                alt="Cancelar"
                                color="error"
                                startIcon={<CancelIcon />}
                                onClick={handleOpenDialog}
                            >
                                Cancelar
                            </Button>
                            <Button
                                type="submit"
                                variant="contained"
                                alt="Guardar"
                                color="success"
                                endIcon={<SaveIcon />}
                            >
                                Guardar
                            </Button>
                        </ButtonGroup>
                    </Box>
                </form>
            </Box>
        </Box>
    );
}
