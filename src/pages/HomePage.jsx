import {useState, useEffect} from 'react';
import {useNavigate, Link} from 'react-router-dom';
import {toast} from 'react-toastify';
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
} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import CloseIcon from '@mui/icons-material/Close';
import ChecklistIcon from '@mui/icons-material/Checklist';
import ArrowRightIcon from '@mui/icons-material/ArrowRight';
import ExpandLess from '@mui/icons-material/ExpandLess';
import ExpandMore from '@mui/icons-material/ExpandMore';
import CachedIcon from '@mui/icons-material/Cached';
import LogoutIcon from '@mui/icons-material/Logout';
import WavingHandIcon from '@mui/icons-material/WavingHand';
import {initializeStorage, getConfigFromStorage, setConfigToStorage, getShortCompanyName, updateData} from '../functions/functions';

export function HomePage() {
    const [isLoading, setIsLoading] = useState(false);
    const [openSubmenu1, setOpenSubmenu1] = useState(false);
    const [openDialog, setOpenDialog] = useState(false);
    const [nAuditoriasRealizadas, setNAuditoriasRealizadas] = useState(undefined);
    const [nAuditoriasRealizadasNoSincronizadas, setNAuditoriasRealizadasNoSincronizadas] = useState(0);
    const [nCuasiAccidentesRealizados, setNCuasiAccidentesRealizados] = useState(undefined);
    const storageConfig = getConfigFromStorage();
    const navigate = useNavigate();
    const drawerWidth = 240;

    useEffect(() => {
        document.title = 'Inicio';
        initializeStorage();
        if (!storageConfig.userToken) return navigate('/config');
        if (!storageConfig.empresaID) return navigate('/empresa');
        if (navigator.onLine) {
            updateData().catch(() => {
                toast.error('Error al cargar los datos. Por favor, intente más tarde.');
            });
        }
        countAuditoriasRealizadas();
        countAuditoriasRealizadasNoSincronizadas();
        countCuasiAccidentesRealizados();
    }, []);

    const handleDrawerOpen = () => {
        setIsLoading(true);
    };

    const handleDrawerClose = () => {
        setIsLoading(false);
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
        if (navigator.onLine) {
            storageConfig.empresa = null;
            storageConfig.empresaID = null;
            storageConfig.empresaDni = null;
            storageConfig.empresaLogo = null;
            setConfigToStorage(storageConfig);
            navigate('/empresa');
        } else {
            toast.error(
                'Conexión a internet no disponible. No es posible cambiar de empresa. ' +
                'Por favor, intente más tarde.'
            );
        }
    };

    const handleLogout = () => {
        if (navigator.onLine) {
            localStorage.clear();
            initializeStorage();
            navigate('/config');
        } else {
            toast.error(
                'Conexión a internet no disponible. No es posible cerrar sesión. ' +
                'Por favor, intente más tarde.'
            );
        }
    };

    const countAuditoriasRealizadas = () => {
        const storageAuditorias = JSON.parse(localStorage.getItem('auditoria'));
        const realizadas = storageAuditorias.filter((x) => x.empresa_id === storageConfig.empresaID);
        setNAuditoriasRealizadas(realizadas.length);
    };

    const countCuasiAccidentesRealizados = () => {
        //     const storageCuasiAccidentes = JSON.parse(
        //         localStorage.getItem('cuasiAccidentes')
        //     );
        //     const realizados = storageCuasiAccidentes.filter(
        //         (x) => x.empresa_id === storageConfig.empresaID
        //     );
        // setTimeout(() => {
        //         setNCuasiAccidentesRealizados(realizados.length);
        // }, 3000);
        setNCuasiAccidentesRealizados(0);
    };

    const countAuditoriasRealizadasNoSincronizadas = () => {
        const storageAuditorias = JSON.parse(localStorage.getItem('auditoria'));
        const realizadas = storageAuditorias.filter((x) => x.empresa_id === storageConfig.empresaID && !x.sync);
        setNAuditoriasRealizadasNoSincronizadas(realizadas.length);
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
                        color="inherit"
                        size="large"
                        aria-label="menu"
                        onClick={handleDrawerOpen}
                        sx={{mr: 2}}
                    >
                        <MenuIcon/>
                    </IconButton>
                    <Box
                        sx={{
                            display: 'flex',
                            justifyContent: 'end',
                            flexGrow: 1,
                        }}
                    >
                        <img
                            src="https://insodev-estaticos.s3.amazonaws.com/logos/sfti/app/logo-blanco-texto-blanco-app.png"
                            alt="logo"
                            width={85}
                            height={32}
                        />
                    </Box>
                </Toolbar>
            </AppBar>
            <Drawer
                sx={{
                    width: drawerWidth,
                    flexShrink: 0,
                    '& .MuiDrawer-paper': {
                        width: drawerWidth,
                        boxSizing: 'border-box',
                    },
                }}
                anchor="left"
                open={isLoading}
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
                            backgroundColor: 'primary.main',
                            color: 'white',
                        }}
                    >
                        <ListItemText
                            primary="Menú"
                            sx={{
                                width: '100%',
                            }}
                        />
                        <ListItemButton onClick={handleDrawerClose}>
                            <ListItemIcon
                                sx={{
                                    justifyContent: 'flex-end',
                                    color: 'white',
                                }}
                            >
                                <CloseIcon/>
                            </ListItemIcon>
                        </ListItemButton>
                    </ListItem>
                    <Divider/>
                    <ListItem sx={{width: drawerWidth}}>
                        <Avatar
                            alt="Logo empresa"
                            src={storageConfig.empresaLogo}
                            sx={{
                                width: 60,
                                height: 60,
                                mr: 2,
                                boxShadow: 4,
                            }}
                            imgProps={{
                                style: {
                                    objectFit: 'contain',
                                    width: '85%',
                                },
                            }}
                        >
                            {getShortCompanyName(storageConfig.empresa)}
                        </Avatar>
                        <ListItemText primary={storageConfig.empresa}/>
                    </ListItem>
                    <Divider/>
                    <ListItemButton onClick={handleClickSubmenu1}>
                        <ListItemIcon>
                            <ChecklistIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Auditorias"/>
                        {openSubmenu1 ? <ExpandLess/> : <ExpandMore/>}
                    </ListItemButton>
                    <Collapse in={openSubmenu1} timeout="auto" unmountOnExit>
                        <List
                            component="div"
                            sx={{
                                backgroundColor: 'background.main',
                            }}
                        >
                            <ListItemButton component={Link} to="/auditoria/disponible/lista/">
                                <ListItemIcon>
                                    <ArrowRightIcon/>
                                </ListItemIcon>
                                <ListItemText primary="Disponibles"/>
                            </ListItemButton>
                            <Divider/>
                            <ListItemButton component={Link} to="/auditoria/realizada/lista/">
                                <ListItemIcon>
                                    <ArrowRightIcon/>
                                </ListItemIcon>
                                <ListItemText primary="Realizadas"/>
                            </ListItemButton>
                        </List>
                    </Collapse>
                    <Divider/>
                    <ListItemButton onClick={handleChangeEmpresa}>
                        <ListItemIcon>
                            <CachedIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Cambiar empresa"/>
                    </ListItemButton>
                    <Divider/>
                    <ListItemButton onClick={handleClickOpenDialog}>
                        <ListItemIcon>
                            <LogoutIcon/>
                        </ListItemIcon>
                        <ListItemText primary="Cerrar sesión"/>
                    </ListItemButton>
                    <Divider/>
                </List>
            </Drawer>
            <Dialog
                open={openDialog}
                onClose={handleCloseDialog}
                aria-labelledby="alert-dialog-title"
                aria-describedby="alert-dialog-description"
            >
                <DialogTitle id="alert-dialog-title">{'¿Desea cerrar sesión?'}</DialogTitle>
                <DialogContent>
                    <DialogContentText id="alert-dialog-description">
                        Esta acción descartará cualquier dato que no este sincronizado.
                        <br/>
                        <br/>
                        Es necesario volver a iniciar sesión para continuar, para lo cual, requiere de una conexión a
                        internet estable.
                        <br/>
                        <br/>
                        ¿Desea continuar?
                    </DialogContentText>
                </DialogContent>
                <DialogActions>
                    <Button onClick={handleCloseDialog}>Cancelar</Button>
                    <Button onClick={handleLogout} autoFocus>
                        Cerrar sesión
                    </Button>
                </DialogActions>
            </Dialog>
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
                <Grid
                    container
                    spacing={2}
                    sx={{
                        width: '100%',
                    }}
                >
                    <Grid item xs={12} sm={12} md={12}>
                        <Paper
                            elevation={3}
                            sx={{
                                p: 2,
                            }}
                        >
                            {storageConfig.userFullName ? (
                                <>
                                    <Typography variant="body1" align="left">
                                        <WavingHandIcon fontSize="small" color="primary"/> Bienvenido
                                    </Typography>
                                    <Typography
                                        variant="body1"
                                        align="left"
                                        sx={{
                                            fontWeight: 'bold',
                                        }}
                                    >
                                        {storageConfig.userFullName}
                                    </Typography>
                                </>
                            ) : (
                                <CircularProgress/>
                            )}
                        </Paper>
                    </Grid>
                    {nAuditoriasRealizadasNoSincronizadas > 0 && (
                        <Grid item xs={12} sm={12} md={12}>
                            <Paper elevation={3}>
                                <Alert severity="warning">
                                    Existen {nAuditoriasRealizadasNoSincronizadas} auditorias sin sincronizar
                                    <br/>
                                    <Link to="/auditoria/realizada/lista/">
                                        <Button
                                            variant="contained"
                                            color="primary"
                                            alt="Ver auditorias realizadas"
                                            size="small"
                                            startIcon={<ArrowRightIcon/>}
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
                                    fontWeight: 'bold',
                                }}
                            >
                                <>{nAuditoriasRealizadas !== undefined ? nAuditoriasRealizadas : <CircularProgress/>}</>
                            </Typography>
                            <Container
                                sx={{
                                    p: 2,
                                    backgroundColor: 'primary.main',
                                    borderBottomLeftRadius: 4,
                                    borderBottomRightRadius: 4,
                                }}
                            >
                                <Typography variant="body1" align="center" color="white">
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
                                    fontWeight: 'bold',
                                }}
                            >
                                <>{nCuasiAccidentesRealizados !== undefined ? nCuasiAccidentesRealizados :
                                    <CircularProgress/>}</>
                            </Typography>
                            <Container
                                sx={{
                                    p: 2,
                                    backgroundColor: 'primary.main',
                                    borderBottomLeftRadius: 4,
                                    borderBottomRightRadius: 4,
                                }}
                            >
                                <Typography variant="body1" align="center" color="white">
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
