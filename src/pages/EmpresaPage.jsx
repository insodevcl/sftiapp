import {useEffect, useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {toast} from 'react-toastify';
import {Box, Backdrop, CircularProgress, Typography, Avatar} from '@mui/material';
import {getConfigFromStorage, setConfigToStorage, formatDni, getShortCompanyName, updateData} from '../functions/functions';

export function EmpresaPage() {
    const navigate = useNavigate();
    const [isOpenLoading, setOpenLoading] = useState(false);
    const storageConfig = getConfigFromStorage();

    useEffect(() => {
        document.title = 'Seleccionar empresa';
        if (!storageConfig.userToken) return navigate('/config');
    }, []);

    const handleSubmit = (e) => {
        const empresaID = e.currentTarget.getAttribute('data-id');
        storageConfig?.unidades?.map((unidad) => {
            unidad?.empresas?.map(async (empresa) => {
                if (empresa.id === parseInt(empresaID)) {
                    storageConfig.empresaID = empresa.id;
                    storageConfig.empresa = empresa.nombre;
                    storageConfig.empresaDni = formatDni(empresa.rut);
                    storageConfig.empresaLogo = empresa.logo;
                    setConfigToStorage(storageConfig);
                    setOpenLoading(true);
                    toast.info('Descargando datos de la empresa seleccionada, por favor espere...');
                    const statusUpdateData = await updateData();
                    if (statusUpdateData) {
                        setOpenLoading(false);
                        navigate('/');
                    } else {
                        toast.error('Error al cargar los datos. Por favor, intente más tarde.');
                        setOpenLoading(false);
                    }
                }
                return null;
            });
            return null;
        });
        return null;
    };

    return (
        <Box
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "start",
                alignItems: "start",
                minHeight: "100vh",
                p: 2,
                background: "linear-gradient(135deg, #010b02, #010b02, #59185E, #59185E)",
            }}
        >
            <Typography variant="h5" align="center" color="white" sx={{mb: 2}}>
                Seleccione la empresa con la cual trabajará
            </Typography>
            {storageConfig?.unidades?.map((unidad) => (
                <Box
                    key={unidad.id}
                    sx={{
                        width: "100%",
                        mb: 2,
                    }}
                >
                    <Typography variant="h5" sx={{color: "white"}}>
                        {unidad.nombre}
                    </Typography>
                    <Box
                        sx={{
                            display: "grid",
                            gridTemplateColumns: "repeat(4, 1fr)",
                            gap: 2,
                            py: 1,
                            px: 2,
                            backgroundColor: "rgba(255, 255, 255, 0.34)",
                            borderRadius: 2,
                        }}
                    >
                        {unidad?.empresas?.map((empresa) => (
                            <Box
                                key={empresa.id}
                                sx={{
                                    display: "flex",
                                    flexDirection: "column",
                                    justifyContent: "start",
                                    alignItems: "center",
                                    gap: 1,
                                }}
                            >
                                <Avatar
                                    key={empresa.id}
                                    data-id={empresa.id}
                                    alt={empresa.nombre}
                                    src={empresa.logo}
                                    onClick={handleSubmit}
                                    sx={{
                                        width: 64,
                                        height: 64,
                                        backgroundColor: "white",
                                        color: "black",
                                        cursor: "pointer",
                                    }}
                                    imgProps={{
                                        style: {
                                            objectFit: "contain",
                                            width: "95%",
                                        },
                                    }}
                                >
                                    {getShortCompanyName(empresa.nombre)}
                                </Avatar>
                                <Typography
                                    variant="caption"
                                    sx={{
                                        textAlign: "center",
                                        color: "white",
                                    }}
                                >
                                    {empresa.nombre}
                                </Typography>
                            </Box>
                        ))}
                    </Box>
                </Box>
            ))}
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
