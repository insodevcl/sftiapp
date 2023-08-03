import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useForm } from "react-hook-form";
import { toast } from "react-hot-toast";
import { getApiServers, getApiLogin } from "../functions/api";

export function ConfigPage() {
    const [servers, setServers] = useState([]);
    const navigate = useNavigate();
    const {
        register,
        handleSubmit,
        formState: { errors },
    } = useForm();

    useEffect(() => {
        document.title = "Configuración";
        const loadServer = async () => {
            const response = await getApiServers();
            setServers(response.data);
        };

        loadServer();
    }, []);

    const findServer = (id) => {
        return servers.find((x) => x.id === parseInt(id));
    };

    const onSubmit = handleSubmit(async (data) => {
        const server = findServer(data.server);
        try {
          const response = await getApiLogin(
              server.url,
              data.username,
              data.password
          );
          if (response.data.status) {
              const storageconfig = localStorage.getItem("config");
              const configData = JSON.parse(storageconfig);
              configData.server = server.url;
              configData.loginStatus = true;
              configData.user = response.data.data.user_fullname;
              configData.userID = response.data.data.id;
              configData.unidades = response.data.data.unidades;
              localStorage.setItem("config", JSON.stringify(configData));
              return navigate("/");
          } else {
              toast.error("Usuario o contraseña incorrectos");
          }
        } catch (error) {
          toast.error("Error al conectar con el servidor");
        }
    });

    return (
        <div>
            <form onSubmit={onSubmit}>
                <p>
                    <label htmlFor="server">Servidor:</label>
                    <select {...register("server", { required: true })}>
                        <option value="">----------</option>
                        {servers.map((server) => (
                            <option value={server.id} key={server.id}>
                                {server.url}
                            </option>
                        ))}
                    </select>
                </p>
                <p>
                    <label htmlFor="username">Usuario:</label>
                    <input
                        type="text"
                        {...register("username", { required: true })}
                    />
                </p>
                <p>
                    <label htmlFor="password">Contraseña:</label>
                    <input
                        type="password"
                        {...register("password", { required: true })}
                    />
                </p>
                <button type="submit">Ingresar</button>
            </form>
        </div>
    );
}
