import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
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
} from "@mui/material";
import DnsIcon from "@mui/icons-material/Dns";
import AccountCircle from "@mui/icons-material/AccountCircle";
import LockIcon from "@mui/icons-material/Lock";
import LoginIcon from "@mui/icons-material/Login";
import Visibility from "@mui/icons-material/Visibility";
import VisibilityOff from "@mui/icons-material/VisibilityOff";
import { getApiServers, getApiLogin } from "../functions/api";

export function ConfigPage() {
    const [servers, setServers] = useState([]);
    const [open, setOpen] = useState(false);
    const [showPassword, setShowPassword] = useState(false);
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        document.title = "Configuración";
        const loadServer = async () => {
            setOpen(true);
            const response = await getApiServers();
            setServers(response.data);
            setOpen(false);
        };

        loadServer();
    }, []);

    const findServer = (id) => {
        return servers.find((x) => x.id === parseInt(id));
    };

    const onSubmit = handleSubmit(async (data) => {
        const server = findServer(data.server);
        try {
            const response = await getApiLogin(
                server.url,
                data.username,
                data.password
            );
            if (response.data.status) {
                const storageconfig = localStorage.getItem("config");
                const configData = JSON.parse(storageconfig);
                configData.server = server.url;
                configData.loginStatus = true;
                configData.user = response.data.data.user_fullname;
                configData.userID = response.data.data.id;
                configData.unidades = response.data.data.unidades;
                localStorage.setItem("config", JSON.stringify(configData));
                return navigate("/");
            } else {
                toast.error("Usuario o contraseña incorrectos");
            }
        } catch (error) {
            toast.error("Error al conectar con el servidor");
        }
    });

    const handleClickShowPassword = () => setShowPassword((show) => !show);

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "top",
                alignItems: "center",
                height: "100vh",
                py: 10,
                px: 4,
                background:
                    "linear-gradient(135deg, #010b02, #010b02, #59185E, #59185E)",
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
                <InputLabel id="id_label_server">Servidor</InputLabel>
                <Select
                    labelId="id_label_server"
                    fullWidth
                    defaultValue={""}
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
                                <DnsIcon />
                                {server ? server.url : "----------"}
                            </Box>
                        );
                    }}
                    sx={{
                        mb: 2,
                        background: "white",
                        color: "text.secondary"
                    }}
                    {...register("server", { required: true })}
                >
                    <MenuItem value="">----------</MenuItem>
                    {servers.map((server) => (
                        <MenuItem value={server.id} key={server.id}>
                            {server.url}
                        </MenuItem>
                    ))}
                </Select>
                {errors.server && (
                    <Alert severity="error">Este campo es requerido</Alert>
                )}
                <TextField
                    type="text"
                    fullWidth
                    variant="filled"
                    label="Usuario"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <AccountCircle />
                            </InputAdornment>
                        ),
                    }}
                    sx={{
                        mb: 2,
                        background: "white",
                        color: "text.secondary",
                    }}
                    {...register("username", { required: true })}
                />
                {errors.username && (
                    <Alert severity="error">Este campo es requerido</Alert>
                )}
                <TextField
                    type={showPassword ? "text" : "password"}
                    fullWidth
                    variant="filled"
                    label="Contraseña"
                    InputProps={{
                        startAdornment: (
                            <InputAdornment position="start">
                                <LockIcon />
                            </InputAdornment>
                        ),
                        endAdornment: (
                            <InputAdornment position="end">
                                <IconButton
                                    aria-label="toggle password visibility"
                                    onClick={handleClickShowPassword}
                                    onMouseDown={handleClickShowPassword}
                                >
                                    {showPassword ? (
                                        <Visibility />
                                    ) : (
                                        <VisibilityOff />
                                    )}
                                </IconButton>
                            </InputAdornment>
                        ),
                    }}
                    sx={{
                        mb: 2,
                        background: "white",
                        color: "text.secondary",
                    }}
                    {...register("password", { required: true })}
                />
                {errors.password && (
                    <Alert severity="error">Este campo es requerido</Alert>
                )}
                <Button
                    variant="contained"
                    fullWidth
                    endIcon={<LoginIcon />}
                    type="submit"
                    sx={{
                        mt: 3,
                        bgcolor: "white",
                        color: "black",
                        hover: {
                            bgcolor: "primary.main",
                            color: "white",
                        },
                        active: {
                            bgcolor: "primary.main",
                            color: "white",
                        },
                    }}
                >
                    Ingresar
                </Button>
            </form>
            <Backdrop
                sx={{
                    color: "white",
                    zIndex: (theme) => theme.zIndex.drawer + 1,
                }}
                open={open}
            >
                <CircularProgress color="inherit" />
            </Backdrop>
        </Box>
    );
}
