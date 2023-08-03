import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { getStorageData, getStorageAuditorias } from "../functions/functions";

export function ListAuditoriaRealizadaPage() {
  const [data, setData] = useState([]);
  const [auditoriasRealizadas, setAuditoriasRealizadas] = useState([]);

  useEffect(() => {
    document.title = "Auditorias realizadas";
    const storageData = getStorageData();
    setData(storageData);
    const storageAuditorias = getStorageAuditorias();
    setAuditoriasRealizadas(storageAuditorias);
  }, []);

  const renderAuditoriasRealizadas = (auditoriaRealizada) => {
    const auditoria = data.auditorias.find(
      (auditoria) => auditoria.id === auditoriaRealizada.auditoria_id
    );
    let subarea = undefined;
    data.areas.map((area) => {
      const encontrada = area.subareas.find(
        (subarea) => subarea.id === auditoriaRealizada.subarea_id
      );
      if (encontrada) subarea = encontrada;
    });
    return (
      <div key={auditoriaRealizada.id}>
        <p>
          {auditoriaRealizada.sync && (
            <span style={{ color: "green" }}>Sincronizada</span>
          )}
          {!auditoriaRealizada.sync && (
            <span style={{ color: "red" }}>No sincronizada</span>
          )}
        </p>
        <p>
          <b>Fecha: </b>
          {auditoriaRealizada.fecha}
        </p>
        <p>
          <b>Nombre: </b>
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
        <p>
          <b>Subárea: </b>
          {subarea.nombre}
        </p>
        <Link to={`/auditoria/ver/${auditoriaRealizada.id}`}>Ver</Link>
      </div>
    );
  };

  return (
    <div>
      <h1>Listado de auditorias realizadas</h1>
      {auditoriasRealizadas.map((auditoriaRealizada) =>
        renderAuditoriasRealizadas(auditoriaRealizada)
      )}
    </div>
  );
}
