import {
    apiData,
    apiSucursal,
    apiFaena,
    apiArea,
    apiLugar,
    apiContratista,
    apiTrabajador,
    apiEvaluacion,
    apiAuditoria
} from './api.js';

export const initializeStorage = () => {
    if (!localStorage.getItem('config')) {
        localStorage.setItem(
            'config',
            JSON.stringify({
                serverUrl: null,
                userID: null,
                userName: null,
                userFullName: null,
                userEmail: null,
                userToken: null,
                loginStatus: false,
                unidades: null,
                empresa: null,
                empresaID: null,
                empresaDni: null,
                empresaLogo: null,
                // Versión anterior
                user: null,
                server: null,
            })
        );
    }
    if (!localStorage.getItem('todo_criticidad')) {
        localStorage.setItem('todo_criticidad', JSON.stringify([]));
    }
    if (!localStorage.getItem('peligro_categoria')) {
        localStorage.setItem('peligro_categoria', JSON.stringify([]));
    }
    if (!localStorage.getItem('peligro')) {
        localStorage.setItem('peligro', JSON.stringify([]));
    }
    if (!localStorage.getItem('evaluacion_tipo')) {
        localStorage.setItem('evaluacion_tipo', JSON.stringify([]));
    }
    if (!localStorage.getItem('evaluacion_especifica_categoria')) {
        localStorage.setItem('evaluacion_especifica_categoria', JSON.stringify([]));
    }
    if (!localStorage.getItem('evaluacion_estado')) {
        localStorage.setItem('evaluacion_estado', JSON.stringify([]));
    }
    if (!localStorage.getItem('evaluacion_pregunta_tipo')) {
        localStorage.setItem('evaluacion_pregunta_tipo', JSON.stringify([]));
    }
    if (!localStorage.getItem('trabajador')) {
        localStorage.setItem('trabajador', JSON.stringify([]));
    }
    if (!localStorage.getItem('sucursal')) {
        localStorage.setItem('sucursal', JSON.stringify([]));
    }
    if (!localStorage.getItem('faena')) {
        localStorage.setItem('faena', JSON.stringify([]));
    }
    if (!localStorage.getItem('contratista')) {
        localStorage.setItem('contratista', JSON.stringify([]));
    }
    if (!localStorage.getItem('area')) {
        localStorage.setItem('area', JSON.stringify([]));
    }
    if (!localStorage.getItem('lugar')) {
        localStorage.setItem('lugar', JSON.stringify([]));
    }
    if (!localStorage.getItem('herramienta')) {
        localStorage.setItem('herramienta', JSON.stringify([]));
    }
    if (!localStorage.getItem('equipo')) {
        localStorage.setItem('equipo', JSON.stringify([]));
    }
    if (!localStorage.getItem('maquinaria')) {
        localStorage.setItem('maquinaria', JSON.stringify([]));
    }
    if (!localStorage.getItem('transporte')) {
        localStorage.setItem('transporte', JSON.stringify([]));
    }
    if (!localStorage.getItem('instalacion')) {
        localStorage.setItem('instalacion', JSON.stringify([]));
    }
    if (!localStorage.getItem('equipoEmergencia')) {
        localStorage.setItem('equipoEmergencia', JSON.stringify([]));
    }
    if (!localStorage.getItem('epp')) {
        localStorage.setItem('epp', JSON.stringify([]));
    }
    if (!localStorage.getItem('evaluacion')) {
        localStorage.setItem('evaluacion', JSON.stringify([]));
    }
    if (!localStorage.getItem('auditoria')) {
        localStorage.setItem('auditoria', JSON.stringify([]));
    }
    // Versión anterior
    if (!localStorage.getItem('auditorias')) {
        localStorage.setItem('auditorias', JSON.stringify([]));
    }
    if (!localStorage.getItem('data')) {
        localStorage.setItem('data', JSON.stringify({}));
    }
};

export const getConfigFromStorage = () => {
    const storageConfig = localStorage.getItem('config');
    if (storageConfig) {
        return JSON.parse(storageConfig);
    } else {
        const config = {
            serverUrl: null,
            userID: null,
            userName: null,
            userFullName: null,
            userEmail: null,
            userToken: null,
            loginStatus: false,
            unidades: null,
            empresa: null,
            empresaID: null,
            empresaDni: null,
            empresaLogo: null,
            // Versión anterior
            user: null,
            server: null,
        };
        localStorage.setItem('config', JSON.stringify(config));
        return config;
    }
};

