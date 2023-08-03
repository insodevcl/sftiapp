import { Link } from "react-router-dom";

export function Navigation() {
  return (
    <div>
      <ul>
        <li>
          <Link to="/">Inicio</Link>
        </li>
        <li>
          <ul>
            <li>
              <Link to="/auditoria/disponible/lista">Disponibles</Link>
            </li>
            <li>
              <Link to="/auditoria/realizada/lista">Realizadas</Link>
            </li>
          </ul>
        </li>
      </ul>
    </div>
  );
}
