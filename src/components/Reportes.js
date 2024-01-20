import * as React from 'react';
import MenuItem from '@mui/material/MenuItem';
import { LoadingButton } from '@mui/lab';
import DownloadForOfflineIcon from '@mui/icons-material/DownloadForOffline';
import { Chip, Alert, FormControl, Typography, Card, InputLabel, Select, Box, Grid, TextField } from '@mui/material';
import { useParams } from 'react-router-dom';

export default function Reportes() {

  const { password } = useParams();

  const [fecha, setfecha] = React.useState(new Date().toISOString().split("T")[0]);
  const [age, setAge] = React.useState('ReporteTotal');
  const [data, setdata] = React.useState({});
  const [loading, setloading] = React.useState(false);

  const handleChange = (event) => {
    setAge(event.target.value);
  };

  const reporteBienes = async (descargar = false) => {
    setloading(true);
    const formData = new FormData();
    formData.append("fecha", fecha);
    formData.append("tipoReporte", age);
    formData.append("descargar", descargar);
    const response = await fetch("https://yocreoquesipuedohacerlo.com/reporteDeBienes", {
      method: "post",
      body: formData
    });
    if (!descargar) {
      const data = await response.json();
      setloading(false);
      return data;
    } else {
      const blob = await response.blob();
      setloading(false);
      // Crear un enlace de descarga
      const url = window.URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `${age}${new Date().toISOString().split("T")[0]}.xlsx`; // Cambia 'nombre_del_archivo' por el nombre que desees para el archivo
      a.style.display = 'none'; // Ocultar el enlace
      document.body.appendChild(a);
      a.click();
      window.URL.revokeObjectURL(url);
      document.body.removeChild(a);

      return data;
    }

  }

  React.useEffect(() => {
    (async () => {
      setdata(await reporteBienes(false));
    }
    )();
  }, [age, fecha]);

  if (password != "homero2024") {
    return null;
  }


  return (
    <Box style={{ padding: "12px" }}>
      <Grid container spacing={2}>
        <Grid item xs={12} sm={2} md={2} lg={4}></Grid>
        <Grid item xs={12} sm={8} md={8} lg={4}>
          <FormControl fullWidth sx={{ my: 2 }}>
            <InputLabel id="demo-simple-select-label">Seleccione tipo de reporte</InputLabel>
            <Select
              labelId="demo-simple-select-label"
              id="demo-simple-select"
              value={age}
              label="Seleccione tipo de reporte"
              onChange={handleChange}
            >
              <MenuItem value="ReporteTotal">Reporte total</MenuItem>
              <MenuItem value="ReportePorFecha">Reporte por fecha</MenuItem>
            </Select>
          </FormControl>

          {age == "ReportePorFecha" && (
            <TextField
              inputProps={{ maxLength: 100 }}
              fullWidth
              size="small"
              id='codigo'
              label='Seleccione fecha'
              variant='outlined'
              type='date'
              sx={{ mb: 2 }}
              value={fecha}
              onChange={(e) => setfecha(e.target.value)}
            />
          )}

        </Grid>
        <Grid item xs={12} sm={2} md={2} lg={4}>
          {/* <Button fullWidth variant="contained" onClick={reporteBienes.bind(null, true)}>Descargar excel</Button> */}
          <LoadingButton
            style={{ width: "100%", display: "none" }}
            color='primary'
            variant='contained'
            loading={loading}
            loadingPosition='start'
            startIcon={<DownloadForOfflineIcon />}
            onClick={async () => {
              await reporteBienes(true);
            }}>
            Descargar excel
          </LoadingButton>
        </Grid>

        <Grid item xs={12} sm={12} md={12} lg={12}>
          <Alert severity="info" sx={{ mb: 2 }}>Lista de bienes <Chip label={`${data?.cantidadTotal} bienes`} color="success" /></Alert>
          <Grid container spacing={1}>

            {(data?.cantidadPorInventariador || []).map(({ inventariador, cantidad, _id: dni }) => (
              <Grid item xs={12} sm={12} md={6} lg={4}>
                <Card sx={{ width: "inherit", padding: "8px", marginBottom: "8px" }}>
                  <Typography variant="small" component="div">
                    DNI: {dni}
                  </Typography>
                  <Typography variant="small" component="div">
                    {`${inventariador} : `}<Chip label={`${cantidad} bienes`} color="success" />
                  </Typography>
                </Card>
              </Grid>
            ))}

          </Grid>
        </Grid>
      </Grid>
    </Box>
  );
}