export const setConfigToStorage = (config) => {
    config = {
        ...getConfigFromStorage(),
        ...config,
    };
    localStorage.setItem('config', JSON.stringify(config));
};

export const getApiHeaders = () => {
    const storageConfig = getConfigFromStorage();
    if (!storageConfig.serverUrl || !storageConfig.userToken) {
        throw new Error('Server URL or user token is not set in storage config.');
    }
    return {
        serverUrl: storageConfig.serverUrl,
        empresaDni: storageConfig.empresaDni,
        headers: {
            'Content-Type': 'application/json',
            Authorization: storageConfig.userToken,
        },
    };
};

export const stringToLocalDateTime = (string) => {
    const date = new Date(string);
    return date.toLocaleString().replace(',', '');
};

export const formatDni = (dni) => {
    if (!dni) return '';
    dni = dni.toUpperCase();
    dni = dni.replace(/[^0-9, K]+/g, '');
    return dni;
};

export const getShortCompanyName = (name) => {
    if (!name) return '';
    const words = name.toUpperCase().split(' ');
    if (words.length > 1) {
        return `${words[0].substring(0, 1)} ${words[1].substring(0, 1)}`;
    }
    return `${words[0].substring(0, 1)} ${words[0].substring(1, 2)}`;
};

export const updateData = () => {
    const storageConfig = getConfigFromStorage();
    return Promise.all([
        apiData(storageConfig.serverUrl),
        apiSucursal(),
        apiFaena(),
        apiArea(),
        apiLugar(),
        apiTrabajador(),
        apiContratista(),
        apiEvaluacion(),
    ])
        .then(async (
                [
                    dataResponse,
                    sucursalResponse,
                    faenaResponse,
                    areaResponse,
                    lugarResponse,
                    trabajadorResponse,
                    contratistaResponse,
                    evaluacionResponse
                ]
            ) => {
                await dataResponse.json().then((data) => {
                    localStorage.setItem('data', JSON.stringify(data));
                    localStorage.setItem('todo_criticidad', JSON.stringify(data.todo_criticidad));
                    localStorage.setItem('peligro_categoria', JSON.stringify(data.peligro_categoria));
                    localStorage.setItem('peligro', JSON.stringify(data.peligro));
                    localStorage.setItem('evaluacion_tipo', JSON.stringify(data.evaluacion_tipo));
                    localStorage.setItem('evaluacion_especifica_categoria', JSON.stringify(data.evaluacion_especifica_categoria));
                    localStorage.setItem('evaluacion_estado', JSON.stringify(data.evaluacion_estado));
                    localStorage.setItem('evaluacion_pregunta_tipo', JSON.stringify(data.evaluacion_pregunta_tipo));
                });
                await sucursalResponse.json().then((sucursalData) => {
                    localStorage.setItem('sucursal', JSON.stringify(sucursalData));
                });
                await faenaResponse.json().then((faenaData) => {
                    localStorage.setItem('faena', JSON.stringify(faenaData));
                });
                await areaResponse.json().then((areaData) => {
                    localStorage.setItem('area', JSON.stringify(areaData));
                });
                await lugarResponse.json().then((lugarData) => {
                    localStorage.setItem('lugar', JSON.stringify(lugarData));
                });
                await trabajadorResponse.json().then((trabajadorData) => {
                    localStorage.setItem('trabajador', JSON.stringify(trabajadorData));
                });
                await contratistaResponse.json().then((contratistaData) => {
                    localStorage.setItem('contratista', JSON.stringify(contratistaData));
                });
                await evaluacionResponse.json().then((evaluacionData) => {
                    localStorage.setItem('evaluacion', JSON.stringify(evaluacionData));
                });
                return true;
            }
        )
        .catch((error) => {
            console.error('Error loading data:', error);
            return false;
        });
}

export const getRealizadorFromConfig = () => {
    const storageConfig = getConfigFromStorage();
    const trabajadores = JSON.parse(localStorage.getItem('trabajador')) || [];
    return trabajadores.find((x) => x.usuario_id === storageConfig.userID) || null;
}

export const getCriticidadFromStorage = (id) => {
    if (!id) return null;
    const criticidades = JSON.parse(localStorage.getItem('todo_criticidad')) || [];
    return criticidades.find((x) => x.id === parseInt(id)) || null;
}

