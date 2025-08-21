import {getApiHeaders} from './functions';
// const httpProtocol = 'https';
const httpProtocol = 'http';


export const apiServers = () => {
    return fetch(
        'https://script.google.com/macros/s/AKfycbzxd4L3kJuxoj50zPMOUu242wUHm2ubo5wlF7vQT2CwCtMGfHyQu7jJgOoUuUgEWAwBgw/exec'
    );
};

export const apiToken = (serverUrl, username, password) => {
    return fetch(
        `${httpProtocol}://${serverUrl}/api/user/token/?username=${username}&password=${password}`
    );
};

export const apiData = (serverUrl) => {
    return fetch(
        `${httpProtocol}://${serverUrl}/api/sfti/data/`
    );
}

export const apiUser = (user_id) => {
    const {serverUrl, headers} = getApiHeaders();
    if (!user_id) {
        throw new Error('User ID is required to fetch user data.');
    }
    return fetch(`${httpProtocol}://${serverUrl}/api/user/${user_id}/`, {
        headers: headers,
        method: 'GET',
    });
};

export const apiEmpresa = async () => {
    const {serverUrl, headers} = getApiHeaders();
    return fetch(`${httpProtocol}://${serverUrl}/api/empresa/`, {
        headers: headers,
        method: 'GET',
    });
}

export const apiSucursal = async () => {
    const {serverUrl, empresaDni, headers} = getApiHeaders();
    return fetch(`${httpProtocol}://${serverUrl}/api/empresa/${empresaDni}/sucursal/`, {
        headers: headers,
        method: 'GET',
    });
}

export const apiFaena = async () => {
    const {serverUrl, empresaDni, headers} = getApiHeaders();
    return fetch(`${httpProtocol}://${serverUrl}/api/empresa/${empresaDni}/faena/`, {
        headers: headers,
        method: 'GET',
    });
}

export const apiArea = async () => {
    const {serverUrl, empresaDni, headers} = getApiHeaders();
    return fetch(`${httpProtocol}://${serverUrl}/api/empresa/${empresaDni}/area/`, {
        headers: headers,
        method: 'GET',
    });
}

export const apiLugar = async () => {
    const {serverUrl, empresaDni, headers} = getApiHeaders();
    return fetch(`${httpProtocol}://${serverUrl}/api/empresa/${empresaDni}/lugar/`, {
        headers: headers,
        method: 'GET',
    });
}

export const apiTrabajador = async () => {
    const {serverUrl, empresaDni, headers} = getApiHeaders();
    return fetch(`${httpProtocol}://${serverUrl}/api/app/empresa/${empresaDni}/trabajador/`, {
        headers: headers,
        method: 'GET',
    });
}

export const apiContratista = async () => {
    const {serverUrl, empresaDni, headers} = getApiHeaders();
    return fetch(`${httpProtocol}://${serverUrl}/api/app/empresa/${empresaDni}/contratista/`, {
        headers: headers,
        method: 'GET',
    });
}

export const apiEvaluacion = async () => {
    const {serverUrl, empresaDni, headers} = getApiHeaders();
    return fetch(`${httpProtocol}://${serverUrl}/api/app/empresa/${empresaDni}/evaluacion/`, {
        headers: headers,
        method: 'GET',
    });
}

export const apiAuditoria = async () => {
    const {serverUrl, empresaDni, headers} = getApiHeaders();
    return fetch(`${httpProtocol}://${serverUrl}/api/empresa/${empresaDni}/auditoria/?page_size=20`, {
        headers: headers,
        method: 'GET',
    });
}

// Versión anterior
export const apiLogin = (serverUrl, username, password) => {
    return fetch(`${httpProtocol}://${serverUrl}/api/login/?username=${username}&password=${password}`);
};

export const apiAuditoriaPost = (serverUrl, data) => {
    return fetch(`${httpProtocol}://${serverUrl}/api/app/auditoria/`, {
        method: 'POST',
        body: JSON.stringify(data),
    });
};
