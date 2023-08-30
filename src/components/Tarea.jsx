import { useState, useEffect } from "react";
import {
    Container,
    TextField,
    Divider,
    InputLabel,
    Select,
    MenuItem,
    Autocomplete,
} from "@mui/material";
import { getStorageData } from "../functions/functions";

export function Tarea({ tarea, updateTareas, getPregunta }) {
    const id = tarea.id;
    const descripcionForm = `NO CUMPLE: ${getPregunta(id)}`;
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
    }, [
        tareaForm,
        supervisorForm,
        responsableForm,
        criticidadForm,
        fechaCierreForm,
    ]);

    const handleTarea = (event) => {
        setTareaForm(event.target.value);
    };

    const handleSupervisor = (event, value) => {
        if (value) {
            setSupervisorForm(value.id);
        } else {
            setSupervisorForm("");
        }
    };

    const handleResponsable = (event, value) => {
        if (value) {
            setResponsableForm(value.id);
        } else {
            setResponsableForm("");
        }
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
                p: 2,
                backgroundColor: "white",
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
                sx={{
                    mb: 2,
                }}
            ></TextField>
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
                sx={{
                    mb: 2,
                }}
            ></TextField>
            <InputLabel id="id_label_supervisor">Supervisor</InputLabel>
            <Autocomplete
                labelId="id_label_supervisor"
                name="supervisor"
                fullWidth
                defaultValue={null}
                value={
                    storageData.supervisores.find(
                        (supervisor) => supervisor.id === supervisorForm
                    ) || null
                }
                onChange={handleSupervisor}
                options={storageData.supervisores}
                getOptionLabel={(option) => option.nombre}
                renderOption={(props, option) => (
                    <li
                        {...props}
                        key={option.id}
                        style={{ borderBottom: "1px solid #e0e0e0" }}
                    >
                        {option.nombre}
                    </li>
                )}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Seleccione un supervisor"
                        required
                    />
                )}
                sx={{
                    mb: 2,
                }}
            />
            <InputLabel id="id_label_responsable">Responsable</InputLabel>
            <Autocomplete
                labelId="id_label_responsable"
                name="responsable"
                fullWidth
                defaultValue={null}
                value={
                    storageData.responsables.find(
                        (responsable) => responsable.id === responsableForm
                    ) || null
                }
                onChange={handleResponsable}
                options={storageData.responsables}
                getOptionLabel={(option) => option.nombre}
                renderOption={(props, option) => (
                    <li
                        {...props}
                        key={option.id}
                        style={{ borderBottom: "1px solid #e0e0e0" }}
                    >
                        {option.nombre}
                    </li>
                )}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        variant="outlined"
                        label="Seleccione un responsable"
                        required
                    />
                )}
                sx={{
                    mb: 2,
                }}
            />
            <InputLabel id="id_label_criticidad">Criticidad</InputLabel>
            <Select
                labelId="id_label_criticidad"
                name="criticidad"
                required
                fullWidth
                defaultValue={""}
                value={criticidadForm}
                onChange={handleCriticidad}
                sx={{
                    mb: 2,
                }}
            >
                <MenuItem value="">Seleccione una criticidad</MenuItem>
                {storageData.todo_criticidad.map((criticidad) => (
                    <MenuItem
                        value={criticidad.id}
                        key={criticidad.id}
                        divider={true}
                        sx={{
                            whiteSpace: "normal",
                        }}
                    >
                        {criticidad.nivel}
                    </MenuItem>
                ))}
            </Select>
            <TextField
                label="Fecha de cierre"
                name="fecha_cierre"
                required
                type="date"
                fullWidth
                value={fechaCierreForm}
                onChange={handleFechaCierre}
                sx={{
                    mb: 2,
                }}
            ></TextField>
            <Divider />
        </Container>
    );
}
