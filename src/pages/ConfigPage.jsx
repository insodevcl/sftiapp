import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {useForm} from 'react-hook-form';
import {toast} from 'react-toastify';
import {
    Backdrop,
    CircularProgress,
    Box,
    Select,
    InputLabel,
    MenuItem,
    TextField,
    InputAdornment,
    Button,
    IconButton,
    Alert,
} from '@mui/material';
import DnsIcon from '@mui/icons-material/Dns';
import AccountCircle from '@mui/icons-material/AccountCircle';
import LockIcon from '@mui/icons-material/Lock';
import LoginIcon from '@mui/icons-material/Login';
import Visibility from '@mui/icons-material/Visibility';
import VisibilityOff from '@mui/icons-material/VisibilityOff';
import {getConfigFromStorage, setConfigToStorage} from '../functions/functions';
import {apiServers, apiToken, apiUser} from '../functions/api';

export function ConfigPage() {
    const [servers, setServers] = useState([]);
    const [isOpenLoading, setOpenLoading] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: {errors},
    } = useForm();

    useEffect(() => {
        document.title = 'Configuración';
        const loadServer = async () => {
            setOpenLoading(true);
            await apiServers()
                .then((response) => response.json())
                .then((data) => setServers(data))
                .catch((error) => {
                    console.log(error);
                    toast.error('Error al conectar con el servidor. Por favor, intente más tarde.');
                });
            setOpenLoading(false);
        };
        loadServer();
    }, []);

    const findServer = (id) => {
        return servers.find((x) => x.id === parseInt(id));
    };

    const onSubmit = handleSubmit(async (data) => {
        const server = findServer(data.server);
        await apiToken(server.url, data.username, data.password)
            .then((response) => {
                if (response.status === 401) {
                    toast.error('Usuario o contraseña incorrectos');
                    return;
                }
                return response.json();
            })
            .then(async (data) => {
                const storageConfig = getConfigFromStorage();
                storageConfig.userID = data.user_id;
                storageConfig.userToken = data.token;
                storageConfig.serverUrl = server.url;
                setConfigToStorage(storageConfig);
                await apiUser(data.user_id)
                    .then((response) => response.json())
                    .then((data) => {
                        storageConfig.userName = data.username;
                        storageConfig.userFullName = `${data.first_name} ${data.last_name}`;
                        storageConfig.userEmail = data.email;
                        storageConfig.loginStatus = true;
                        storageConfig.unidades = data.unidades;
                        setConfigToStorage(storageConfig);
                        toast.success('¡Configuración guardada correctamente!');
                        navigate('/empresa');
                    })
                    .catch((error) => {
                        console.error('Error al obtener los datos del usuario:', error);
                        toast.error('Error al obtener los datos del usuario. Por favor, intente más tarde.');
                    });
            })
            .catch((error) => {
                toast.error('Error al conectar con el servidor. Por favor, intente más tarde.');
                console.error(error);
            });
    });

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "start",
                alignItems: "center",
                height: "100vh",
                py: 10,
                px: 4,
                background: "linear-gradient(135deg, #010b02, #010b02, #59185E, #59185E)",
            }}
        >
            <Box
                sx={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    mb: 5,
                }}
            >
                <img
                    src="https://insodev-estaticos.s3.amazonaws.com/logos/sfti/app/logo-texto-blanco-app.png"
                    alt="logo"
                    height="96"
                />
            </Box>
            <form onSubmit={onSubmit}>
                <InputLabel
                    id="id_label_server"
                    sx={{
                        color: "white",
                        mb: 1
                    }}
                >
                    Servidor
                </InputLabel>
                <Select
                    labelId="id_label_server"
                    fullWidth
                    defaultValue={''}
                    displayEmpty
                    renderValue={(value) => {
                        const server = findServer(value);
                        return (
                            <Box
                                sx={{
                                    display: "flex",
                                    gap: 1,
                                }}
                            >
                                <DnsIcon/>
                                {server ? server.url : "----------"}
                            </Box>
                        );
                    }}
                    sx={{
                        mb: 2,
                        background: "white",
                        color: "text.secondary",
                    }}
                    {...register("server", {
                        required: true
                    })}
                >
                    <MenuItem value="">----------</MenuItem>
                    {servers?.map((server) => (
                        <MenuItem
                            key={server.id}
                            value={server.id}
                        >
                            {server.url}
                        </MenuItem>
                    ))}
                </Select>
                {errors.server && <Alert severity="error">Este campo es requerido</Alert>}
                <TextField
                    type="text"
                    fullWidth
                    variant="filled"
                    label="Usuario"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <AccountCircle/>
                            </InputAdornment>
                        ),
                    }}
                    sx={{
                        mb: 2,
                        background: "white",
                        color: "text.secondary",
                    }}
                    {...register("username", {
                        required: true
                    })}
                />
                {errors.username && <Alert severity="error">Este campo es requerido</Alert>}
                <TextField
                    type={showPassword ? "text" : "password"}
                    fullWidth
                    variant="filled"
                    label="Contraseña"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <LockIcon/>
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleClickShowPassword}
                                >
                                    {showPassword ? <Visibility/> : <VisibilityOff/>}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                    sx={{
                        mb: 2,
                        background: "white",
                        color: "text.secondary",
                    }}
                    {...register("password", {
                        required: true
                    })}
                />
                {errors.password && <Alert severity="error">Este campo es requerido</Alert>}
                <Button
                    variant="contained"
                    fullWidth
                    endIcon={<LoginIcon/>}
                    type="submit"
                    sx={{
                        mt: 3,
                        backgroundColor: "white",
                        color: "black",
                        "&:hover": {
                            backgroundColor: "primary.main",
                            color: "white",
                        },
                        "&:active": {
                            backgroundColor: "primary.main",
                            color: "white",
                        },
                    }}
                >
                    Ingresar
                </Button>
            </form>
            <Backdrop
                open={isOpenLoading}
                sx={{
                    color: "white",
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
            >
                <CircularProgress color="inherit"/>
            </Backdrop>
        </Box>
    );
}
