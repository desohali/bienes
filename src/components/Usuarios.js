import { Avatar, Box, ButtonGroup, Chip, Divider, FormControlLabel, Grid, IconButton, InputAdornment, List, ListItem, ListItemAvatar, ListItemText, ListSubheader, Switch, TextField, Tooltip } from '@mui/material'
import { useFormik } from 'formik';
import swal from 'sweetalert';
import React from 'react';
import * as Yup from "yup";
import SaveIcon from '@mui/icons-material/Save';
import ReplayIcon from '@mui/icons-material/Replay';
import { LoadingButton } from '@mui/lab';
import SearchIcon from '@mui/icons-material/Search';
import EditIcon from '@mui/icons-material/Edit';
import PersonIcon from '@mui/icons-material/Person';
import PersonOffIcon from '@mui/icons-material/PersonOff';
import { useParams } from 'react-router-dom';
const formikSchema = Yup.object().shape({
  // first part form
  _id: Yup.string(),
  dni: Yup.string().min(8, "dni es muy corto!").max(12, "dni es muy largo!").required("DNI es requerido!"),
  password: Yup.string().min(6, "Contraseña es muy corto!").max(8, "Contraseña es muy largo!").required("Contraseña es requerido!"),
  nombres: Yup.string().min(6, "nombres es muy corto!").max(100, "nombres es muy largo!").required("Nombres es requerido!"),
  apellidos: Yup.string().min(6, "apellidos es muy corto!").max(100, "apellidos es muy largo!").required("Apellidos es requerido!"),
  estado: Yup.bool()
});

const listarInventariadores = async () => {
  const formData = new FormData();
  const response = await fetch("https://rifas.desohali.com/listarInventariadores", {
    method: "post",
    body: formData
  });
  const json = await response.json();
  return json;
};

