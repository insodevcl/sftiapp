import { useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import {
    Box,
    Container,
    AppBar,
    Toolbar,
    IconButton,
    Typography,
    Divider,
    Paper,
    Stack,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import CircleIcon from "@mui/icons-material/Circle";
import {
    getStorageConfig,
    getStorageData,
    getStorageAuditoriasRealizadas,
    stringToLocalDateTime,
} from "../functions/functions";
import { PreguntaRealizada } from "../components/PreguntaRealizada";

export function ViewAuditoriaRealizadaPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const storageConfig = getStorageConfig();
    const storageData = getStorageData();
    const auditoriasRealizadas = getStorageAuditoriasRealizadas(
        storageConfig.empresaID
    );
    const auditoriaRealizada = auditoriasRealizadas.find(
        (x) => x.id === parseInt(id)
    );
    const auditoria = storageData.auditorias.find(
        (x) => x.id === auditoriaRealizada.auditoria_id
    );
    const realizador = storageData.trabajadores.find(
        (x) => x.usuario === auditoriaRealizada.user_id
    );
    let subarea = {};
    storageData.areas?.map((area) => {
        const encontrada = area.subareas.find(
            (x) => x.id === auditoriaRealizada.subarea_id
        );
        if (encontrada) {
            subarea = { ...encontrada, area: area.nombre };
        }
        return null;
    });
    const operador = storageData.trabajadores.find(
        (x) => x.id === auditoriaRealizada.operador_id
    );
    const getSupervisor = (id) => {
        return storageData.trabajadores.find((x) => x.id === id).nombre;
    };
    const getResponsable = (id) => {
        return storageData.trabajadores.find((x) => x.id === id).nombre;
    };
    const getCriticidad = (id) => {
        return storageData.todo_criticidad.find((x) => x.id === id).nivel;
    };

    useEffect(() => {
        document.title = "Ver auditoría realizada";
        window.scrollTo(0, 0);
    }, []);

    const getAplicada = () => {
        let aplicada = undefined;
        switch (auditoria.tipo_id) {
            case 2:
                switch (auditoria.categoria_id) {
                    case 1:
                        aplicada = storageData.trabajadores.find(
                            (x) => x.id === auditoriaRealizada.trabajador_id
                        ).nombre;
                        break;
                    case 2:
                        storageData.maquinarias?.map((maquinaria) => {
                            const encontrada = maquinaria.maquinarias.find(
                                (x) => x.id === auditoriaRealizada.maquinaria_id
                            );
                            if (encontrada) {
                                aplicada = encontrada.nombre;
                            }
                            return null;
                        });
                        break;
                    case 3:
                        storageData.herramientas?.map((herramienta) => {
                            const encontrada = herramienta.herramientas.find(
                                (x) =>
                                    x.id === auditoriaRealizada.herramienta_id
                            );
                            if (encontrada) {
                                aplicada = encontrada.nombre;
                            }
                            return null;
                        });
                        break;
                    case 4:
                        storageData.equipos?.map((equipo) => {
                            const encontrada = equipo.equipos.find(
                                (x) => x.id === auditoriaRealizada.equipo_id
                            );
                            if (encontrada) {
                                aplicada = encontrada.nombre;
                            }
                            return null;
                        });
                        break;
                    case 5:
                        aplicada = storageData.instalaciones?.find(
                            (x) => x.id === auditoriaRealizada.instalacion_id
                        ).nombre;
                        break;
                    case 6:
                        aplicada = storageData.transportes?.map((transporte) => {
                            const encontrada = transporte.transportes.find(
                                (x) => x.id === auditoriaRealizada.transporte_id
                            );
                            if (encontrada) {
                                aplicada = encontrada.nombre;
                            }
                            return null;
                        });
                        break;
                    case 7:
                        aplicada = storageData.epps?.find(
                            (x) => x.id === auditoriaRealizada.epp_id
                        ).nombre;
                        break;
                    default:
                        aplicada = "No aplica";
                        break;
                }
                break;
            case 3:
                aplicada = storageData.sucursales.find(
                    (x) => x.id === auditoriaRealizada.sucursal_id
                ).nombre;
                break;
            case 4:
                aplicada = storageData.faenas.find(
                    (x) => x.id === auditoriaRealizada.faena_id
                ).nombre;
                break;
            case 5:
                aplicada = storageData.contratistas.find(
                    (x) => x.id === auditoriaRealizada.contratista_id
                ).nombre;
                break;
            default:
                break;
        }
        return aplicada;
    };

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
                        Auditoria realizada ID: {id}
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
                    px: 2,
                    pb: 2,
                    backgroundColor: "background.main",
                }}
            >
                <Paper
                    elevation={3}
                    sx={{
                        width: "100%",
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
                            Antecedentes de la auditoría
                        </Typography>
                    </Container>
                    <Container
                        sx={{
                            textAlign: "left",
                            p: 2,
                        }}
                    >
                        <Typography variant="body1" component="div">
                            <strong>Nombre:</strong> {auditoria.nombre}
                        </Typography>
                        <Typography variant="body1" component="div">
                            <strong>Descripción:</strong>{" "}
                            {auditoria.descripcion}
                        </Typography>
                        <Typography variant="body1" component="div">
                            <strong>Fecha de realización:</strong>{" "}
                            {stringToLocalDateTime(auditoriaRealizada.fecha)}
                        </Typography>
                        <Typography variant="body1" component="div">
                            <strong>Aplicada por:</strong> {realizador.nombre}
                        </Typography>
                        <Typography variant="body1" component="div">
                            <strong>Tipo:</strong> {auditoria.tipo}
                        </Typography>
                        <Typography variant="body1" component="div">
                            <strong>Categoría:</strong>{" "}
                            {auditoria.categoria || "No aplica"}
                        </Typography>
                        <Typography variant="body1" component="div">
                            <strong>Área:</strong> {subarea.area}
                        </Typography>
                        <Typography variant="body1" component="div">
                            <strong>Subárea:</strong> {subarea.nombre}
                        </Typography>
                        {getAplicada() && (
                            <Typography variant="body1" component="div">
                                <strong>Aplicada a:</strong> {getAplicada()}
                            </Typography>
                        )}
                        {operador && (
                            <Typography variant="body1" component="div">
                                <strong>Operador:</strong>{" "}
                                {operador ? operador.nombre : "No aplica"}
                            </Typography>
                        )}
                    </Container>
                    <Paper
                        variant="outlined"
                        sx={{
                            backgroundColor: "white",
                            m: 2,
                        }}
                    >
                        <Typography
                            variant="h6"
                            sx={{
                                textAlign: "center",
                                mb: 2,
                            }}
                        >
                            Simbología
                        </Typography>
                        <Stack
                            direction="row"
                            divider={
                                <Divider orientation="vertical" flexItem />
                            }
                            sx={{
                                display: "flex",
                                justifyContent: "space-between",
                                alignItems: "center",
                            }}
                        >
                            <Container
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "start",
                                    alignItems: "center",
                                    textAlign: "center",
                                    height: "64px",
                                    p: 0,
                                }}
                            >
                                <CheckCircleIcon
                                    fontSize="small"
                                    color="success"
                                />
                                <Typography variant="body2" component="em">
                                    Cumple
                                </Typography>
                            </Container>
                            <Container
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "start",
                                    alignItems: "center",
                                    textAlign: "center",
                                    height: "64px",
                                    p: 0,
                                }}
                            >
                                <CancelIcon fontSize="small" color="error" />
                                <Typography variant="body2" component="em">
                                    No cumple
                                </Typography>
                            </Container>
                            <Container
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "start",
                                    alignItems: "center",
                                    textAlign: "center",
                                    height: "64px",
                                    p: 0,
                                }}
                            >
                                <RemoveCircleIcon
                                    fontSize="small"
                                    color="warning"
                                />
                                <Typography variant="body2" component="em">
                                    Corrección
                                </Typography>
                            </Container>
                            <Container
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "start",
                                    alignItems: "center",
                                    textAlign: "center",
                                    height: "64px",
                                    p: 0,
                                }}
                            >
                                <CircleIcon fontSize="small" color="grey" />
                                <Typography variant="body2" component="em">
                                    No aplica
                                </Typography>
                            </Container>
                        </Stack>
                    </Paper>
                </Paper>
                {auditoria.grupos?.map((grupo) => (
                    <Paper
                        key={grupo.id}
                        sx={{
                            width: "100%",
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
                        {grupo.preguntas?.map((pregunta) => (
                            <PreguntaRealizada
                                key={pregunta.id}
                                pregunta={pregunta}
                                auditoriaRealizada={auditoriaRealizada}
                            />
                        ))}
                    </Paper>
                ))}
                <Paper
                    elevation={3}
                    sx={{
                        width: "100%",
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
                    {auditoriaRealizada.observaciones === "" ? (
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
                                {auditoriaRealizada.observaciones}
                            </Typography>
                        </Container>
                    )}
                </Paper>
                <Paper
                    elevation={3}
                    sx={{
                        width: "100%",
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
                    {auditoriaRealizada.tareas.length === 0 ? (
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
                                No se registraron tareas
                            </Typography>
                        </Container>
                    ) : (
                        <>
                            {auditoriaRealizada.tareas.map((tarea) => (
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
                                        <b>Supervisor:</b>{" "}
                                        {getSupervisor(tarea.supervisor_id)}
                                    </Typography>
                                    <Typography variant="body1" component="div">
                                        <b>Responsable:</b>{" "}
                                        {getResponsable(tarea.responsable_id)}
                                    </Typography>
                                    <Typography variant="body1" component="div">
                                        <b>Criticidad:</b>{" "}
                                        {getCriticidad(tarea.criticidad_id)}
                                    </Typography>
                                    <Typography variant="body1" component="div">
                                        <b>Fecha de cierre:</b>{" "}
                                        {tarea.fecha_cierre}
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
                <Divider />
            </Box>
        </Box>
    );
}
