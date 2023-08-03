import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import {
  getStorageConfig,
  getStorageData,
  getStorageAuditorias,
} from "../functions/functions";

export function NewAuditoriaPage() {
  const navigate = useNavigate();
  const [auditoria, setAuditoria] = useState({});
  const [observaciones, setObservaciones] = useState([]);
  const [respuestas, setRespuestas] = useState([]);
  const [tareas, setTareas] = useState([]);
  const { id } = useParams();
  const storageConfig = getStorageConfig();
  const storageData = getStorageData();
  const storageAuditorias = getStorageAuditorias();
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  useEffect(() => {
    document.title = "Nueva Auditoría";
    setAuditoria(storageData.auditorias.find((x) => x.id === parseInt(id)));
  }, []);

  const onSubmit = handleSubmit((data) => {
    data["fecha"] = new Date().toJSON();
    data["user_id"] = storageConfig.userID;
    data["empresa_id"] = storageConfig.empresaID;
    data["respuestas"] = respuestas;
    data["observaciones"] = observaciones;
    data["tareas"] = tareas;
    data["auditoria_id"] = auditoria.id;
    data["sync"] = false;
    Object.keys(data).map((x) => {
      if (x.startsWith("respuesta_")) {
        delete data[x];
      }
    });
    Object.keys(data).map((x) => {
      if (x.startsWith("observacion_")) {
        delete data[x];
      }
    });
    Object.keys(data).map((x) => {
      if (x.startsWith("tarea_")) {
        delete data[x];
      }
    });
    Object.keys(data).map((x) => {
      if (x.startsWith("descripcion_")) {
        delete data[x];
      }
    });
    Object.keys(data).map((x) => {
      if (x.startsWith("supervisor_")) {
        delete data[x];
      }
    });
    Object.keys(data).map((x) => {
      if (x.startsWith("responsable_")) {
        delete data[x];
      }
    });
    Object.keys(data).map((x) => {
      if (x.startsWith("criticidad_")) {
        delete data[x];
      }
    });
    Object.keys(data).map((x) => {
      if (x.startsWith("fecha_cierre_")) {
        delete data[x];
      }
    });
    storageAuditorias.push(data);
    localStorage.setItem("auditorias", JSON.stringify(storageAuditorias));
    toast.success("Auditoría guardada");
    return navigate("/");
  });

  const getReference = (id) => {
    const pregunta_id = id;
    let pregunta = { referencia: "" };
    auditoria.grupos.map((grupo) => {
      if (grupo.preguntas.find((x) => x.id === pregunta_id)) {
        pregunta = grupo.preguntas.find((x) => x.id === pregunta_id);
      }
    });
    return pregunta.referencia;
  };

  const getRespuesta = (id) => {
    const r = respuestas.find((x) => x.id === id);
    if (r) {
      return r.respuesta;
    } else {
      return 0;
    }
  };

  const updateRespuestas = (id, respuesta) => {
    const r = respuestas.find((x) => x.id === id);
    if (r) {
      r.respuesta = respuesta;
    } else {
      setRespuestas([
        ...respuestas,
        {
          id: id,
          respuesta: respuesta,
        },
      ]);
    }
  };

  const updateObservaciones = (id, observacion) => {
    const o = observaciones.find((x) => x.id === id);
    if (o) {
      o.observacion = observacion;
    } else {
      setObservaciones([
        ...observaciones,
        {
          id: id,
          observacion: observacion,
        },
      ]);
    }
  };

  const removeObservacion = (id) => {
    const oIndex = observaciones.findIndex((x) => x.id === id);
    if (oIndex > -1) {
      observaciones.splice(oIndex, 1);
      setObservaciones([...observaciones]);
    }
  };

  const updateTareas = (
    id,
    tarea,
    descripcion,
    supervisor_id,
    responsable_id,
    criticidad_id,
    fecha_cierre
  ) => {
    const t = tareas.find((x) => x.id === id);
    if (t) {
      t.tarea = tarea;
      t.descripcion = descripcion;
      t.supervisor_id = parseInt(supervisor_id);
      t.responsable_id = parseInt(responsable_id);
      t.criticidad_id = parseInt(criticidad_id);
      t.fecha_cierre = fecha_cierre;
    } else {
      setTareas([
        ...tareas,
        {
          id: id,
          tarea: tarea,
          descripcion: descripcion,
          supervisor_id: parseInt(supervisor_id),
          responsable_id: parseInt(responsable_id),
          criticidad_id: parseInt(criticidad_id),
          fecha_cierre: fecha_cierre,
        },
      ]);
    }
  };

  const removeTarea = (id) => {
    const tIndex = tareas.findIndex((x) => x.id === id);
    if (tIndex > -1) {
      tareas.splice(tIndex, 1);
      setTareas([...tareas]);
    }
  };

  const optionHandler = (e) => {
    const id = parseInt(e.target.dataset.id);
    const respuesta = parseInt(e.target.value);
    updateRespuestas(id, respuesta);
    switch (respuesta) {
      case 1:
        removeObservacion(id);
        removeTarea(id);
        break;
      case 2:
        updateObservaciones(id, "");
        updateTareas(id, "", "", undefined, undefined, undefined, "");
        break;
      case 3:
        removeObservacion(id);
        updateObservaciones(id, "");
        removeTarea(id);
        break;
      case 0:
        removeObservacion(id);
        updateObservaciones(id, "");
        removeTarea(id);
        break;
      default:
        break;
    }
  };

  const tareaHandler = (e) => {
    const _this = e.target;
    const parent = _this.parentNode.parentNode;
    const id = parseInt(parent.dataset.id);
    const tarea = parent.querySelector(`textarea[name="tarea_${id}"]`).value;
    const descripcion = parent.querySelector(
      `textarea[name="descripcion_${id}"]`
    ).value;
    const supervisor = parent.querySelector(
      `select[name="supervisor_${id}"]`
    ).value;
    const responsable = parent.querySelector(
      `select[name="responsable_${id}"]`
    ).value;
    const criticidad = parent.querySelector(
      `select[name="criticidad_${id}"]`
    ).value;
    const fecha_cierre = parent.querySelector(
      `input[name="fecha_cierre_${id}"]`
    ).value;
    updateTareas(
      id,
      tarea,
      descripcion,
      supervisor,
      responsable,
      criticidad,
      fecha_cierre
    );
  };

  const observacionHandler = (e) => {
    const _this = e.target;
    const pregunta_id = parseInt(_this.parentNode.parentNode.dataset.id);
    const observacion = _this.value;
    updateObservaciones(pregunta_id, observacion);
  };

  const renderObservacion = (observacion) => {
    return (
      <div key={observacion.id} data-id={observacion.id}>
        <p>
          <label>Cumplimiento: </label>
          <span>
            {getRespuesta(observacion.id) === 2 && `No cumple`}
            {getRespuesta(observacion.id) === 3 && `Corrección`}
            {getRespuesta(observacion.id) === 0 && `No Aplica`}
          </span>
        </p>
        <p>
          <label>Descripción: </label>
          <span>{getReference(observacion.id)}</span>
        </p>
        <p>
          <label>Observación: </label>
          <textarea
            {...register(`observacion_${observacion.id}`, {
              value: observacion.observacion,
            })}
            onChange={observacionHandler}
          ></textarea>
        </p>
        {errors[`observacion_${observacion.id}`] && (
          <div>
            <p>Este campo es requerido</p>
          </div>
        )}
      </div>
    );
  };

  const renderTarea = (tarea) => {
    return (
      <div key={tarea.id} data-id={tarea.id}>
        <p>
          <label>Tarea: </label>
          <textarea
            {...register(`tarea_${tarea.id}`, {
              required: true,
              value: tarea.tarea,
            })}
            onChange={tareaHandler}
          ></textarea>
        </p>
        {errors[`tarea_${tarea.id}`] && (
          <div>
            <p>Este campo es requerido</p>
          </div>
        )}
        <p>
          <label>Descripción: </label>
          <textarea
            {...register(`descripcion_${tarea.id}`, {
              required: true,
              value: `NO CUMPLE: ${getReference(tarea.id)}`,
            })}
            readOnly
            onChange={tareaHandler}
          ></textarea>
        </p>
        {errors[`descripcion_${tarea.id}`] && (
          <div>
            <p>Este campo es requerido</p>
          </div>
        )}
        <p>
          <label>Supervisor: </label>
          <select
            {...register(`supervisor_${tarea.id}`, {
              required: true,
              valueAsNumber: true,
              value: tarea.supervisor_id,
            })}
            onChange={tareaHandler}
          >
            <option value="">Seleccione un supervisor</option>
            {storageData.supervisores.map((supervisor) => (
              <option value={supervisor.id} key={supervisor.id}>
                {supervisor.nombre}
              </option>
            ))}
          </select>
        </p>
        {errors[`supervisor_${tarea.id}`] && (
          <div>
            <p>Este campo es requerido</p>
          </div>
        )}
        <p>
          <label>Responsable: </label>
          <select
            {...register(`responsable_${tarea.id}`, {
              required: true,
              valueAsNumber: true,
              value: tarea.responsable_id,
            })}
            onChange={tareaHandler}
          >
            <option value="">Seleccione un responsable</option>
            {storageData.responsables.map((responsable) => (
              <option value={responsable.id} key={responsable.id}>
                {responsable.nombre}
              </option>
            ))}
          </select>
        </p>
        {errors[`responsable_${tarea.id}`] && (
          <div>
            <p>Este campo es requerido</p>
          </div>
        )}
        <p>
          <label>Criticidad: </label>
          <select
            {...register(`criticidad_${tarea.id}`, {
              required: true,
              valueAsNumber: true,
              value: tarea.criticidad_id,
            })}
            onChange={tareaHandler}
          >
            <option value="">Seleccione una criticidad</option>
            {storageData.todo_criticidad.map((criticidad) => (
              <option value={criticidad.id} key={criticidad.id}>
                {criticidad.nivel}
              </option>
            ))}
          </select>
        </p>
        {errors[`criticidad_${tarea.id}`] && (
          <div>
            <p>Este campo es requerido</p>
          </div>
        )}
        <p>
          <label>Fecha de cierre: </label>
          <input
            type="date"
            {...register(`fecha_cierre_${tarea.id}`, {
              required: true,
              valueAsDate: true,
              value: tarea.fecha_cierre,
            })}
            onChange={tareaHandler}
          />
        </p>
        {errors[`fecha_cierre_${tarea.id}`] && (
          <div>
            <p>Este campo es requerido</p>
          </div>
        )}
      </div>
    );
  };

  return (
    <div>
      <form onSubmit={onSubmit}>
        <div>
          <h1>Nueva Auditoría</h1>
        </div>
        {auditoria.tipo_id === 2 && auditoria.categoria_id === 1 && (
          <div>
            <p>
              <label>Trabajador al que se aplica: </label>
              <select
                {...register("trabajador_id", {
                  required: true,
                  valueAsNumber: true,
                })}
              >
                <option value="">Seleccione un trabajador</option>
                {storageData.trabajadores.map((trabajador) => (
                  <option value={trabajador.id} key={trabajador.id}>
                    {trabajador.nombre}
                  </option>
                ))}
              </select>
            </p>
            {errors.trabajador_id && (
              <div>
                <p>Este campo es requerido</p>
              </div>
            )}
          </div>
        )}
        {auditoria.tipo_id === 2 && auditoria.categoria_id === 2 && (
          <div>
            <p>
              <label>Maquinaria a la que se le aplica: </label>
              <select
                {...register("maquinaria_id", {
                  required: true,
                  valueAsNumber: true,
                })}
              >
                <option value="">Seleccione una maquinaria</option>
                {storageData.maquinarias.map((tipo) => (
                  <optgroup label={tipo.nombre} key={tipo.id}>
                    {tipo.maquinarias.map((maquinaria) => (
                      <option value={maquinaria.id} key={maquinaria.id}>
                        {maquinaria.nombre}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </p>
            {errors.maquinaria_id && (
              <div>
                <p>Este campo es requerido</p>
              </div>
            )}
            <p>
              <label>Operador: </label>
              <select
                {...register("operador_id", {
                  required: true,
                  valueAsNumber: true,
                })}
              >
                <option value="">Seleccione un operador</option>
                {storageData.operadores.map((operador) => (
                  <option value={operador.id} key={operador.id}>
                    {operador.nombre}
                  </option>
                ))}
              </select>
            </p>
          </div>
        )}
        {auditoria.tipo_id === 2 && auditoria.categoria_id === 3 && (
          <div>
            <p>
              <label>Herramienta a la que se le aplica: </label>
              <select
                {...register("herramienta_id", {
                  required: true,
                  valueAsNumber: true,
                })}
              >
                <option value="">Seleccione una herramienta</option>
                {storageData.herramientas.map((tipo) => (
                  <optgroup label={tipo.nombre} key={tipo.id}>
                    {tipo.herramientas.map((herramienta) => (
                      <option value={herramienta.id} key={herramienta.id}>
                        {herramienta.nombre}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </p>
            {errors.herramienta_id && (
              <div>
                <p>Este campo es requerido</p>
              </div>
            )}
            <p>
              <label>Operador: </label>
              <select
                {...register("operador_id", {
                  required: true,
                  valueAsNumber: true,
                })}
              >
                <option value="">Seleccione un operador</option>
                {storageData.operadores.map((operador) => (
                  <option value={operador.id} key={operador.id}>
                    {operador.nombre}
                  </option>
                ))}
              </select>
            </p>
          </div>
        )}
        {auditoria.tipo_id === 2 && auditoria.categoria_id === 4 && (
          <div>
            <p>
              <label>Equipo al que se le aplica: </label>
              <select
                {...register("equipo_id", {
                  required: true,
                  valueAsNumber: true,
                })}
              >
                <option value="">Seleccione un equipo</option>
                {storageData.equipos.map((tipo) => (
                  <optgroup label={tipo.nombre} key={tipo.id}>
                    {tipo.equipos.map((equipo) => (
                      <option value={equipo.id} key={equipo.id}>
                        {equipo.nombre}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </p>
            {errors.equipo_id && (
              <div>
                <p>Este campo es requerido</p>
              </div>
            )}
            <p>
              <label>Operador: </label>
              <select
                {...register("operador_id", {
                  required: true,
                  valueAsNumber: true,
                })}
              >
                <option value="">Seleccione un operador</option>
                {storageData.operadores.map((operador) => (
                  <option value={operador.id} key={operador.id}>
                    {operador.nombre}
                  </option>
                ))}
              </select>
            </p>
          </div>
        )}
        {auditoria.tipo_id === 2 && auditoria.categoria_id === 5 && (
          <div>
            <p>
              <label>Instalación a la que se le aplica: </label>
              <select
                {...register("instalacion_id", {
                  required: true,
                  valueAsNumber: true,
                })}
              >
                <option value="">Seleccione una instalación</option>
                {storageData.instalaciones.map((instalacion) => (
                  <option value={instalacion.id} key={instalacion.id}>
                    {instalacion.nombre}
                  </option>
                ))}
              </select>
            </p>
            {errors.instalacion_id && (
              <div>
                <p>Este campo es requerido</p>
              </div>
            )}
          </div>
        )}
        {auditoria.tipo_id === 2 && auditoria.categoria_id === 6 && (
          <div>
            <p>
              <label>Transporte al que se le aplica: </label>
              <select
                {...register("transporte_id", {
                  required: true,
                  valueAsNumber: true,
                })}
              >
                <option value="">Seleccione un transporte</option>
                {storageData.transportes.map((tipo) => (
                  <optgroup label={tipo.nombre} key={tipo.id}>
                    {tipo.transportes.map((transporte) => (
                      <option value={transporte.id} key={transporte.id}>
                        {transporte.nombre}
                      </option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </p>
            {errors.transporte_id && (
              <div>
                <p>Este campo es requerido</p>
              </div>
            )}
            <p>
              <label>Operador: </label>
              <select
                {...register("operador_id", {
                  required: true,
                  valueAsNumber: true,
                })}
              >
                <option value="">Seleccione un operador</option>
                {storageData.operadores.map((operador) => (
                  <option value={operador.id} key={operador.id}>
                    {operador.nombre}
                  </option>
                ))}
              </select>
            </p>
          </div>
        )}
        {auditoria.tipo_id === 2 && auditoria.categoria_id === 7 && (
          <div>
            <p>
              <label>Equipo de emergencia al que se le aplica: </label>
              <select
                {...register("equipo_emergencia_id", {
                  required: true,
                  valueAsNumber: true,
                })}
              >
                <option value="">Seleccione un equipo de emergencia</option>
                {storageData.equipos_emergencia.map((equipo_emergencia) => (
                  <option
                    value={equipo_emergencia.id}
                    key={equipo_emergencia.id}
                  >
                    {equipo_emergencia.nombre}
                  </option>
                ))}
              </select>
            </p>
            {errors.equipo_emergencia_id && (
              <div>
                <p>Este campo es requerido</p>
              </div>
            )}
          </div>
        )}
        {auditoria.tipo_id === 3 && (
          <div>
            <p>
              <label>Sucursal a la que se aplica: </label>
              <select
                {...register("sucursal_id", {
                  required: true,
                  valueAsNumber: true,
                })}
              >
                <option value="">Seleccione una sucursal</option>
                {storageData.sucursales.map((sucursal) => (
                  <option value={sucursal.id} key={sucursal.id}>
                    {sucursal.nombre}
                  </option>
                ))}
              </select>
            </p>
            {errors.sucursal_id && (
              <div>
                <p>Este campo es requerido</p>
              </div>
            )}
          </div>
        )}
        {auditoria.tipo_id === 4 && (
          <div>
            <p>
              <label>Faena a la que se aplica: </label>
              <select
                {...register("faena_id", {
                  required: true,
                  valueAsNumber: true,
                })}
              >
                <option value="">Seleccione una faena</option>
                {storageData.faenas.map((faena) => (
                  <option value={faena.id} key={faena.id}>
                    {faena.nombre}
                  </option>
                ))}
              </select>
            </p>
            {errors.faena_id && (
              <div>
                <p>Este campo es requerido</p>
              </div>
            )}
          </div>
        )}
        {auditoria.tipo_id === 5 && (
          <div>
            <p>
              <label>Contratista al que aplica: </label>
              <select
                {...register("contratista_id", {
                  required: true,
                  valueAsNumber: true,
                })}
              >
                <option value="">Seleccione un contratista</option>
                {storageData.contratistas.map((contratista) => (
                  <option value={contratista.id} key={contratista.id}>
                    {contratista.nombre}
                  </option>
                ))}
              </select>
            </p>
            {errors.contratista_id && (
              <div>
                <p>Este campo es requerido</p>
              </div>
            )}
            <p>
              <label>Sucursal dónde aplica (opcional): </label>
              <select {...register("sucursal_id", { valueAsNumber: true })}>
                <option value="">Seleccione una sucursal</option>
                {storageData.sucursales.map((sucursal) => (
                  <option value={sucursal.id} key={sucursal.id}>
                    {sucursal.nombre}
                  </option>
                ))}
              </select>
            </p>
            <p>
              <label>Faena dónde aplica (opcional): </label>
              <select {...register("faena_id", { valueAsNumber: true })}>
                <option value="">Seleccione una faena</option>
                {storageData.faenas.map((faena) => (
                  <option value={faena.id} key={faena.id}>
                    {faena.nombre}
                  </option>
                ))}
              </select>
            </p>
          </div>
        )}
        <div>
          <p>
            <label>Subárea dónde se aplica: </label>
            <select
              {...register("subarea_id", {
                required: true,
                valueAsNumber: true,
              })}
            >
              <option value="">Seleccione una subárea</option>
              {storageData.areas.map((area) => (
                <optgroup label={area.nombre} key={area.id}>
                  {area.subareas.map((subarea) => (
                    <option value={subarea.id} key={subarea.id}>
                      {subarea.nombre}
                    </option>
                  ))}
                </optgroup>
              ))}
            </select>
          </p>
        </div>
        <div>
          <p>
            <label>Lugar dónde se aplica (opcional): </label>
            <select {...register("lugar_id", { valueAsNumber: true })}>
              <option value="">Seleccione un lugar</option>
              {storageData.lugares.map((lugar) => (
                <option value={lugar.id} key={lugar.id}>
                  {lugar.nombre}
                </option>
              ))}
            </select>
          </p>
        </div>
        {Object.keys(auditoria).length > 0 &&
          auditoria.grupos.map((grupo) => (
            <div key={grupo.id}>
              <div>{grupo.nombre}</div>
              {grupo.preguntas.map((pregunta) => (
                <div key={pregunta.id}>
                  {pregunta.tipo_id === 1 ? (
                    <div>
                      <p>
                        <b>{pregunta.pregunta}</b>
                      </p>
                    </div>
                  ) : (
                    <div>
                      <p>{pregunta.pregunta}</p>
                      <p>
                        <b>Referencia: </b>
                        {pregunta.referencia}
                      </p>
                      <p>
                        <input
                          type="radio"
                          {...register(`respuesta_${pregunta.id}`, {
                            required: true,
                            valueAsNumber: true,
                          })}
                          value="1"
                          data-id={pregunta.id}
                          onChange={optionHandler}
                        />
                        <label>Si</label>
                        <input
                          type="radio"
                          {...register(`respuesta_${pregunta.id}`, {
                            required: true,
                            valueAsNumber: true,
                          })}
                          value="2"
                          data-id={pregunta.id}
                          onChange={optionHandler}
                        />
                        <label>No</label>
                        <input
                          type="radio"
                          {...register(`respuesta_${pregunta.id}`, {
                            required: true,
                            valueAsNumber: true,
                          })}
                          value="3"
                          data-id={pregunta.id}
                          onChange={optionHandler}
                        />
                        <label>N/C</label>
                        <input
                          type="radio"
                          {...register(`respuesta_${pregunta.id}`, {
                            required: true,
                            valueAsNumber: true,
                          })}
                          value="0"
                          data-id={pregunta.id}
                          onChange={optionHandler}
                        />
                        <label>N/A</label>
                      </p>
                      {errors[`respuesta_${pregunta.id}`] && (
                        <div>
                          <p>Este campo es requerido</p>
                        </div>
                      )}
                      <hr />
                    </div>
                  )}
                </div>
              ))}
            </div>
          ))}
        <div>
          <div>
            <h2>Observaciones</h2>
          </div>
          <textarea {...register("observacion")} />
        </div>
        <div>
          <div>
            <h2>Observaciones por pregunta</h2>
          </div>
          <div id="id_observaciones_x_pregunta">
            {Object.keys(observaciones).length > 0 &&
              observaciones.map((observacion) =>
                renderObservacion(observacion)
              )}
          </div>
        </div>
        <div>
          <div>
            <h2>Asignación de tareas</h2>
          </div>
          <div id="id_tareas">
            {Object.keys(tareas).length > 0 &&
              tareas.map((tarea) => renderTarea(tarea))}
          </div>
        </div>
        <nav>
            <button type="button" onClick={() => navigate("/")}> Volver</button>
            <button type="submit"> Guardar</button>
        </nav>
      </form>
    </div>
  );
}
