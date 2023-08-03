import axios from "axios";

export const getApiServers = () => {
  return axios.get(
    "https://script.google.com/macros/s/AKfycbxmhLmVuwNtMfp_t4gGqQrtQEIdtBhL3rvFMC2ja_U8LScXMdPIiASp17Cq8mwcYYpS-Q/exec"
  );
};

export const getApiLogin = (server, username, password) => {
  return axios.get(
    `https://${server}/api/login/?username=${username}&password=${password}`
  );
};


export const getApiData = (server, empresa_id) => {
    return axios.get(`https://${server}/api/app/data/${empresa_id}/`);
};