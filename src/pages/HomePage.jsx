import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import {
    Box,
    AppBar,
    Drawer,
    Dialog,
    DialogTitle,
    DialogContent,
    DialogContentText,
    DialogActions,
    Button,
    IconButton,
    Toolbar,
    Typography,
    List,
    ListItem,
    ListItemIcon,
    ListItemText,
    ListItemButton,
    Divider,
    Collapse,
    Avatar,
    Grid,
    Paper,
    CircularProgress,
    Container,
    Alert,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import ChecklistIcon from "@mui/icons-material/Checklist";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import CachedIcon from "@mui/icons-material/Cached";
import LogoutIcon from "@mui/icons-material/Logout";
import WavingHandIcon from "@mui/icons-material/WavingHand";
import {
    initStorage,
    getStorageConfig,
    getStorageData,
} from "../functions/functions";
import { getApiData } from "../functions/api";

export function HomePage() {
    const [dataState, setDataState] = useState({});
    const [open, setOpen] = useState(false);
    const [openSubmenu1, setOpenSubmenu1] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [empresa, setEmpresa] = useState(undefined);
    const [nAuditoriasRealizadas, setNAuditoriasRealizadas] =
        useState(undefined);
    const [
        nAuditoriasRealizadasNoSincronizadas,
        setNAuditoriasRealizadasNoSincronizadas,
    ] = useState(0);
    const [nCuasiAccidentesRealizados, setNCuasiAccidentesRealizados] =
        useState(undefined);
    const configData = getStorageConfig();
    const navigate = useNavigate();
    const drawerWidth = 240;

    useEffect(() => {
        document.title = "Inicio";
        initStorage();
        if (!configData.loginStatus) return navigate("/config");
        if (!configData.empresaID) return navigate("/empresa");
        const loadData = async () => {
            const response = await getApiData(
                configData.server,
                configData.empresaID
            );
            setDataState(response.data);
            localStorage.setItem("data", JSON.stringify(response.data));
        };
        if (navigator.onLine) {
            console.log("online");
            loadData();
        } else {
            console.log("offline");
            const storageData = getStorageData();
            setDataState(storageData);
        }
        configData.unidades.map((unidad) => {
            const encontrada = unidad.empresas.find(
                (x) => x.id === configData.empresaID
            );
            if (encontrada) {
                setEmpresa(encontrada);
            }
        });
        countAuditoriasRealizadas();
        countAuditoriasRealizadasNoSinconizadas();
        countCuasiAccidentesRealizados();
    }, []);

    const handleDrawerOpen = () => {
        setOpen(true);
    };

    const handleDrawerClose = () => {
        setOpen(false);
    };

    const handleClickSubmenu1 = () => {
        setOpenSubmenu1(!openSubmenu1);
    };

    const handleClickOpenDialog = () => {
        setOpenDialog(true);
    };

    const handleCloseDialog = () => {
        setOpenDialog(false);
    };

    const handleChangeEmpresa = () => {
        configData.empresaID = null;
        configData.empresa = null;
        localStorage.setItem("config", JSON.stringify(configData));
        navigate("/empresa");
    };

    const handleLogout = () => {
        localStorage.clear();
        initStorage();
        navigate("/config");
    };

    const countAuditoriasRealizadas = () => {
        const storageAuditorias = JSON.parse(
            localStorage.getItem("auditorias")
        );
        const realizadas = storageAuditorias.filter(
            (x) => x.empresa_id === configData.empresaID
        );
        setTimeout(() => {
            setNAuditoriasRealizadas(realizadas.length);
        }, 500);
    };

    const countCuasiAccidentesRealizados = () => {
        //     const storageCuasiAccidentes = JSON.parse(
        //         localStorage.getItem("cuasiAccidentes")
        //     );
        //     const realizados = storageCuasiAccidentes.filter(
        //         (x) => x.empresa_id === configData.empresaID
        //     );
        // setTimeout(() => {
        //         setNCuasiAccidentesRealizados(realizados.length);
        // }, 3000);
        setTimeout(() => {
            setNCuasiAccidentesRealizados(0);
        }, 500);
    };

    const countAuditoriasRealizadasNoSinconizadas = () => {
        const storageAuditorias = JSON.parse(
            localStorage.getItem("auditorias")
        );
        const realizadas = storageAuditorias.filter(
            (x) => x.empresa_id === configData.empresaID && !x.sync
        );
        setNAuditoriasRealizadasNoSincronizadas(realizadas.length);
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
                        color="inherit"
                        size="large"
                        aria-label="menu"
                        onClick={handleDrawerOpen}
                        sx={{ mr: 2 }}
                    >
                        <MenuIcon />
                    </IconButton>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "end",
                            flexGrow: 1,
                        }}
                    >
                        <img
                            src="https://insodev-estaticos.s3.amazonaws.com/logos/sfti/app/logo-blanco-texto-blanco-app.png"
                            alt="logo"
                            height="32"
                        />
                    </Box>
                </Toolbar>
            </AppBar>
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    "& .MuiDrawer-paper": {
                        width: drawerWidth,
                        boxSizing: "border-box",
                    },
                }}
                anchor="left"
                open={open}
            >
                <List
                    component="nav"
                    aria-labelledby="nested-list-subheader"
                    sx={{
                        pt: 0,
                    }}
                >
                    <ListItem
                        sx={{
                            bgcolor: "primary.main",
                            color: "white",
                        }}
                    >
                        <ListItemText
                            primary="Menú"
                            sx={{
                                width: "100%",
                            }}
                        />
                        <ListItemButton onClick={handleDrawerClose}>
                            <ListItemIcon
                                sx={{
                                    justifyContent: "flex-end",
                                    color: "white",
                                }}
                            >
                                <CloseIcon />
                            </ListItemIcon>
                        </ListItemButton>
                    </ListItem>
                    <Divider />
                    <ListItem sx={{ width: drawerWidth
                     }}>
                        <Avatar
                            alt="Logo empresa"
                            src={empresa && empresa.logo}
                            sx={{
                                width: 60,
                                height: 60,
                                mr: 2,
                                boxShadow: 4,
                            }}
                            imgProps={{
                                style: {
                                    objectFit: "contain",
                                    width: "85%",
                                },
                            }}
                        >
                            {empresa && (
                                <>
                                    {`${empresa.nombre.split(" ")[0][0]}`}{" "}
                                    {`${empresa.nombre.split(" ")[1][0]}`}
                                </>
                            )}
                        </Avatar>
                        <ListItemText primary={empresa && empresa.nombre} />
                    </ListItem>
                    <Divider />
                    <ListItemButton onClick={handleClickSubmenu1}>
                        <ListItemIcon>
                            <ChecklistIcon />
                        </ListItemIcon>
                        <ListItemText primary="Auditorias" />
                        {openSubmenu1 ? <ExpandLess /> : <ExpandMore />}
                    </ListItemButton>
                    <Collapse in={openSubmenu1} timeout="auto" unmountOnExit>
                        <List
                            component="div"
                            sx={{
                                bgcolor: "background.main",
                            }}
                        >
                            <ListItemButton
                                component={Link}
                                to="/auditoria/disponible/lista/"
                            >
                                <ListItemIcon>
                                    <ArrowRightIcon />
                                </ListItemIcon>
                                <ListItemText primary="Disponibles" />
                            </ListItemButton>
                            <Divider />
                            <ListItemButton
                                component={Link}
                                to="/auditoria/realizada/lista/"
                            >
                                <ListItemIcon>
                                    <ArrowRightIcon />
                                </ListItemIcon>
                                <ListItemText primary="Realizadas" />
                            </ListItemButton>
                        </List>
                    </Collapse>
                    <Divider />
                    <ListItemButton onClick={handleChangeEmpresa}>
                        <ListItemIcon>
                            <CachedIcon />
                        </ListItemIcon>
                        <ListItemText primary="Cambiar empresa" />
                    </ListItemButton>
                    <Divider />
                    <ListItemButton onClick={handleClickOpenDialog}>
                        <ListItemIcon>
                            <LogoutIcon />
                        </ListItemIcon>
                        <ListItemText primary="Cerrar sesión" />
                    </ListItemButton>
                    <Divider />
                </List>
            </Drawer>
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">
                    {"¿Desea cerrar sesión?"}
                </DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Esta acción descartará cualquier dato que no este
                        sincronizado.
                        <br />
                        <br />
                        Es necesario volver a iniciar sesión para continuar,
                        para lo cual, requiere de una conexión a internet
                        estable.
                        <br />
                        <br />
                        ¿Desea continuar?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancelar</Button>
                    <Button onClick={handleLogout} autoFocus>
                        Cerrar Sesión
                    </Button>
                </DialogActions>
            </Dialog>
            <Box
                sx={{
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "top",
                    alignItems: "center",
                    minHeight: "100vh",
                    pt: 8,
                    px: 2,
                    pb: 2,
                    bgcolor: "background.main",
                }}
            >
                <Grid
                    container
                    spacing={2}
                    sx={{
                        width: "100%",
                    }}
                >
                    <Grid item xs={12} sm={12} md={12}>
                        <Paper
                            elevation={3}
                            sx={{
                                p: 2,
                            }}
                        >
                            {configData.user ? (
                                <>
                                    <Typography variant="body1" align="left">
                                        <WavingHandIcon
                                            fontSize="small"
                                            color="primary"
                                        />{" "}
                                        Bienvenido
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        align="left"
                                        sx={{
                                            fontWeight: "bold",
                                        }}
                                    >
                                        {configData.user}
                                    </Typography>
                                </>
                            ) : (
                                <CircularProgress />
                            )}
                        </Paper>
                    </Grid>
                    {nAuditoriasRealizadasNoSincronizadas > 0 && (
                        <Grid item xs={12} sm={12} md={12}>
                            <Paper elevation={3}>
                                <Alert severity="warning">
                                    Exiten{" "}
                                    {nAuditoriasRealizadasNoSincronizadas}{" "}
                                    auditorias sin sincronizar
                                    <Link to="/auditoria/realizada/lista/">
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            alt="Ver auditorias realizadas"
                                            size="small"
                                            startIcon={<ArrowRightIcon />}
                                            sx={{
                                                mt: 2,
                                            }}
                                        >
                                            Ver auditorias realizadas
                                        </Button>
                                    </Link>
                                </Alert>
                            </Paper>
                        </Grid>
                    )}
                    <Grid item xs={6} sm={6} md={3}>
                        <Paper elevation={3}>
                            <Typography
                                variant="h2"
                                align="center"
                                sx={{
                                    fontWeight: "bold",
                                }}
                            >
                                {nAuditoriasRealizadas != undefined ? (
                                    nAuditoriasRealizadas
                                ) : (
                                    <CircularProgress />
                                )}
                            </Typography>
                            <Container
                                sx={{
                                    p: 2,
                                    bgcolor: "primary.main",
                                    borderBottomLeftRadius: 4,
                                    borderBottomRightRadius: 4,
                                }}
                            >
                                <Typography
                                    variant="body1"
                                    align="center"
                                    color="white"
                                >
                                    Auditorias realizadas
                                </Typography>
                            </Container>
                        </Paper>
                    </Grid>
                    <Grid item xs={6} sm={6} md={3}>
                        <Paper elevation={3}>
                            <Typography
                                variant="h2"
                                align="center"
                                sx={{
                                    fontWeight: "bold",
                                }}
                            >
                                {nCuasiAccidentesRealizados != undefined ? (
                                    nCuasiAccidentesRealizados
                                ) : (
                                    <CircularProgress />
                                )}
                            </Typography>
                            <Container
                                sx={{
                                    p: 2,
                                    bgcolor: "primary.main",
                                    borderBottomLeftRadius: 4,
                                    borderBottomRightRadius: 4,
                                }}
                            >
                                <Typography
                                    variant="body1"
                                    align="center"
                                    color="white"
                                >
                                    Cuasiaccidentes realizados
                                </Typography>
                            </Container>
                        </Paper>
                    </Grid>
                </Grid>
            </Box>
        </Box>
    );
}
