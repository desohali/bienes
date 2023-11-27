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
import PermMediaIcon from '@mui/icons-material/PermMedia';
import ReplayIcon from '@mui/icons-material/Replay';
import { Chip, Divider, Button, ButtonGroup, Box, Grid, TextField } from '@mui/material';
import TableBienes from './TableBienes'
import CardBienes from './CardBienes'
import Catalogo_Nacional from '../Catalogo_Nacional.json'; // Ruta relativa al archivo JSON
import Reniec from '../Reniec.json'; // Ruta relativa al archivo JSON

import { useNavigate } from "react-router-dom";

/* let Catalogo_Nacional_Map = Catalogo_Nacional.map(({ Codigo }) => Codigo);
Catalogo_Nacional_Map = [...new Set(Catalogo_Nacional_Map)];
Catalogo_Nacional_Map = Catalogo_Nacional.filter(({ Codigo }) => Catalogo_Nacional_Map.includes(Codigo)); */

const regex = /[a-zA-Z0-9]/;

const formikBasicInformationSchema = Yup.object().shape({
  // first part form
  _id: Yup.string(),
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

const ordenDeBienes = [
  "_id",
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

function resizeImage(img, { width, height }) {


  const canvas = document.getElementById("canvasPerfil");
  const ctx = canvas.getContext("2d");
  canvas.width = width;
  canvas.height = height;
  if (!img) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    canvas.height = 0;
    return;
  }

  const sizeCanvas = width;
  let positionX = 0;
  let positionY = 0;

  const newImg = new Image();
  newImg.src = window.URL.createObjectURL(img);
  newImg.addEventListener("load", function () {
    width = canvas.width;
    height = ((this.height * width) / this.width);

    positionX = 0;
    positionY = (height < sizeCanvas) ? ((sizeCanvas - height) / 2) : 0;

    ctx.fillStyle = "#ecf0f1";
    ctx.fillRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(this, positionX, positionY, width, height);
    window.URL.revokeObjectURL(this.src);

  }, false);
}

function Registro() {

  const navigate = useNavigate();

  const inputFileRef = React.useRef();

  const [usuario, setusuario] = React.useState("");

  React.useEffect(() => {
    const dniInventariador = localStorage.getItem("inventariador");
    if (dniInventariador) {
      let nombresUsuario = Reniec.find(({ dni }) => dni.trim() == dniInventariador.trim());
      nombresUsuario = ((nombresUsuario || {}).json?.success) ?
        `${nombresUsuario.json.nombres} ${nombresUsuario.json.apellidoPaterno} ${nombresUsuario.json.apellidoMaterno}` :
        dniInventariador || ""
      setusuario(`${nombresUsuario.charAt(0).toUpperCase()}${nombresUsuario.slice(1).toLowerCase()}`);
    } else {
      navigate('/');
    }
  }, []);


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
      for (const bien of (bienes?.data || [])) {
        const binesOrdenados = {};
        for (const key of ordenDeBienes) {
          binesOrdenados[key] = bien[key];
        }
        bienesMap.push(binesOrdenados);
      }

      setlist({ ...bienes, data: bienesMap });
    }
  }

  React.useEffect(() => {
    (async () => { await fetchListar(); })();
  }, []);


  // form basic information
  const formikBasicInformation = useFormik({
    validateOnMount: true,
    initialValues: {
      // first part form
      _id: '',
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
        const [firstImage] = inputFileRef.current.files;
        const formData = new FormData();
        for (const key in values) {
          formData.append(key, values[key].toString())
        }
        if (firstImage) {
          // Obtener los datos de la imagen desde el canvas en formato base64
          const imageDataURL = document.getElementById("canvasPerfil").toDataURL('image/png', 1);
          formData.append("imagen", imageDataURL);
        }

        formData.append("inventariador", localStorage.getItem("inventariador"));
        const response = await fetch("https://yocreoquesipuedohacerlo.com/enventario", {
          method: "post",
          body: formData
        });
        await response.json();

        formikBasicInformation.resetForm();
        // limpiamos la imagen
        inputFileRef.current.value = '';
        const canvas = document.getElementById("canvasPerfil");
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.height = 0;
        // limpiamos la imagen fin
        await fetchListar();
        swal("", `Se ${values._id ? 'actualizó' : 'registró'} correctamente!`, "success");
      } catch (error) {
        swal("", "Error al registrar, vuela a intentar, gracias!", "error");
      }
    },
  });




  const clonarBien = (data) => {
    for (const key in data) {
      formikBasicInformation.setFieldValue(key, data[key] || "");
    }
  }


  return (
    <Box>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            <Typography variant="h6" component="div" align='center' sx={{ flexGrow: 1 }}>
              {usuario}
            </Typography>
          </Toolbar>
        </AppBar>
      </Box>
      <Box style={{ padding: '6px' }}>
        <Divider style={{ marginBottom: "25px" }}>
          <Chip label="Registro de bienes" color="success" />
        </Divider>
        <Grid container spacing={0}>
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
                  renderInput={(params) => <TextField {...params} label="Que bien desea registrar?" />}
                />
              </Grid>
              <Grid item xs={6} sm={6} md={6} lg={6}>
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

              <Grid item xs={6} sm={6} md={6} lg={6}>
                <TextField
                  inputProps={{ maxLength: 100 }}
                  fullWidth
                  size="small"
                  id='numeroEtiqueta'
                  label='N° Etiqueta'
                  variant='outlined'
                  sx={{ mb: 0.5 }}
                  value={formikBasicInformation.values.numeroEtiqueta}
                  onChange={formikBasicInformation.handleChange}
                  error={formikBasicInformation.touched.numeroEtiqueta && Boolean(formikBasicInformation.errors.numeroEtiqueta)}
                  helperText={formikBasicInformation.touched.numeroEtiqueta && formikBasicInformation.errors.numeroEtiqueta}
                />
              </Grid>


              <Grid item xs={6} sm={6} md={6} lg={6}>
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
              <Grid item xs={6} sm={6} md={6} lg={6}>
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
              <Grid item xs={6} sm={6} md={6} lg={6}>
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

              <Grid item xs={6} sm={6} md={6} lg={6}>
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
                <input
                  type='file'
                  accept='image/*'
                  style={{ display: "none" }}
                  ref={inputFileRef}
                  onChange={({ target }) => {

                    const [firstFile] = target.files;
                    resizeImage(firstFile, { width: 300, height: 300 });

                  }} />
                <Button onClick={() => inputFileRef.current.click()} fullWidth startIcon={<PermMediaIcon />} variant="outlined">
                  Imagen
                </Button>
                <div style={{ width: "100%", textAlign: "center" }}><canvas id="canvasPerfil" height={0}></canvas></div>
              </Grid>



              <Grid item xs={12} sm={12} md={6} lg={6}>

                <ButtonGroup style={{ width: "100%" }} variant="contained" aria-label="outlined primary button group">
                  <LoadingButton
                    style={{ width: "100%" }}
                    color='warning'
                    variant='contained'
                    loading={formikBasicInformation.isSubmitting}
                    loadingPosition='start'
                    startIcon={<ReplayIcon />}
                    onClick={async () => {
                      await formikBasicInformation.resetForm();
                      inputFileRef.current.value = '';
                      const canvas = document.getElementById("canvasPerfil");
                      const ctx = canvas.getContext('2d');
                      ctx.clearRect(0, 0, canvas.width, canvas.height);
                      canvas.height = 0;
                    }}>
                    Limpiar
                  </LoadingButton>
                  <LoadingButton
                    style={{ width: "100%" }}
                    color={Boolean(formikBasicInformation.values._id) ? "secondary" : "primary"}
                    variant='contained'
                    loading={formikBasicInformation.isSubmitting}
                    loadingPosition='start'
                    startIcon={<SaveIcon />}
                    onClick={async () => {
                      await formikBasicInformation.submitForm();
                    }}>
                    {Boolean(formikBasicInformation.values._id) ? "Actualizar" : "Registrar"}
                  </LoadingButton>
                </ButtonGroup>

              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={1} md={2} lg={3}></Grid>
        </Grid>
        <Divider style={{ marginTop: "25px", marginBottom: "25px" }}>
          <Chip label={`${usuario.split(" ")[0]} has registrado ${(list?.count || 0)} bienes!`} color="success" />
        </Divider>
        {/* <TableBienes rows={(list?.data || [])} callback={clonarBien} /> */}
        <CardBienes rows={(list?.data || [])} callback={clonarBien} />
      </Box>
    </Box>
  )
}

export default Registro;
