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
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import CloseIcon from "@mui/icons-material/Close";
import ChecklistIcon from "@mui/icons-material/Checklist";
import ArrowRightIcon from "@mui/icons-material/ArrowRight";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import CachedIcon from "@mui/icons-material/Cached";
import LogoutIcon from "@mui/icons-material/Logout";
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

    return (
        <Box sx={{ flexGrow: 1 }}>
            <AppBar position="fixed">
                <Toolbar
                    variant="dense"
                    sx={{
                        bgcolor: "#59185E",
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
                    <Typography
                        variant="h6"
                        component="div"
                        sx={{ flexGrow: 1 }}
                    >
                        Inicio
                    </Typography>
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
                            bgcolor: "#59185E",
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
                    <ListItem sx={{ width: drawerWidth }}>
                        <Avatar sx={{ width: 60, height: 60, mr: 2 }}>
                            {configData.user
                                ? configData.user.split(" ")[0][0]
                                : "Cargando..."}{" "}
                            {configData.user
                                ? configData.user.split(" ")[1][0]
                                : "Cargando..."}
                        </Avatar>
                        <ListItemText
                            primary={
                                configData.user
                                    ? configData.user
                                    : "Cargando..."
                            }
                            secondary={
                                configData.empresa
                                    ? configData.empresa
                                    : "Cargando..."
                            }
                        />
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
                                bgcolor: "#ecf0f1",
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
                        <ListItemText primary="Cambiar Empresa" />
                    </ListItemButton>
                    <Divider />
                    <ListItemButton onClick={handleClickOpenDialog}>
                        <ListItemIcon>
                            <LogoutIcon />
                        </ListItemIcon>
                        <ListItemText primary="Cerrar Sesión" />
                    </ListItemButton>
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
                        para lo cual, requiere de una conexión a internet estable.
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
                    justifyContent: "center",
                    alignItems: "center",
                    minHeight: "100vh",
                    pt: 8,
                    px: 1,
                    pb: 2,
                    bgcolor: "#ecf0f1",
                }}
            ></Box>
        </Box>
    );
}
