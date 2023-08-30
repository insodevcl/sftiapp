export const apiServers = () => {
    return fetch("https://script.google.com/macros/s/AKfycbxmhLmVuwNtMfp_t4gGqQrtQEIdtBhL3rvFMC2ja_U8LScXMdPIiASp17Cq8mwcYYpS-Q/exec");
};

export const apiLogin = (server, username, password) => {
    return fetch(`https://${server}/api/login/?username=${username}&password=${password}`);
};

export const apiData = (server, empresa_id) => {
    return fetch(`https://${server}/api/app/data/${empresa_id}/`);
};

export const apiAuditoria = (server, data) => {
    return fetch(`https://${server}/api/app/auditoria/`, {
        method: "POST",
        body: JSON.stringify(data),
    });
};
