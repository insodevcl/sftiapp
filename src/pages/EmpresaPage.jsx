import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { getStorageConfig } from "../functions/functions";

export function EmpresaPage() {
  const [unidades, setUnidades] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    document.title = "Seleccionar Empresa";
    const configData = getStorageConfig();
    setUnidades(configData.unidades);
  }, []);

  const setEmpresa = (empresaID) => {
    const configData = getStorageConfig();
    configData.empresaID = empresaID;
    localStorage.setItem("config", JSON.stringify(configData));
    return navigate("/");
  };

  return (
    <div>
      <h1>EmpresaPage</h1>
      <ul>
        {unidades.map((unidad) => (
          <li key={unidad.id}>
            {unidad.nombre}
            <ul>
              {unidad.empresas.map((empresa) => (
                <li key={empresa.id} onClick={setEmpresa(empresa.id)}>
                  {empresa.nombre}
                </li>
              ))}
            </ul>
          </li>
        ))}
      </ul>
    </div>
  );
}
