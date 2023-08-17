import { Link } from "react-router-dom";
import {
    Card,
    CardHeader,
    CardContent,
    CardActions,
    Button,
    Typography,
} from "@mui/material";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";

export function AuditoriaDisponibleCard({ auditoria }) {
    return (
        <Card
            raised={true}
            elevation={3}
            sx={{ mb: 2, width: "98%", overflow: "visible" }}
        >
            <CardHeader title={auditoria.nombre} sx={{ py: 1 }} />
            <CardContent sx={{ py: 1 }}>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                >
                    <b>Descripción: </b>
                    {auditoria.descripcion}
                </Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                >
                    <b>Tipo: </b>
                    {auditoria.tipo}
                </Typography>
                <Typography
                    variant="body2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                >
                    <b>Categoría: </b>
                    {auditoria.categoria_id ? auditoria.categoria : "N/A"}
                </Typography>
            </CardContent>
            <CardActions
                sx={{
                    display: "flex",
                    justifyContent: "flex-end",
                }}
            >
                <Link to={`/auditoria/aplica/${auditoria.id}`}>
                    <Button
                        size="small"
                        variant="contained"
                        alt="Aplicar auditoria"
                        startIcon={<CheckCircleIcon />}
                        sx={{
                            bgcolor: "#59185E",
                        }}
                    >
                        Aplicar
                    </Button>
                </Link>
            </CardActions>
        </Card>
    );
}
