export function AuditoriaGrupo({ grupo }) {
  const selectHandler = (e) => {
    console.log(e.target.value);
  };

  return (
    <div>
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
                  name={`respuesta_${pregunta.id}`}
                  value="1"
                  onChange={selectHandler}
                />
                <label>Si</label>
                <input
                  type="radio"
                  name={`respuesta_${pregunta.id}`}
                  value="2"
                  onChange={selectHandler}
                />
                <label>No</label>
                <input
                  type="radio"
                  name={`respuesta_${pregunta.id}`}
                  value="3"
                  onChange={selectHandler}
                />
                <label>N/C</label>
                <input
                  type="radio"
                  name={`respuesta_${pregunta.id}`}
                  value="0"
                  onChange={selectHandler}
                />
                <label>N/A</label>
              </p>
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
