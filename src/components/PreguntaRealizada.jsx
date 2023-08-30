import {
    Box,
    Container,
    Stack,
    Divider,
    Typography,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import CancelIcon from "@mui/icons-material/Cancel";
import RemoveCircleIcon from "@mui/icons-material/RemoveCircle";
import CircleIcon from "@mui/icons-material/Circle";

export function PreguntaRealizada({ pregunta, auditoriaRealizada }) {
    const respuesta = auditoriaRealizada.respuestas.find(
        (respuesta) => respuesta.id === pregunta.id
    );
    let icon = <CircleIcon sx={{ color: "white", fontSize: "2rem" }} />;
    let backgroundColor = "#e0e0e0";
    switch (respuesta.respuesta) {
        case 1:
            icon = (
                <CheckCircleIcon sx={{ color: "white", fontSize: "2rem" }} />
            );
            backgroundColor = "#8dc63f";
            break;
        case 2:
            icon = <CancelIcon sx={{ color: "white", fontSize: "2rem" }} />;
            backgroundColor = "#cc4141";
            break;
        case 3:
            icon = (
                <RemoveCircleIcon sx={{ color: "white", fontSize: "2rem" }} />
            );
            backgroundColor = "#f7941d";
            break;
        default:
            break;
    }

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
                        p: 0,
                    }}
                >
                    <Stack direction="row" spacing={2}>
                        <Container
                            sx={{
                                display: "flex",
                                flexDirection: "column",
                                justifyContent: "center",
                                alignItems: "center",
                                width: "20%",
                                backgroundColor: backgroundColor,
                            }}
                        >
                            {icon}
                        </Container>
                        <Container
                            sx={{
                                py: 1,
                                pl: 0,
                                pr: 1,
                            }}
                        >
                            <Typography variant="body1">
                                {pregunta.pregunta}
                            </Typography>
                            {pregunta.referencia && (
                                <Typography
                                    variant="body2"
                                    sx={{ fontStyle: "italic" }}
                                >
                                    <b>Referencia:</b>{" "}
                                    <em>{pregunta.referencia}</em>
                                </Typography>
                            )}
                            <Typography variant="body2" sx={{ mb: 2 }}>
                                <b>Observaciones:</b>{" "}
                                {respuesta.observaciones || "Sin observaciones"}
                            </Typography>
                        </Container>
                    </Stack>
                    <Divider />
                </Container>
            )}
        </Box>
    );
}
