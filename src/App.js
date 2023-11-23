import * as React from 'react';
import { useFormik } from 'formik'
import * as Yup from "yup"
import SaveIcon from '@mui/icons-material/Save';
import { LoadingButton } from '@mui/lab';
import swal from 'sweetalert';
import AppBar from '@mui/material/AppBar';


import Autocomplete from '@mui/material/Autocomplete';
import Toolbar from '@mui/material/Toolbar';
import Typography from '@mui/material/Typography';
/* import Button from '@mui/material/Button'; */
import IconButton from '@mui/material/IconButton';
import MenuIcon from '@mui/icons-material/Menu';
import { Chip, Divider, Box, FormControl, FormControlLabel, Grid, InputLabel, MenuItem, Radio, RadioGroup, Select, TextField } from '@mui/material'
import BasicTable from './TableBienes'
import Catalogo_Nacional from './Catalogo_Nacional.json'; // Ruta relativa al archivo JSON

const DNIS = [
  '74026816', '48115295', '42142607', '77491421', '61611530', '46984573', '73422124',
  '43917257', '60507843', '71033109', '76723091', '71248260', '61702269', '71272141',
  '77014764', '75259917', '71391049', '73088000', '12345678', '74060603', '75624129',
  '72708818', '73456805', '71790187', '71067923', '76400492', '74931655', '71600418',
  '71820114', '75524592', '61025653', '26703070', '74026816', '48115295', '42142607', '73422124', '71033109', '76723091', 
  '71248260', '61702269', '71272141', '71391049', '73088000', '26706371', 
  '74060603', '72708818', '73456805', '71790187', '71067923', '76400492', 
  '71600418', '59384120', '76937817', '40028772', '75524592', '77014664', 
  '42703180', '71062503', '72546177', '73662634', '75514017', '26703070', 
  '72408548', '74224991', '74917084', '72255382', '61025653', '74969966', 
  '43558264', '46966682', '73422125', '45715771', '75022980', '70495793'
];



const regex = /[a-zA-Z0-9]/;

const formikBasicInformationSchema = Yup.object().shape({
  // first part form
  //dependencia: Yup.number().min(1, "Number of pieces too short!").max(9999, "Number of pieces too long!").required("Number of pieces is required!"),
  dependencia: Yup.string().min(1, "dependencia es muy corto!").max(400, "dependencia es muy largo!").required("dependenncia es requerido!"),
  responsable: Yup.string().min(1, "responsable es muy corto!").max(400, "responsable es muy largo!").required("responsable es requerido!"),
  numeroEtiqueta: Yup.string().min(1, "numeroEtiqueta es muy corto!").max(400, "numeroEtiqueta es muy largo!").required("numeroEtiqueta es requerido!"),
  dimensiones: Yup.string().min(1, "dimensiones es muy corto!").max(400, "dimensiones es muy largo!").required("dimensiones es requerido!"),
  marca: Yup.string().when('dimensiones', {
    is: (dimensiones) => !regex.test((dimensiones || "").toString()),
    then: Yup.string().min(1, "marca es muy corto!").max(400, "marca es muy largo!").required("marca es requerido!"),
    otherwise: Yup.string()
  }),
  modelo: Yup.string().when('dimensiones', {
    is: (dimensiones) => !regex.test((dimensiones || "").toString()),
    then: Yup.string().min(1, "modelo es muy corto!").max(400, "modelo es muy largo!").required("modelo es requerido!"),
    otherwise: Yup.string()
  }),
  serie: Yup.string().when('dimensiones', {
    is: (dimensiones) => !regex.test((dimensiones || "").toString()),
    then: Yup.string().min(1, "serie es muy corto!").max(400, "serie es muy largo!").required("serie es requerido!"),
    otherwise: Yup.string()
  }),
  color: Yup.string().min(1, "color es muy corto!").max(400, "color es muy largo!").required("color es requerido!"),

  estado: Yup.string().min(1, "estado es muy corto!").max(400, "estado es muy largo!").required("estado es requerido!"),
  observaciones: Yup.string().min(1, "observaciones es muy corto!").max(400, "observaciones es muy largo!"),
  codigo: Yup.string().min(1, "codigo es muy corto!").max(400, "codigo es muy largo!").required("codigo es requerido!"),
});

const formikLoginSchema = Yup.object().shape({
  // first part form
  dni: Yup.string().min(8, "dni es muy corto!").max(8, "dni es muy largo!").required("dni es requerido!"),
  //clave: Yup.string().min(1, "contraseña es muy corto!").max(400, "contraseña es muy largo!").required("contraseña es requerido!"),
});

