import { useState, useEffect } from "react";
import {
    Container,
    TextField,
    Divider,
    InputLabel,
    Select,
    MenuItem,
} from "@mui/material";
import { getStorageData } from "../functions/functions";

export function Tarea({ tarea, updateTareas, getReference }) {
    const id = tarea.id;
    const descripcionForm = `NO CUMPLE: ${getReference(id)}`;
    const [tareaForm, setTareaForm] = useState("");
    const [supervisorForm, setSupervisorForm] = useState("");
    const [responsableForm, setResponsableForm] = useState("");
    const [criticidadForm, setCriticidadForm] = useState("");
    const [fechaCierreForm, setFechaCierreForm] = useState("");

    useEffect(() => {
        updateTareas(
            id,
            tareaForm,
            descripcionForm,
            supervisorForm,
            responsableForm,
            criticidadForm,
            fechaCierreForm
        );
    }, [tareaForm, supervisorForm, responsableForm, criticidadForm, fechaCierreForm]);

    const handleTarea = (event) => {
        setTareaForm(event.target.value);
    };

    const handleSupervisor = (event) => {
        setSupervisorForm(event.target.value);
    };

    const handleResponsable = (event) => {
        setResponsableForm(event.target.value);
    };

    const handleCriticidad = (event) => {
        setCriticidadForm(event.target.value);
    };

    const handleFechaCierre = (event) => {
        setFechaCierreForm(event.target.value);
    };

    const storageData = getStorageData();

    return (
        <Container
            key={tarea.id}
            data-id={tarea.id}
            sx={{
                mb: 2,
                p: 2,
                bgcolor: "white",
                borderRadius: 2,
            }}
        >
            <TextField
                label="Tarea"
                name="tarea"
                required
                multiline
                rows={4}
                fullWidth
                value={tareaForm}
                onChange={handleTarea}
            ></TextField>
            <Divider sx={{ mb: 2 }} />
            <TextField
                label="Descripción"
                name="descripcion"
                required
                multiline
                rows={4}
                fullWidth
                value={descripcionForm}
                inputProps={{
                    readOnly: true,
                }}
            ></TextField>
            <Divider sx={{ mb: 2 }} />
            <InputLabel id="id_label_supervisor">Supervisor</InputLabel>
            <Select
                labelId="id_label_supervisor"
                label="Supervisor"
                name="supervisor"
                required
                fullWidth
                defaultValue={""}
                value={supervisorForm}
                onChange={handleSupervisor}
            >
                <MenuItem value="">Seleccione un supervisor</MenuItem>
                {storageData.supervisores.map((supervisor) => (
                    <MenuItem value={supervisor.id} key={supervisor.id}>
                        {supervisor.nombre}
                    </MenuItem>
                ))}
            </Select>
            <Divider sx={{ mb: 2 }} />
            <InputLabel id="id_label_responsable">Responsable</InputLabel>
            <Select
                labelId="id_label_responsable"
                label="Responsable"
                name="responsable"
                required
                fullWidth
                defaultValue={""}
                value={responsableForm}
                onChange={handleResponsable}
            >
                <MenuItem value="">Seleccione un responsable</MenuItem>
                {storageData.responsables.map((responsable) => (
                    <MenuItem value={responsable.id} key={responsable.id}>
                        {responsable.nombre}
                    </MenuItem>
                ))}
            </Select>
            <Divider sx={{ mb: 2 }} />
            <InputLabel id="id_label_criticidad">Criticidad</InputLabel>
            <Select
                labelId="id_label_criticidad"
                label="Criticidad"
                name="criticidad"
                required
                fullWidth
                defaultValue={""}
                value={criticidadForm}
                onChange={handleCriticidad}
            >
                <MenuItem value="">Seleccione una criticidad</MenuItem>
                {storageData.todo_criticidad.map((criticidad) => (
                    <MenuItem value={criticidad.id} key={criticidad.id}>
                        {criticidad.nivel}
                    </MenuItem>
                ))}
            </Select>
            <Divider sx={{ mb: 2 }} />
            <TextField
                label="Fecha de cierre"
                name="fecha_cierre"
                required
                type="date"
                fullWidth
                value={fechaCierreForm}
                onChange={handleFechaCierre}
            ></TextField>
            <Divider sx={{ mb: 2 }} />
            <Divider
                variant="fullwidth"
                sx={{ borderColor: "#e0e0e0", width: "100%" }}
            />
        </Container>
    );
}