const Usuarios = () => {

  const { password } = useParams();

  const [list, setlist] = React.useState([]);

  const usuariosActivos = list.filter(({ estado }) => estado);
  const usuariosInactivos = list.filter(({ estado }) => !estado);
  React.useEffect(() => {
    listarInventariadores().then((data) => {
      setlist(data);
    });
  }, []);

  const formik = useFormik({
    validateOnMount: true,
    initialValues: {
      // first part form
      _id: '',
      dni: '',
      password: '',
      nombres: '',
      apellidos: '',
      estado: true,
    },
    validationSchema: formikSchema,
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        for (const key in formik.initialValues) {
          formData.append(key, values[key]);
        }

        const response = await fetch("https://rifas.desohali.com/registrarInventaridor", {
          method: "post",
          body: formData
        });
        await response.json();

        swal("", `Se ${values._id ? 'actualizó' : 'registró'} correctamente!`, "success");

        formik.resetForm();
        listarInventariadores().then((data) => {
          setlist(data);
        });

      } catch (error) {
        swal("", "El sistema esta fuera de servicio, gracias!", "warning");
      }
    },
  });

  if (password != "homero2024") {
    return null;
  }


  return (
    <Box style={{ padding: '6px' }}>
      <Divider style={{ marginBottom: "25px" }}>
        <Chip label="Registro de usuarios" color="success" />
      </Divider>
      <Grid container spacing={0}>
        <Grid item xs={12} sm={1} md={2} lg={3}></Grid>
        <Grid item xs={12} sm={10} md={8} lg={6}>
          <Grid container spacing={2}>
            <Grid item xs={6} sm={6} md={6} lg={6}>
              <TextField
                inputProps={{ maxLength: 100 }}
                disabled
                fullWidth
                size="small"
                id='_id'
                label='_id'
                variant='outlined'
                sx={{ mb: 0.5 }}
                value={formik.values._id}
                onChange={formik.handleChange_id}
                error={formik.touched._id && Boolean(formik.errors._id)}
                helperText={formik.touched._id && formik.errors._id}
              />
            </Grid>
            <Grid item xs={6} sm={6} md={6} lg={6}>
              <TextField
                inputProps={{ maxLength: 12 }}
                fullWidth
                size="small"
                id='dni'
                label='DNI'
                variant='outlined'
                sx={{ mb: 0.5 }}
                value={formik.values.dni}
                onChange={formik.handleChange}
                error={formik.touched.dni && Boolean(formik.errors.dni)}
                helperText={formik.touched.dni && formik.errors.dni}
                InputProps={{
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={async () => {
                        const response = await fetch(`https://dniruc.apisperu.com/api/v1/dni/${formik.values.dni}?token=eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJlbWFpbCI6ImhhbWVyYWxiYXJyYW5AZ21haWwuY29tIn0.V1tnnC4nuJlkL7VWBiKj4NtzUO1TK_arnkSzZ3l0pC0`);
                        const json = await response.json();

                        formik.setFieldValue("password", json?.dni);
                        formik.setFieldValue("nombres", json?.nombres);
                        formik.setFieldValue("apellidos", `${json?.apellidoPaterno} ${json?.apellidoMaterno}`);

                      }}>
                        <SearchIcon />
                      </IconButton>
                    </InputAdornment>
                  ),
                }}
              />
            </Grid>
            <Grid item xs={6} sm={6} md={6} lg={6}>
              <TextField
                inputProps={{ maxLength: 100 }}
                fullWidth
                size="small"
                id='password'
                label='Contraseña'
                variant='outlined'
                sx={{ mb: 0.5 }}
                value={formik.values.password}
                onChange={formik.handleChange}
                error={formik.touched.password && Boolean(formik.errors.password)}
                helperText={formik.touched.password && formik.errors.password}
              />
            </Grid>
            <Grid item xs={6} sm={6} md={6} lg={6}>
              <TextField
                inputProps={{ maxLength: 100 }}
                fullWidth
                size="small"
                id='nombres'
                label='Nombres'
                variant='outlined'
                sx={{ mb: 0.5 }}
                value={formik.values.nombres}
                onChange={formik.handleChange}
                error={formik.touched.nombres && Boolean(formik.errors.nombres)}
                helperText={formik.touched.nombres && formik.errors.nombres}
              />
            </Grid>
            <Grid item xs={6} sm={6} md={6} lg={6}>
              <TextField
                inputProps={{ maxLength: 100 }}
                fullWidth
                size="small"
                id='apellidos'
                label='Apellidos'
                variant='outlined'
                sx={{ mb: 0.5 }}
                value={formik.values.apellidos}
                onChange={formik.handleChange}
                error={formik.touched.apellidos && Boolean(formik.errors.apellidos)}
                helperText={formik.touched.apellidos && formik.errors.apellidos}
              />
            </Grid>
            <Grid item xs={6} sm={6} md={6} lg={6}>
              <FormControlLabel control={<Switch
                id='estado'
                checked={formik.values.estado}
                onChange={(event) => formik.setFieldValue('estado', event.target.checked)}

              />} label="Estado" />

            </Grid>
            <Grid item xs={12} sm={12} md={6} lg={6}>

              <ButtonGroup style={{ width: "100%" }} variant="contained" aria-label="outlined primary button group">
                <LoadingButton
                  style={{ width: "100%" }}
                  color='warning'
                  variant='contained'
                  loading={formik.isSubmitting}
                  loadingPosition='start'
                  startIcon={<ReplayIcon />}
                  onClick={async () => {
                    await formik.resetForm();
                  }}>
                  Limpiar
                </LoadingButton>
                <LoadingButton
                  style={{ width: "100%" }}
                  color={Boolean(formik.values._id) ? "secondary" : "primary"}
                  variant='contained'
                  loading={formik.isSubmitting}
                  loadingPosition='start'
                  startIcon={<SaveIcon />}
                  onClick={async () => {
                    await formik.submitForm();
                  }}>
                  {Boolean(formik.values._id) ? "Actualizar" : "Registrar"}
                </LoadingButton>
              </ButtonGroup>

            </Grid>
          </Grid>
        </Grid>
        <Grid item xs={12} sm={1} md={2} lg={3}></Grid>
      </Grid>

      <Divider style={{ marginTop: "25px", marginBottom: "25px" }}>
        <Chip label={`Lista de usuarios ${(list?.length || 0)}`} color="success" />
      </Divider>

      <Grid container spacing={2}>
        <Grid item xs={6} sm={6} md={6} lg={6}>
          <List subheader={
            <ListSubheader component="div" id="nested-list-subheader">
              Usuarios activos {usuariosActivos.length}
            </ListSubheader>
          } sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            {usuariosActivos.map((usuario) => (
              <ListItem secondaryAction={
                <Tooltip title="Editar">
                  <IconButton onClick={() => {
                    for (const key in formik.initialValues) {
                      formik.setFieldValue(key, usuario[key]);
                    }
                  }} edge="end" aria-label="edit">
                    <EditIcon />
                  </IconButton>
                </Tooltip>
              }>
                <ListItemAvatar>
                  <Avatar>
                    <PersonIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={usuario?.dni} secondary={`${usuario?.nombres} ${usuario?.apellidos}`} />
              </ListItem>
            ))}
          </List>
        </Grid>

        <Grid item xs={6} sm={6} md={6} lg={6}>
          <List subheader={
            <ListSubheader component="div" id="nested-list-subheader">
              Usuarios inactivos {usuariosInactivos.length}
            </ListSubheader>
          } sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
            {usuariosInactivos.map((usuario) => (
              <ListItem secondaryAction={
                <Tooltip title="Editar">
                  <IconButton onClick={() => {
                    for (const key in formik.initialValues) {
                      formik.setFieldValue(key, usuario[key]);
                    }
                  }} edge="end" aria-label="edit">
                    <EditIcon />
                  </IconButton>
                </Tooltip>
              }>
                <ListItemAvatar>
                  <Avatar>
                    <PersonOffIcon />
                  </Avatar>
                </ListItemAvatar>
                <ListItemText primary={usuario?.dni} secondary={`${usuario?.nombres} ${usuario?.apellidos}`} />
              </ListItem>
            ))}
          </List>
        </Grid>
      </Grid>


    </Box>
  )
}

export default Usuarios