/* app.post("/listarEnventario", async (req, res) => {
  let formData = await new helpers().parserFormidable(req),
    fields = formData.fields,
    files = formData.files;

  const findParticipantes = await participanteModel.find({ inventariador: fields.inventariador });
  res.json(findParticipantes);
}); */


const ordenDeBienes = [
  "codigo",
  "numeroEtiqueta",
  "marca",
  "modelo",
  "serie",
  "color",
  "dimensiones",
  "estado",
  "observaciones",
  "dependencia",
  "responsable"
];

function App() {

  const listarEnventario = async () => {
    const formData = new FormData();
    formData.append("inventariador", localStorage.getItem("inventariador"));
    const response = await fetch("https://yocreoquesipuedohacerlo.com/listarEnventario", {
      method: "post",
      body: formData
    });
    const json = await response.json();
    return json;

  };

  const [list, setlist] = React.useState([]);

  const fetchListar = async () => {
    if (localStorage.getItem("inventariador")) {

      const bienes = await listarEnventario();

      const bienesMap = []
      for (const bien of bienes) {
        const binesOrdenados = {};
        for (const key of ordenDeBienes) {
          binesOrdenados[key] = bien[key];
        }
        bienesMap.push(binesOrdenados);
      }

      setlist(bienesMap);
    }
  }

  React.useEffect(() => {
    (async () => {
      await fetchListar();
    })();
  }, []);


  // form basic information
  const formikBasicInformation = useFormik({
    validateOnMount: true,
    initialValues: {
      // first part form
      dependencia: '',
      responsable: '',
      numeroEtiqueta: '',
      marca: '',
      modelo: '',
      serie: '',
      color: '',
      dimensiones: '',
      estado: '',
      observaciones: '',
      codigo: '',
    },
    validationSchema: formikBasicInformationSchema,
    onSubmit: async (values) => {
      try {
        const formData = new FormData();
        for (const key in values) {
          formData.append(key, values[key].toString())
        }
        formData.append("inventariador", localStorage.getItem("inventariador"));
        const response = await fetch("https://yocreoquesipuedohacerlo.com/enventario", {
          method: "post",
          body: formData
        });
        const json = await response.json();

        formikBasicInformation.resetForm();
        await fetchListar();
        swal("", "SE REGISTRO CORRECTAMENTE !", "success");
      } catch (error) {
        swal("", "ERROR AL REGISTRAR, VUELVA A INTENTARLO GRACIAS !", "error");
      }
    },
  });

  // form basic information
  const formikLogin = useFormik({
    validateOnMount: true,
    initialValues: {
      // first part form
      dni: '',
      //clave: '',
    },
    validationSchema: formikLoginSchema,
    onSubmit: async (values) => {
      if (DNIS.includes((values.dni.trim()))) {
        localStorage.setItem("inventariador", values.dni);
      } else {
        swal("", "USUARIO NO AUTORIZADO !", "error");
      }

    },
  });

  if (!localStorage.getItem("inventariador")) {
    return (
      <Box>
        <Box sx={{ flexGrow: 1 }}>
          <AppBar position="static">
            <Toolbar>
              <IconButton
                size="large"
                edge="start"
                color="inherit"
                aria-label="menu"
                sx={{ mr: 2 }}
              >
                <MenuIcon />
              </IconButton>
              <Typography variant="h6" component="div" align='center' sx={{ flexGrow: 1 }}>
                REGISTRO DE BIENES
              </Typography>
            </Toolbar>
          </AppBar>
        </Box>
        <Box style={{ padding: '25px' }}>
          <Grid container spacing={1}>
            <Grid item xs={12} sm={1} md={2} lg={3}></Grid>

            <Grid item xs={12} sm={10} md={8} lg={6}>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={6} lg={6}>
                  <TextField
                    inputProps={{ maxLength: 100 }}
                    fullWidth
                    size="small"
                    id='dni'
                    label='Ingrese su dni'
                    variant='outlined'
                    sx={{ mb: 0.5 }}
                    value={formikLogin.values.dni}
                    onChange={formikLogin.handleChange}
                    error={formikLogin.touched.dni && Boolean(formikLogin.errors.dni)}
                    helperText={formikLogin.touched.dni && formikLogin.errors.dni}
                  />
                </Grid>
                {/* <Grid item xs={12} sm={12} md={6} lg={6}>
                  <TextField
                    inputProps={{ maxLength: 100 }}
                    fullWidth
                    size="small"
                    id='clave'
                    label='Contraseña'
                    variant='outlined'
                    sx={{ mb: 0.5 }}
                    value={formikLogin.values.clave}
                    onChange={formikLogin.handleChange}
                    error={formikLogin.touched.clave && Boolean(formikLogin.errors.clave)}
                    helperText={formikLogin.touched.clave && formikLogin.errors.clave}
                  />
                </Grid> */}

                <Grid item xs={12} sm={12} md={6} lg={6}>
                  <LoadingButton
                    //disabled={!formikBasicInformation.isValid || formikBasicInformation.isSubmitting}
                    color='primary'
                    variant='contained'
                    loading={formikLogin.isSubmitting}
                    loadingPosition='start'
                    startIcon={<SaveIcon />}
                    onClick={async () => {

                      await formikLogin.submitForm();

                    }}>
                    INGRESAR
                  </LoadingButton>
                </Grid>
              </Grid>
            </Grid>

            <Grid item xs={12} sm={1} md={2} lg={3}></Grid>
          </Grid>
        </Box>
      </Box>
    )
  }

  const test = (data) => {
    for (const key in data) {
      formikBasicInformation.setFieldValue(key, data[key] || "");
    }
  }


  return (
    <Box>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" align='center' sx={{ flexGrow: 1 }}>
              REGISTRO DE BIENES
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>
      <Box style={{ padding: '25px' }}>
        <Divider style={{ marginBottom: "25px" }}>
          <Chip label="REGISTRO DE BIENES" />
        </Divider>
        <Grid container spacing={1}>
          <Grid item xs={12} sm={1} md={2} lg={3}></Grid>

          <Grid item xs={12} sm={10} md={8} lg={6}>
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <Autocomplete
                  disablePortal
                  id="combo-box-demo"
                  options={Catalogo_Nacional}
                  onChange={(event, newValue) => {
                    formikBasicInformation.setFieldValue('codigo', newValue?.Codigo || "");
                  }}
                  renderInput={(params) => <TextField {...params} label="QUE BIEN DESEA REGISTRAR ?" />}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <TextField
                  inputProps={{ maxLength: 100 }}
                  fullWidth
                  disabled
                  size="small"
                  id='codigo'
                  label='Código'
                  variant='outlined'
                  sx={{ mb: 0.5 }}
                  value={formikBasicInformation.values.codigo}
                  onChange={formikBasicInformation.handleChange}
                  error={formikBasicInformation.touched.codigo && Boolean(formikBasicInformation.errors.codigo)}
                  helperText={formikBasicInformation.touched.codigo && formikBasicInformation.errors.codigo}
                />
              </Grid>

              <Grid item xs={12} sm={12} md={6} lg={6}>
                <TextField
                  inputProps={{ maxLength: 100 }}
                  fullWidth
                  size="small"
                  id='numeroEtiqueta'
                  label='Número Etiqueta'
                  variant='outlined'
                  sx={{ mb: 0.5 }}
                  value={formikBasicInformation.values.numeroEtiqueta}
                  onChange={formikBasicInformation.handleChange}
                  error={formikBasicInformation.touched.numeroEtiqueta && Boolean(formikBasicInformation.errors.numeroEtiqueta)}
                  helperText={formikBasicInformation.touched.numeroEtiqueta && formikBasicInformation.errors.numeroEtiqueta}
                />
              </Grid>


              <Grid item xs={12} sm={12} md={6} lg={6}>
                <TextField
                  inputProps={{ maxLength: 100 }}
                  fullWidth
                  size="small"
                  id='marca'
                  label='Marca'
                  variant='outlined'
                  sx={{ mb: 0.5 }}
                  value={formikBasicInformation.values.marca}
                  onChange={formikBasicInformation.handleChange}
                  error={formikBasicInformation.touched.marca && Boolean(formikBasicInformation.errors.marca)}
                  helperText={formikBasicInformation.touched.marca && formikBasicInformation.errors.marca}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <TextField
                  inputProps={{ maxLength: 100 }}
                  fullWidth
                  size="small"
                  id='modelo'
                  label='Modelo'
                  variant='outlined'
                  sx={{ mb: 0.5 }}
                  value={formikBasicInformation.values.modelo}
                  onChange={formikBasicInformation.handleChange}
                  error={formikBasicInformation.touched.modelo && Boolean(formikBasicInformation.errors.modelo)}
                  helperText={formikBasicInformation.touched.modelo && formikBasicInformation.errors.modelo}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <TextField
                  inputProps={{ maxLength: 100 }}
                  fullWidth
                  size="small"
                  id='serie'
                  label='Serie'
                  variant='outlined'
                  sx={{ mb: 0.5 }}
                  value={formikBasicInformation.values.serie}
                  onChange={formikBasicInformation.handleChange}
                  error={formikBasicInformation.touched.serie && Boolean(formikBasicInformation.errors.serie)}
                  helperText={formikBasicInformation.touched.serie && formikBasicInformation.errors.serie}
                />
              </Grid>

              <Grid item xs={12} sm={12} md={6} lg={6}>
                <TextField
                  inputProps={{ maxLength: 100 }}
                  fullWidth
                  size="small"
                  id='color'
                  label='Color'
                  variant='outlined'
                  sx={{ mb: 0.5 }}
                  value={formikBasicInformation.values.color}
                  onChange={formikBasicInformation.handleChange}
                  error={formikBasicInformation.touched.color && Boolean(formikBasicInformation.errors.color)}
                  helperText={formikBasicInformation.touched.color && formikBasicInformation.errors.color}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <TextField
                  inputProps={{ maxLength: 100 }}
                  fullWidth
                  size="small"
                  id='dimensiones'
                  label='Dimensiones'
                  variant='outlined'
                  sx={{ mb: 0.5 }}
                  value={formikBasicInformation.values.dimensiones}
                  onChange={formikBasicInformation.handleChange}
                  error={formikBasicInformation.touched.dimensiones && Boolean(formikBasicInformation.errors.dimensiones)}
                  helperText={formikBasicInformation.touched.dimensiones && formikBasicInformation.errors.dimensiones}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <TextField
                  inputProps={{ maxLength: 100 }}
                  fullWidth
                  size="small"
                  id='estado'
                  label='Estado'
                  variant='outlined'
                  sx={{ mb: 0.5 }}
                  value={formikBasicInformation.values.estado}
                  onChange={formikBasicInformation.handleChange}
                  error={formikBasicInformation.touched.estado && Boolean(formikBasicInformation.errors.estado)}
                  helperText={formikBasicInformation.touched.estado && formikBasicInformation.errors.estado}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <TextField
                  inputProps={{ maxLength: 100 }}
                  fullWidth
                  size="small"
                  id='observaciones'
                  label='Observaciones'
                  variant='outlined'
                  sx={{ mb: 0.5 }}
                  value={formikBasicInformation.values.observaciones}
                  onChange={formikBasicInformation.handleChange}
                  error={formikBasicInformation.touched.observaciones && Boolean(formikBasicInformation.errors.observaciones)}
                  helperText={formikBasicInformation.touched.observaciones && formikBasicInformation.errors.observaciones}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <TextField
                  inputProps={{ maxLength: 100 }}
                  fullWidth
                  size="small"
                  id='dependencia'
                  label='Dependencia'
                  variant='outlined'
                  sx={{ mb: 0.5 }}
                  value={formikBasicInformation.values.dependencia}
                  onChange={formikBasicInformation.handleChange}
                  error={formikBasicInformation.touched.dependencia && Boolean(formikBasicInformation.errors.dependencia)}
                  helperText={formikBasicInformation.touched.dependencia && formikBasicInformation.errors.dependencia}
                />
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6}>
                <TextField
                  inputProps={{ maxLength: 100 }}
                  fullWidth
                  size="small"
                  id='responsable'
                  label='Responsable'
                  variant='outlined'
                  sx={{ mb: 0.5 }}
                  value={formikBasicInformation.values.responsable}
                  onChange={formikBasicInformation.handleChange}
                  error={formikBasicInformation.touched.responsable && Boolean(formikBasicInformation.errors.responsable)}
                  helperText={formikBasicInformation.touched.responsable && formikBasicInformation.errors.responsable}
                />
              </Grid>




              <Grid item xs={12} sm={12} md={6} lg={6}>
                <LoadingButton
                  //disabled={!formikBasicInformation.isValid || formikBasicInformation.isSubmitting}
                  color='primary'
                  variant='contained'
                  loading={formikBasicInformation.isSubmitting}
                  loadingPosition='start'
                  startIcon={<SaveIcon />}
                  onClick={async () => {
                    await formikBasicInformation.submitForm();
                  }}>
                  REGISTRAR
                </LoadingButton>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={1} md={2} lg={3}></Grid>
        </Grid>
        <Divider style={{ marginTop: "25px" }}>
          <Chip label="LISTA DE TUS BIENES REGISTRADOS" />
        </Divider>
        <BasicTable rows={list} callback={test} />
      </Box>
    </Box>
  )
}

export default App;
