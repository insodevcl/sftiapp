import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getStorageData } from "../functions/functions";

export function ListAuditoriaDisponiblePage() {
  const [auditorias, setAuditorias] = useState([]);

  useEffect(() => {
    document.title = "Auditorias disponibles";
    const storageData = getStorageData();
    setAuditorias(storageData.auditorias);
  }, []);

  return (
    <div>
      <h1>Listado de auditorias disponibles</h1>
      {auditorias.map((auditoria) => (
        <div key={auditoria.id}>
          <b>{auditoria.nombre}</b>
          <p>
            <b>Descripción: </b>
            {auditoria.descripcion}
          </p>
          <p>
            <b>Tipo: </b>
            {auditoria.tipo}
          </p>
          <p>
            <b>Categoría: </b>
            {!auditoria.categoria ? "No aplica" : null}
            {auditoria.categoria}
          </p>
          <Link to={`/auditoria/aplica/${auditoria.id}`}>Aplicar</Link>
        </div>
      ))}
    </div>
  );
}
