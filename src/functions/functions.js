export const initStorage = () => {
  if (!localStorage.getItem("config")) {
    localStorage.setItem(
      "config",
      JSON.stringify({
        server: null,
        loginStatus: false,
        user: null,
        userID: null,
        unidades: null,
        empresa: null,
        empresaID: null,
      })
    );
  }
  if (!localStorage.getItem("data")) {
    localStorage.setItem("data", JSON.stringify({}));
  }
  if (!localStorage.getItem("auditorias")) {
    localStorage.setItem("auditorias", JSON.stringify([]));
  }
};

export const getStorageConfig = () => {
  const storageconfig = localStorage.getItem("config");
  if (storageconfig) {
    return JSON.parse(storageconfig);
  } else {
    const config = {
      server: null,
      loginStatus: false,
      user: null,
      userID: null,
      unidades: null,
      empresa: null,
      empresaID: null,
    };
    localStorage.setItem("config", JSON.stringify(config));
    return config;
  }
};

export const getStorageData = () => {
  const storageData = localStorage.getItem("data");
  if (storageData) {
    return JSON.parse(storageData);
  } else {
    const data = {};
    localStorage.setItem("data", JSON.stringify(data));
    return data;
  }
};

export const getStorageAuditorias = () => {
  const storageAuditorias = localStorage.getItem("auditorias");
  if (storageAuditorias) {
    return JSON.parse(storageAuditorias);
  } else {
    const auditorias = [];
    localStorage.setItem("auditorias", JSON.stringify(auditorias));
    return auditorias;
  }
};
