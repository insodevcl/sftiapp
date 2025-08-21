import {useState, useEffect} from 'react';
import {Container, TextField, Divider, InputLabel, Select, MenuItem, Autocomplete} from '@mui/material';

export function TareaCard({tarea, updateTareas, getPregunta}) {
    const [descripcion, setDescripcion] = useState('EvaluacionPregunta no encontrada');
    const [supervisores, setSupervisores] = useState([]);
    const [responsables, setResponsables] = useState([]);
    const [criticidades, setCriticidades] = useState([]);
    const [tareaForm, setTareaForm] = useState('');
    const [supervisorForm, setSupervisorForm] = useState('');
    const [responsableForm, setResponsableForm] = useState('');
    const [criticidadForm, setCriticidadForm] = useState('');
    const [fechaCierreForm, setFechaCierreForm] = useState('');

    useEffect(() => {
        const storageTrabajadores = JSON.parse(localStorage.getItem('trabajador'));
        setResponsables(storageTrabajadores);
        const storageSupervisores = storageTrabajadores.filter((x) => x.usuario_id !== null);
        setSupervisores(storageSupervisores);
        const storageTodoCriticidad = JSON.parse(localStorage.getItem('todo_criticidad'));
        setCriticidades(storageTodoCriticidad || []);
        setDescripcion(`NO CUMPLE: ${getPregunta(tarea.pregunta_id)}`);
    }, []);

    useEffect(() => {
        updateTareas(tarea.pregunta_id, tareaForm, descripcion, supervisorForm, responsableForm, criticidadForm, fechaCierreForm);
    }, [tareaForm, supervisorForm, responsableForm, criticidadForm, fechaCierreForm]);

    const handleTarea = (event) => {
        setTareaForm(event.target.value);
    };

    const handleSupervisor = (event, value) => {
        if (value) {
            setSupervisorForm(value.id);
        } else {
            setSupervisorForm('');
        }
    };

    const handleResponsable = (event, value) => {
        if (value) {
            setResponsableForm(value.id);
        } else {
            setResponsableForm('');
        }
    };

    const handleCriticidad = (event) => {
        setCriticidadForm(event.target.value);
    };

    const handleFechaCierre = (event) => {
        setFechaCierreForm(event.target.value);
    };

    return (
        <Container
            key={tarea.pregunta_id}
            data-id={tarea.pregunta_id}
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
                value={descripcion}
                inputProps={{
                    readOnly: true,
                }}
                sx={{
                    mb: 2,
                }}
            ></TextField>
            <InputLabel id="id_label_supervisor">Supervisor</InputLabel>
            <Autocomplete
                name="supervisor"
                fullWidth
                defaultValue={null}
                value={supervisores.find((supervisor) => supervisor.id === supervisorForm) || null}
                onChange={handleSupervisor}
                options={supervisores}
                getOptionLabel={(option) => option.nombre}
                renderOption={(props, option) => (
                    <li {...props}
                        key={option.id}
                        style={{borderBottom: "1px solid #e0e0e0"}}>
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
                name="responsable"
                fullWidth
                defaultValue={null}
                value={responsables.find((responsable) => responsable.id === responsableForm) || null}
                onChange={handleResponsable}
                options={responsables}
                getOptionLabel={(option) => option.nombre}
                renderOption={(props, option) => (
                    <li {...props}
                        key={option.id}
                        style={{borderBottom: "1px solid #e0e0e0"}}>
                        {option.nombre}
                    </li>
                )}
                renderInput={(params) => (
                    <TextField
                        {...params}
                        label="Seleccione un responsable"
                        variant="outlined"
                        required
                    />
                )}
                sx={{
                    mb: 2,
                }}
            />
            <InputLabel id="id_label_criticidad">Criticidad</InputLabel>
            <Select
                name="criticidad"
                required
                fullWidth
                defaultValue={''}
                value={criticidadForm}
                onChange={handleCriticidad}
                sx={{
                    mb: 2,
                }}
            >
                <MenuItem value="">Seleccione una criticidad</MenuItem>
                {criticidades.map((criticidad) => (
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
            <Divider/>
        </Container>
    );
}
