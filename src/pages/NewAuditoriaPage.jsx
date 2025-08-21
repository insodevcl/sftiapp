import {useState, useEffect} from 'react';
import {useParams, useNavigate} from 'react-router-dom';
import {useForm} from 'react-hook-form';
import {toast} from 'react-toastify';
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
    MenuItem,
    Alert,
    Divider,
    ButtonGroup,
    Paper, Autocomplete,
} from '@mui/material';
import {LoadingButton} from '@mui/lab';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import CancelIcon from '@mui/icons-material/Cancel';
import SaveIcon from '@mui/icons-material/Save';
import {
    getContratistaFromStorage,
    getFaenaFromStorage, getHerramientaFromStorage, getLugarFromStorage,
    getConfigFromStorage, getSubAreaFromStorage,
    getSucursalFromStorage, getTrabajadorFromStorage,
    updateSyncAuditoria, getEvaluacionFromStorage, getRealizadorFromConfig, getPreguntaForEvaluacionFromStorage
} from '../functions/functions';
import {EvaluacionPregunta} from '../components/EvaluacionPregunta';
import {TareaCard} from '../components/TareaCard';
import {apiAuditoriaPost} from '../functions/api';

export function NewAuditoriaPage() {
    const {id} = useParams();
    const evaluacion = getEvaluacionFromStorage(id);
    const realizador = getRealizadorFromConfig();
    const [sucursales, setSucursales] = useState([]);
    const [faenas, setFaenas] = useState([]);
    const [lugares, setLugares] = useState([]);
    const [areas, setAreas] = useState([]);
    const [trabajadores, setTrabajadores] = useState([]);
    const [herramientas, setHerramientas] = useState([]);
    const [equipos, setEquipos] = useState([]);
    const [maquinarias, setMaquinarias] = useState([]);
    const [transportes, setTransporte] = useState([]);
    const [instalaciones, setInstalaciones] = useState([]);
    const [equipos_emergencia, setEquiposEmergencia] = useState([]);
    const [contratistas, setContratistas] = useState([]);
    const [respuestas, setRespuestas] = useState([]);
    const [tareas, setTareas] = useState([]);
    const [openLoading, setOpenLoading] = useState(true);
    const [openDialog, setOpenDialog] = useState(false);
    const [submitting, setSubmitting] = useState(false);
    const [nPreguntas, setNPreguntas] = useState(0);
    const [nRespuestas, setNRespuestas] = useState(0);
    const navigate = useNavigate();
    const storageConfig = getConfigFromStorage();
    const {
        register,
        handleSubmit,
        setValue,
        formState: {errors},
    } = useForm({
            defaultValues: {
                sucursal_id: null,
                faena_id: null,
                subarea_id: null,
                lugar_id: null,
                contratista_id: null,
                trabajador_id: null,
                herramienta_id: null,
                equipo_id: null,
                maquinaria_id: null,
                transporte_id: null,
                instalacion_id: null,
                equipo_emergencia_id: null,
                operador_id: null,
            }
        }
    );

    useEffect(() => {
        document.title = 'Nueva Auditoría';
        window.scrollTo(0, 0);
        const storageTrabajadores = JSON.parse(localStorage.getItem('trabajador'));
        setTrabajadores(storageTrabajadores);
        const storageSucursales = JSON.parse(localStorage.getItem('sucursal'));
        setSucursales(storageSucursales);
        const storageFaenas = JSON.parse(localStorage.getItem('faena'));
        setFaenas(storageFaenas);
        const storageLugares = JSON.parse(localStorage.getItem('lugar'));
        setLugares(storageLugares);
        const storageAreas = JSON.parse(localStorage.getItem('area'));
        setAreas(storageAreas);
        const storageHerramientas = JSON.parse(localStorage.getItem('herramienta'));
        setHerramientas(storageHerramientas);
        const storageEquipos = JSON.parse(localStorage.getItem('equipo'));
        setEquipos(storageEquipos);
        const storageMaquinarias = JSON.parse(localStorage.getItem('maquinaria'));
        setMaquinarias(storageMaquinarias);
        const storageTransportes = JSON.parse(localStorage.getItem('transporte'));
        setTransporte(storageTransportes);
        const storageInstalaciones = JSON.parse(localStorage.getItem('instalacion'));
        setInstalaciones(storageInstalaciones);
        const storageEquiposEmergencia = JSON.parse(localStorage.getItem('equipoEmergencia'));
        setEquiposEmergencia(storageEquiposEmergencia);
        const storageContratistas = JSON.parse(localStorage.getItem('contratista'));
        setContratistas(storageContratistas);

        setTimeout(() => {
            setOpenLoading(false);
        }, 3000);
    }, []);

    useEffect(() => {
        countPreguntas();
    }, [evaluacion]);

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
        evaluacion.grupos?.map((grupo) => {
            grupo.preguntas?.map((pregunta) => {
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
            return toast.warning('Por favor, responda todas las preguntas antes de continuar');
        }
        data['id'] = JSON.parse(localStorage.getItem('auditoria')).length + 1;
        data['user_id'] = storageConfig.userID;
        data['fecha'] = new Date().toJSON();
        data['realizador'] = realizador.nombre;
        data['realizador_id'] = realizador.id;
        data['sucursal'] = getSucursalFromStorage(data.sucursal_id)?.nombre || null;
        data['faena'] = getFaenaFromStorage(data.faena_id)?.nombre || null;
        data['subarea'] = getSubAreaFromStorage(data.subarea_id)?.nombre || null;
        data['lugar'] = getLugarFromStorage(data.lugar_id)?.nombre || null;
        data['contratista'] = getContratistaFromStorage(data.contratista_id)?.nombre || null;
        data['trabajador'] = getTrabajadorFromStorage(data.trabajador_id)?.nombre || null;
        data['herramienta'] = getHerramientaFromStorage(data.herramienta_id)?.nombre || null;
        data['equipo'] = getHerramientaFromStorage(data.equipo_id)?.nombre || null;
        data['maquinaria'] = getHerramientaFromStorage(data.maquinaria_id)?.nombre || null;
        data['transporte'] = getHerramientaFromStorage(data.transporte_id)?.nombre || null;
        data['instalacion'] = getHerramientaFromStorage(data.instalacion_id)?.nombre || null;
        data['equipo_emergencia'] = getHerramientaFromStorage(data.equipo_emergencia_id)?.nombre || null;
        data['operador'] = getTrabajadorFromStorage(data.operador_id)?.nombre || null;
        data['empresa_id'] = storageConfig.empresaID;
        data['respuestas'] = respuestas;
        data['tareas'] = tareas;
        data['evaluacion_id'] = evaluacion.id;
        data['sync'] = false;
        const storageAuditoria = JSON.parse(localStorage.getItem('auditoria'));
        storageAuditoria.push(data);
        localStorage.setItem('auditoria', JSON.stringify(storageAuditoria));
        toast.success('Auditoría guardada');
        if (navigator.onLine) {
            return syncAuditoria(data);
        } else {
            return navigate('/');
        }
    });

    const syncAuditoria = async (data) => {
        setOpenLoading(true);
        await apiAuditoriaPost(storageConfig.serverUrl, data).then((response) => {
            if (response.status === 200) {
                updateSyncAuditoria(data.id);
            }
        });
        setTimeout(() => {
            setOpenLoading(false);
            return navigate('/');
        }, 1000);
    };

    const getPregunta = (pregunta_id) => {
        const pregunta = getPreguntaForEvaluacionFromStorage(evaluacion.id, pregunta_id);
        if (pregunta) {
            return pregunta.pregunta;
        } else {
            return 'Pregunta no encontrada';
        }
    };

    const getRespuesta = (id) => {
        return respuestas.find((x) => x.pregunta_id === id)?.respuesta || 0;
    };

    const updateRespuestas = (pregunta_id, respuesta) => {
        const index = respuestas.findIndex((x) => x.pregunta_id === pregunta_id);
        if (index > -1) {
            respuestas[index].respuesta = respuesta;
            setRespuestas([...respuestas]);
        } else {
            setRespuestas([
                ...respuestas,
                {
                    pregunta_id: pregunta_id,
                    respuesta: respuesta,
                    observacion: '',
                },
            ]);
        }
    };

    const updateObservacion = (pregunta_id, observacion) => {
        const index = respuestas.findIndex((x) => x.pregunta_id === pregunta_id);
        if (index > -1) {
            respuestas[index].observacion = observacion;
            setRespuestas([...respuestas]);
        }
    };

    const removeObservacion = (pregunta_id) => {
        const index = respuestas.findIndex((x) => x.pregunta_id === pregunta_id);
        if (index > -1) {
            respuestas[index].observacion = '';
            setRespuestas([...respuestas]);
        }
    };

    const updateTareas = (pregunta_id, tarea, descripcion, supervisor_id, responsable_id, criticidad_id, fecha_cierre) => {
        const index = tareas.findIndex((x) => x.pregunta_id === pregunta_id);
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
                    pregunta_id: pregunta_id,
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

    const removeTarea = (pregunta_id) => {
        const index = tareas.findIndex((x) => x.pregunta_id === pregunta_id);
        if (index > -1) {
            tareas.splice(index, 1);
            setTareas([...tareas]);
        }
    };

    const handleOption = (event, respuesta) => {
        const pregunta_id = parseInt(event.target.parentNode.dataset.id);
        updateRespuestas(pregunta_id, respuesta);
        switch (respuesta) {
            case 1:
                removeObservacion(pregunta_id);
                removeTarea(pregunta_id);
                break;
            case 2:
                updateObservacion(pregunta_id, '');
                updateTareas(pregunta_id, '', '', null, null, null, '');
                break;
            case 3:
                updateObservacion(pregunta_id, '');
                removeTarea(pregunta_id);
                break;
            case 0:
                updateObservacion(pregunta_id, '');
                removeTarea(pregunta_id);
                break;
            default:
                removeObservacion(pregunta_id);
                removeTarea(pregunta_id);
                break;
        }
    };

    const handleObservacion = (event) => {
        const pregunta_id = parseInt(event.target.dataset.id);
        const observacion = event.target.value;
        updateObservacion(pregunta_id, observacion);
    };

    const renderSelectHerramienta = (tipo) => {
        if (tipo.herramientas?.length > 0) {
            const items = tipo.herramientas?.map((herramienta) => {
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
        if (tipo.equipos?.length > 0) {
            const items = tipo.equipos?.map((equipo) => {
                return (
                    <MenuItem
                        key={equipo.id}
                        value={equipo.id}
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
        if (tipo.maquinarias?.length > 0) {
            const items = tipo.maquinarias?.map((maquinaria) => {
                return (
                    <MenuItem
                        key={maquinaria.id}
                        value={maquinaria.id}
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
        if (tipo.transportes?.length > 0) {
            const items = tipo.transportes?.map((transporte) => {
                return (
                    <MenuItem
                        key={transporte.id}
                        value={transporte.id}
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
        if (tipo.equipos_emergencia?.length > 0) {
            const items = tipo.equipos_emergencia?.map((equipo) => {
                return (
                    <MenuItem
                        key={equipo.id}
                        value={equipo.id}
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

    const renderSubarea = (area) => {
        if (area.subareas?.length > 0) {
            const items = area.subareas?.map((subarea) => {
                return (
                    <MenuItem
                        key={subarea.id}
                        value={subarea.id}
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
                    sx={{mb: 2}}
                    {...register("operador_id", {
                        required: true,
                    })}
                >
                    <MenuItem value="">Seleccione un operador</MenuItem>
                    {trabajadores.map((operador) => (
                        <MenuItem
                            key={operador.id}
                            value={operador.id}
                            divider={true}
                            sx={{
                                whiteSpace: "normal",
                            }}
                        >
                            {operador.nombre}
                        </MenuItem>
                    ))}
                </Select>
                {errors.operador && <Alert severity="error">Este campo es requerido</Alert>}
            </>
        );
    };

    const renderObservacion = (respuesta) => {
        return (
            <Container
                key={respuesta.pregunta_id}
                sx={{
                    mb: 2,
                    p: 2,
                    backgroundColor: "white",
                    borderBottomLeftRadius: 2,
                    borderBottomRightRadius: 2,
                }}
            >
                <Typography variant="body2" sx={{mb: 2}}>
                    <b>Cumplimiento:</b> {getRespuesta(respuesta.pregunta_id) === 2 && `No cumple`}
                    {getRespuesta(respuesta.pregunta_id) === 3 && `Corrección`}
                    {getRespuesta(respuesta.pregunta_id) === 0 && `No Aplica`}
                </Typography>
                <Typography variant="body2" sx={{mb: 2}}>
                    <b>Descripción:</b> {getPregunta(respuesta.pregunta_id)}
                </Typography>
                <TextField
                    label="Observación"
                    multiline
                    rows={4}
                    fullWidth
                    onChange={handleObservacion}
                    inputProps={{
                        "data-id": respuesta.pregunta_id,
                    }}
                    sx={{mb: 2}}
                ></TextField>
                <Divider/>
            </Container>
        );
    };

    return (
        <>
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
                            onClick={handleOpenDialog}
                            sx={{mr: 2}}
                        >
                            <ArrowBackIcon/>
                        </IconButton>
                        <Typography variant="h6" component="div" sx={{flexGrow: 1}}>
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
                    <DialogTitle id="alert-dialog-title">{"¿Desea terminar la auditoría?"}</DialogTitle>
                    <DialogContent>
                        <DialogContentText id="alert-dialog-description">
                            Los cambios no guardados se perderán.
                            <br/>
                            <br/>
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
                    <form onSubmit={onSubmit} style={{width: "100%"}}>
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
                                <Typography variant="h6" component="div" sx={{color: "white", fontWeight: "bold"}}>
                                    {evaluacion.descripcion}
                                </Typography>
                            </Container>
                            <Container
                                sx={{
                                    p: 2,
                                }}
                            >
                                {evaluacion.tipo_id === 2 && evaluacion.categoria_id === 1 && (
                                    <>
                                        <InputLabel id="id_label_trabajador">Trabajador</InputLabel>
                                        <Autocomplete
                                            options={trabajadores}
                                            getOptionLabel={(option) => option.nombre}
                                            renderOption={(props, option) => (
                                                <li {...props}
                                                    key={option.id}
                                                    style={{borderBottom: "1px solid #e0e0e0"}}>
                                                    {option.nombre}
                                                </li>
                                            )}
                                            renderInput={(params) => (
                                                <TextField
                                                    {...params}
                                                    label="Seleccione un trabajador"
                                                    variant="outlined"
                                                    required
                                                />
                                            )}
                                            onChange={(_, value) => {
                                                if (value) {
                                                    setValue("trabajador_id", value.id);
                                                }
                                            }}
                                            sx={{
                                                mb: 2,
                                            }}
                                        />
                                    </>
                                )}
                                {evaluacion.tipo_id === 2 && evaluacion.categoria_id === 2 && (
                                    <>
                                        <InputLabel id="id_label_maquinaria">Maquinaria</InputLabel>
                                        <Select
                                            labelId="id_label_maquinaria"
                                            name="maquinaria"
                                            required
                                            fullWidth
                                            defaultValue={""}
                                            sx={{mb: 2}}
                                            {...register("maquinaria_id", {
                                                required: true,
                                            })}
                                        >
                                            <MenuItem value="">Seleccione una maquinaria</MenuItem>
                                            {maquinarias.map((tipo) => renderSelectMaquinaria(tipo))}
                                        </Select>
                                        {renderOperador()}
                                    </>
                                )}
                                {evaluacion.tipo_id === 2 && evaluacion.categoria_id === 3 && (
                                    <>
                                        <InputLabel id="id_label_herramienta">Herramienta</InputLabel>
                                        <Select
                                            labelId="id_label_herramienta"
                                            name="herramienta"
                                            required
                                            fullWidth
                                            defaultValue={""}
                                            sx={{mb: 2}}
                                            {...register("herramienta_id", {
                                                required: true,
                                            })}
                                        >
                                            <MenuItem value="">Seleccione una herramienta</MenuItem>
                                            {herramientas.map((tipo) => renderSelectHerramienta(tipo))}
                                        </Select>
                                        {renderOperador()}
                                    </>
                                )}
                                {evaluacion.tipo_id === 2 && evaluacion.categoria_id === 4 && (
                                    <>
                                        <InputLabel id="id_label_equipo">Equipo</InputLabel>
                                        <Select
                                            labelId="id_label_equipo"
                                            name="equipo"
                                            required
                                            fullWidth
                                            defaultValue={""}
                                            sx={{mb: 2}}
                                            {...register("equipo_id", {
                                                required: true,
                                            })}
                                        >
                                            <MenuItem value="">Seleccione un equipo</MenuItem>
                                            {equipos.map((tipo) => renderSelectEquipo(tipo))}
                                        </Select>
                                        {renderOperador()}
                                    </>
                                )}
                                {evaluacion.tipo_id === 2 && evaluacion.categoria_id === 5 && (
                                    <>
                                        <InputLabel id="id_label_instalacion">Instalación</InputLabel>
                                        <Select
                                            labelId="id_label_instalacion"
                                            name="instalacion"
                                            required
                                            fullWidth
                                            defaultValue={""}
                                            sx={{mb: 2}}
                                            {...register("instalacion_id", {
                                                required: true,
                                            })}
                                        >
                                            <MenuItem value="">Seleccione una instalación</MenuItem>
                                            {instalaciones.map((instalacion) => (
                                                <MenuItem
                                                    value={instalacion.id}
                                                    key={instalacion.id}
                                                    divider={true}
                                                    sx={{
                                                        whiteSpace: "normal",
                                                    }}
                                                >
                                                    {instalacion.nombre}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </>
                                )}
                                {evaluacion.tipo_id === 2 && evaluacion.categoria_id === 6 && (
                                    <>
                                        <InputLabel id="id_label_transporte">Transporte</InputLabel>
                                        <Select
                                            labelId="id_label_transporte"
                                            name="transporte"
                                            required
                                            fullWidth
                                            defaultValue={""}
                                            sx={{mb: 2}}
                                            {...register("transporte_id", {
                                                required: true,
                                            })}
                                        >
                                            <MenuItem value="">Seleccione un transporte</MenuItem>
                                            {transportes.map((tipo) => renderSelectTransporte(tipo))}
                                        </Select>
                                        {renderOperador()}
                                    </>
                                )}
                                {evaluacion.tipo_id === 2 && evaluacion.categoria_id === 7 && (
                                    <>
                                        <InputLabel id="id_label_equipo_emergencia">Equipo de
                                            emergencia</InputLabel>
                                        <Select
                                            labelId="id_label_equipo_emergencia"
                                            name="equipo_emergencia"
                                            required
                                            fullWidth
                                            defaultValue={""}
                                            sx={{mb: 2}}
                                            {...register("equipo_emergencia_id", {
                                                required: true,
                                            })}
                                        >
                                            <MenuItem value="">Seleccione un equipo de emergencia</MenuItem>
                                            {equipos_emergencia.map((tipo) =>
                                                renderSelectEquipoEmergencia(tipo)
                                            )}
                                        </Select>
                                    </>
                                )}
                                {evaluacion.tipo_id === 3 && (
                                    <>
                                        <InputLabel id="id_label_sucursal">Sucursal</InputLabel>
                                        <Select
                                            labelId="id_label_sucursal"
                                            name="sucursal"
                                            required
                                            fullWidth
                                            defaultValue={""}
                                            sx={{mb: 2}}
                                            {...register("sucursal_id", {
                                                required: true,
                                            })}
                                        >
                                            <MenuItem value="">Seleccione una sucursal</MenuItem>
                                            {sucursales.map((sucursal) => (
                                                <MenuItem
                                                    value={sucursal.id}
                                                    key={sucursal.id}
                                                    divider={true}
                                                    sx={{
                                                        whiteSpace: "normal",
                                                    }}
                                                >
                                                    {sucursal.nombre}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    </>
                                )}
                                {evaluacion.tipo_id === 4 && (
                                    <>
                                        <InputLabel id="id_label_faena">Faena</InputLabel>
                                        <Select
                                            labelId="id_label_faena"
                                            name="faena"
                                            required
                                            fullWidth
                                            defaultValue={""}
                                            sx={{mb: 2}}
                                            {...register("faena_id", {
                                                required: true,
                                            })}
                                        >
                                            <MenuItem value="">Seleccione una faena</MenuItem>
                                            {faenas.map((faena) => (
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
                                {evaluacion.tipo_id === 5 && (
                                    <>
                                        <InputLabel id="id_label_contratista">Contratista</InputLabel>
                                        <Select
                                            labelId="id_label_contratista"
                                            name="contratista"
                                            required
                                            fullWidth
                                            defaultValue={""}
                                            sx={{mb: 2}}
                                            {...register("contratista_id", {
                                                required: true,
                                            })}
                                        >
                                            <MenuItem value="">Seleccione un contratista</MenuItem>
                                            {contratistas.map((contratista) => (
                                                <MenuItem
                                                    value={contratista.id}
                                                    key={contratista.id}
                                                    divider={true}
                                                    sx={{
                                                        whiteSpace: "normal",
                                                    }}
                                                >
                                                    {contratista.nombre}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        <InputLabel id="id_label_sucursal">Sucursal (opcional)</InputLabel>
                                        <Select
                                            labelId="id_label_sucursal"
                                            name="sucursal"
                                            fullWidth
                                            defaultValue={""}
                                            sx={{mb: 2}}
                                            {...register("sucursal_id")}
                                        >
                                            <MenuItem value="">Seleccione una sucursal</MenuItem>
                                            {sucursales.map((sucursal) => (
                                                <MenuItem
                                                    value={sucursal.id}
                                                    key={sucursal.id}
                                                    divider={true}
                                                    sx={{
                                                        whiteSpace: "normal",
                                                    }}
                                                >
                                                    {sucursal.nombre}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                        <InputLabel id="id_label_faena">Faena (opcional)</InputLabel>
                                        <Select
                                            labelId="id_label_faena"
                                            name="faena"
                                            fullWidth
                                            defaultValue={""}
                                            sx={{mb: 2}}
                                            {...register("faena_id")}
                                        >
                                            <MenuItem value="">Seleccione una faena</MenuItem>
                                            {faenas.map((faena) => (
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
                                <InputLabel id="id_label_subarea">Subárea</InputLabel>
                                <Select
                                    labelId="id_label_subarea"
                                    name="subarea"
                                    required
                                    fullWidth
                                    defaultValue={""}
                                    sx={{mb: 2}}
                                    {...register("subarea_id", {
                                        required: true,
                                    })}
                                >
                                    <MenuItem value="">Seleccione una subárea</MenuItem>
                                    {areas.map((area) => renderSubarea(area))}
                                </Select>
                                <InputLabel id="id_label_lugar">Lugar (opcional)</InputLabel>
                                <Select
                                    labelId="id_label_lugar"
                                    name="lugar"
                                    fullWidth
                                    defaultValue={""}
                                    sx={{mb: 2}}
                                    {...register("lugar_id")}
                                >
                                    <MenuItem value="">Seleccione un lugar</MenuItem>
                                    {lugares?.map((lugar) => (
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
                        {evaluacion.grupos?.map((grupo) => (
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
                                        sx={{
                                            color: "white"
                                        }}
                                    >{grupo.nombre}</Typography>
                                </Container>
                                {grupo.preguntas?.map((pregunta) => (
                                    <EvaluacionPregunta
                                        key={pregunta.id}
                                        pregunta={pregunta}
                                        handleOption={handleOption}
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
                                <Typography variant="h6" component="div" sx={{color: "white", fontWeight: "bold"}}>
                                    Observaciones
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
                                <Typography variant="h6" component="div" sx={{color: "white", fontWeight: "bold"}}>
                                    Observaciones por pregunta
                                </Typography>
                            </Container>
                            {respuestas.filter((x) => x.respuesta !== 1).length === 0 ? (
                                <Container
                                    sx={{
                                        textAlign: "center",
                                        p: 2,
                                    }}
                                >
                                    <Typography variant="body1" component="div" sx={{color: "black"}}>
                                        No se registran observaciones
                                    </Typography>
                                </Container>
                            ) : (
                                <>
                                    {respuestas
                                        .filter((x) => x.respuesta !== 1)
                                        .map((respuesta) => renderObservacion(respuesta))}
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
                                    sx={{
                                        color: "white",
                                        fontWeight: "bold"
                                    }}
                                >
                                    Asignación de tareas
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
                                        sx={{
                                            color: "black"
                                        }}
                                    >
                                        No se registran tareas
                                    </Typography>
                                </Container>
                            ) : (
                                <>
                                    {tareas?.map((tarea) => (
                                        <TareaCard
                                            key={tarea.pregunta_id}
                                            tarea={tarea}
                                            updateTareas={updateTareas}
                                            getPregunta={getPregunta}
                                        />
                                    ))}
                                </>
                            )}
                        </Paper>
                        <Divider/>
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
                                sx={{mb: 2}}
                            >
                                <Button
                                    type="button"
                                    alt="Cancelar"
                                    color="error"
                                    startIcon={<CancelIcon/>}
                                    onClick={handleOpenDialog}
                                >
                                    Cancelar
                                </Button>
                                <LoadingButton
                                    type="submit"
                                    variant="contained"
                                    color="success"
                                    endIcon={<SaveIcon/>}
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
                open={openLoading}
                sx={{
                    color: "white",
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
            >
                <CircularProgress color="inherit"/>
            </Backdrop>
        </>
    );
}
