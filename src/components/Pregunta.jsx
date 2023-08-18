import { useState } from "react";
import {
    Box,
    Typography,
    Divider,
    ToggleButtonGroup,
    ToggleButton,
} from "@mui/material";

export function Pregunta({ pregunta, handleOption }) {
    const [valor, setValor] = useState("");

    const handleValor = (event, respuesta) => {
        setValor(respuesta);
        handleOption(event, respuesta);
    };

    return (
        <Box
            key={pregunta.id}
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "top",
                alignItems: "start",
                p: 2,
            }}
        >
            {pregunta.tipo_id === 1 && (
                <>
                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                        {pregunta.pregunta}
                    </Typography>
                    <Divider
                        variant="fullWidth"
                        sx={{ borderColor: "#e0e0e0", width: "100%" }}
                    />
                </>
            )}
            {pregunta.tipo_id === 2 && (
                <>
                    <Typography variant="body1">{pregunta.pregunta}</Typography>
                    {pregunta.referencia && (
                        <Typography
                            variant="body2"
                            sx={{ fontStyle: "italic" }}
                        >
                            <b>Referencia:</b> {pregunta.referencia}
                        </Typography>
                    )}
                    <ToggleButtonGroup
                        data-id={pregunta.id}
                        exclusive
                        fullWidth
                        value={valor}
                        onChange={handleValor}
                        sx={{ my: 2 }}
                    >
                        <ToggleButton
                            value={1}
                            color="success"
                        >
                            Cumple
                        </ToggleButton>
                        <ToggleButton
                            value={2}
                            color="error"
                        >
                            No cumple
                        </ToggleButton>
                        <ToggleButton
                            value={3}
                            color="warning"
                        >
                            Corrección
                        </ToggleButton>
                        <ToggleButton
                            value={0}
                            color="light"
                        >
                            N/A
                        </ToggleButton>
                    </ToggleButtonGroup>
                    <Divider
                        variant="fullwidth"
                        sx={{ borderColor: "#e0e0e0", width: "100%" }}
                    />
                </>
            )}
        </Box>
    );
}
