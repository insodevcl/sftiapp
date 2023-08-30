import { useState } from "react";
import {
    Box,
    Container,
    Divider,
    Typography,
    ToggleButtonGroup,
} from "@mui/material";
import styled from "@mui/material/styles/styled";
import MuiToggleButton from "@mui/material/ToggleButton";

export function Pregunta({ pregunta, handleOption }) {
    const [valor, setValor] = useState("");

    const handleValor = (event, respuesta) => {
        setValor(respuesta);
        handleOption(event, respuesta);
    };

    const ToggleButton = styled(MuiToggleButton)(({ value }) => {
        let style = {};
        switch (value) {
            case 1:
                style = {
                    color: "white",
                    backgroundColor: "#8dc63f",
                };
                break;
            case 2:
                style = {
                    color: "white",
                    backgroundColor: "#cc4141",
                };
                break;
            case 3:
                style = {
                    color: "white",
                    backgroundColor: "#f7941d",
                };
                break;
            default:
                style = {
                    color: "#333333",
                    backgroundColor: "#e0e0e0",
                };
                break;
        }
        return {
            "&.Mui-selected, &.Mui-selected:hover": style,
        };
    });

    return (
        <Box
            key={pregunta.id}
            sx={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "start",
                alignItems: "start",
            }}
        >
            {pregunta.tipo_id === 1 && (
                <Container
                    sx={{
                        p: 2,
                    }}
                >
                    <Typography variant="body1" sx={{ fontWeight: "bold" }}>
                        {pregunta.pregunta}
                    </Typography>
                    <Divider />
                </Container>
            )}
            {pregunta.tipo_id === 2 && (
                <Container
                    sx={{
                        p: 2,
                    }}
                >
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
                        size="small"
                        onChange={handleValor}
                        sx={{
                            mb: 2,
                        }}
                    >
                        <ToggleButton value={1}>Cumple</ToggleButton>
                        <ToggleButton value={2}>No cumple</ToggleButton>
                        <ToggleButton value={3}>Corrección</ToggleButton>
                        <ToggleButton value={0}>N/A</ToggleButton>
                    </ToggleButtonGroup>
                    <Divider />
                </Container>
            )}
        </Box>
    );
}