export const getSucursalFromStorage = (id) => {
    if (!id) return null;
    const sucursales = JSON.parse(localStorage.getItem('sucursal')) || [];
    return sucursales.find((x) => x.id === parseInt(id)) || null;
}

export const getFaenaFromStorage = (id) => {
    if (!id) return null;
    const faenas = JSON.parse(localStorage.getItem('faena')) || [];
    return faenas.find((x) => x.id === parseInt(id)) || null;
}

export const getSubAreaFromStorage = (id) => {
    if (!id) return null;
    const areas = JSON.parse(localStorage.getItem('area')) || [];
    for (const area of areas) {
        const subArea = area.subareas.find((x) => x.id === parseInt(id));
        if (subArea) return subArea;
    }
    return null;
}

export const getLugarFromStorage = (id) => {
    if (!id) return null;
    const lugares = JSON.parse(localStorage.getItem('lugar')) || [];
    return lugares.find((x) => x.id === parseInt(id)) || null;
}

export const getTrabajadorFromStorage = (id) => {
    if (!id) return null;
    const trabajadores = JSON.parse(localStorage.getItem('trabajador')) || [];
    return trabajadores.find((x) => x.id === parseInt(id)) || null;
}

export const getContratistaFromStorage = (id) => {
    if (!id) return null;
    const contratistas = JSON.parse(localStorage.getItem('contratista')) || [];
    return contratistas.find((x) => x.id === parseInt(id)) || null;
}

export const getHerramientaFromStorage = (id) => {
    if (!id) return null;
    const herramientas = JSON.parse(localStorage.getItem('herramienta')) || [];
    return herramientas.find((x) => x.id === parseInt(id)) || null;
}

export const getEquipoFromStorage = (id) => {
    if (!id) return null;
    const equipos = JSON.parse(localStorage.getItem('equipo')) || [];
    return equipos.find((x) => x.id === parseInt(id)) || null;
}

export const getMaquinariaFromStorage = (id) => {
    if (!id) return null;
    const maquinarias = JSON.parse(localStorage.getItem('maquinaria')) || [];
    return maquinarias.find((x) => x.id === parseInt(id)) || null;
}

export const getTransporteFromStorage = (id) => {
    if (!id) return null;
    const transportes = JSON.parse(localStorage.getItem('transporte')) || [];
    return transportes.find((x) => x.id === parseInt(id)) || null;
}

export const getInstalacionFromStorage = (id) => {
    if (!id) return null;
    const instalaciones = JSON.parse(localStorage.getItem('instalacion')) || [];
    return instalaciones.find((x) => x.id === parseInt(id)) || null;
}

export const getEquipoEmergenciaFromStorage = (id) => {
    if (!id) return null;
    const equiposEmergencia = JSON.parse(localStorage.getItem('equipo_emergencia')) || [];
    return equiposEmergencia.find((x) => x.id === parseInt(id)) || null;
}

export const getEvaluacionFromStorage = (id) => {
    if (!id) return null;
    const evaluaciones = JSON.parse(localStorage.getItem('evaluacion')) || [];
    return evaluaciones.find((x) => x.id === parseInt(id)) || null;
}

export const getAuditoriaFromStorage = (id) => {
    if (!id) return null;
    const auditorias = JSON.parse(localStorage.getItem('auditoria')) || [];
    return auditorias.find((x) => x.id === parseInt(id)) || null;
}

export const getPreguntaForEvaluacionFromStorage = (evaluacion_id, pregunta_id) => {
    if (!evaluacion_id || !pregunta_id) return null;
    const evaluaciones = JSON.parse(localStorage.getItem('evaluacion')) || [];
    const evaluacion = evaluaciones.find((x) => x.id === evaluacion_id);
    if (evaluacion) {
        for (const grupo of evaluacion.grupos) {
            const pregunta = grupo.preguntas.find((x) => x.id === pregunta_id);
            if (pregunta) return pregunta;
        }
    }
    return null;
}

export const updateSyncAuditoria = (id) => {
    debugger;
    const storageAuditorias = localStorage.getItem('auditoria');
    if (storageAuditorias) {
        const auditorias = JSON.parse(storageAuditorias);
        const index = auditorias.findIndex((x) => x.id === parseInt(id));
        if (index !== -1) {
            auditorias[index].sync = true;
            localStorage.setItem('auditorias', JSON.stringify(auditorias));
        }
    }
};