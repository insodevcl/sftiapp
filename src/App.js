import { useEffect } from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ToastContainer } from "react-toastify";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import { ConfigPage } from "./pages/ConfigPage";
import { EmpresaPage } from "./pages/EmpresaPage";
import { HomePage } from "./pages/HomePage";
import { ListAuditoriaDisponiblePage } from "./pages/ListAuditoriaDisponiblePage";
import { ListAuditoriaRealizadaPage } from "./pages/ListAuditoriaRealizadaPage";
import { NewAuditoriaPage } from "./pages/NewAuditoriaPage";
import { ViewAuditoriaRealizadaPage } from "./pages/ViewAuditoriaRealizadaPage";
import "react-toastify/dist/ReactToastify.min.css";

function App() {
    const theme = createTheme({
        typography: {
            fontFamily: ["Nunito", "Roboto", "sans-serif"].join(","),
        },
        palette: {
            primary: {
                main: "#59185e",
                contrastText: "#ffffff",
            },
            secondary: {
                main: "#1a73e8",
                contrastText: "#ffffff",
            },
            background: {
                main: "#ecf0f1",
                primary: "#59185e",
                secondary: "#1a73e8",
            },
            success: {
                main: "#8dc63f",
                contrastText: "#ffffff",
            },
            error: {
                main: "#cc4141",
                contrastText: "#ffffff",
            },
            warning: {
                main: "#f7941d",
                contrastText: "#ffffff",
            },
            info: {
                main: "#0097da",
                contrastText: "#ffffff",
            },
            grey: {
                main: "#e0e0e0",
                contrastText: "#ffffff",
            },
            light: {
                main: "#3a3a3a",
                contrastText: "#3a3a3a",
            },
            text: {
                primary: "#333333",
                secondary: "#5a5a5a",
            },
            divider: "#e0e0e0",
        },
    });
    useEffect(() => {
        document.title = "App";
        window.scroll({
            top: 0,
            left: 0,
            behavior: "smooth",
        });
    }, []);

    return (
        <ThemeProvider theme={theme}>
            <BrowserRouter>
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
                    <Route
                        path="/auditoria/realizada/ver/:id"
                        element={<ViewAuditoriaRealizadaPage />}
                    />
                </Routes>
                <ToastContainer position="bottom-center" theme="colored" />
            </BrowserRouter>
        </ThemeProvider>
    );
}

export default App;
