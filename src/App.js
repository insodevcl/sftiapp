import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { Toaster } from "react-hot-toast";
import { ConfigPage } from "./pages/ConfigPage";
import { EmpresaPage } from "./pages/EmpresaPage";
import { HomePage } from "./pages/HomePage";
import { ListAuditoriaDisponiblePage } from "./pages/ListAuditoriaDisponiblePage";
import { ListAuditoriaRealizadaPage } from "./pages/ListAuditoriaRealizadaPage";
import { NewAuditoriaPage } from "./pages/NewAuditoriaPage";
import { Navigation } from "./components/Navigation";
import { getStorageConfig } from "./functions/functions";

function App() {
    const config = getStorageConfig();
    useEffect(() => {
        document.title = "App";
    }, []);

    return (
        <BrowserRouter>
            {config.loginStatus && config.empresaID && <Navigation />}
            <Routes>
                <Route path="/" element={<HomePage />} />
                <Route path="/sftiapp" element={<HomePage />} />
                <Route path="/config" element={<ConfigPage />} />
                <Route path="/empresa" element={<EmpresaPage />} />
                <Route
                    path="/auditoria/disponible/lista"
                    element={<ListAuditoriaDisponiblePage />}
                />
                <Route
                    path="/auditoria/aplica"
                    element={<NewAuditoriaPage />}
                />
                <Route
                    path="/auditoria/realizada/lista"
                    element={<ListAuditoriaRealizadaPage />}
                />
                <Route
                    path="/auditoria/aplica/:id"
                    element={<NewAuditoriaPage />}
                />
            </Routes>
            <Toaster />
        </BrowserRouter>
    );
}

export default App;
