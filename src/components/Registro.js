import * as React from 'react';
import { useFormik } from 'formik';
import * as Yup from "yup";
import SaveIcon from '@mui/icons-material/Save';
import { LoadingButton } from '@mui/lab';
import swal from 'sweetalert';

import Autocomplete from '@mui/material/Autocomplete';
import PermMediaIcon from '@mui/icons-material/PermMedia';
import ReplayIcon from '@mui/icons-material/Replay';
import { Chip, Divider, Button, ButtonGroup, Box, Grid, TextField, Accordion, AccordionSummary, AccordionDetails, Alert, Typography } from '@mui/material';
import Tooltip, { tooltipClasses } from '@mui/material/Tooltip';
import CardBienes from './CardBienes'
import Catalogo_Nacional from '../Catalogo_Nacional.json'; // Ruta relativa al archivo JSON

import { useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from 'react-redux';
import { setUltimoBien, setUser } from '../features/userSlice';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { styled } from '@mui/material/styles';

const HtmlTooltip = styled(({ className, ...props }) => (
  <Tooltip {...props} placement="top" classes={{ popper: className }} />
))(({ theme }) => ({
  [`& .${tooltipClasses.tooltip}`]: {
    backgroundColor: '#f5f5f9',
    color: 'rgba(0, 0, 0, 0.87)',
    maxWidth: 220,
    fontSize: theme.typography.pxToRem(12),
    border: '1px solid #dadde9',
  },
}));

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
  /* "codigoCorrelativo", */
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
};

const listarEnventario = async (dni) => {
  const formData = new FormData();
  formData.append("inventariador", dni);

  const response = await fetch("https://yocreoquesipuedohacerlo.com/listarEnventario", {
    method: "post",
    body: formData
  });
  const { status, message = "Usuario no autorizado!", data, count } = await response.json();
  /* if (!status) {
    swal("", message, "warning");
  } */

  return { data, count };
};

const fetchListar = async (usuario) => {
  if (usuario) {
    const bienes = await listarEnventario(usuario?.dni);
    const bienesMap = []
    for (const bien of (bienes?.data || [])) {
      const binesOrdenados = {};
      for (const key of ordenDeBienes) {
        binesOrdenados[key] = bien[key];
      }
      bienesMap.push(binesOrdenados);
    }

    return { ...bienes, data: bienesMap };

  }
};

function Registro() {

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user: usuario, ultimoBien } = useSelector((state) => state.user);

  const inputFileRef = React.useRef();

  React.useEffect(() => {
    let inventariador = localStorage.getItem("newInventariador");
    if (inventariador) {
      inventariador = JSON.parse(inventariador);
      if (inventariador?.estado) {
        dispatch(setUser(inventariador));
      } else {
        navigate('/');
      }
    } else {
      navigate('/');
    }
  }, []);


  const [list, setlist] = React.useState([]);
  console.log('list', list)

  React.useEffect(() => {
    if (usuario) {
      fetchListar(usuario).then((response) => {
        setlist(response);
        const [firstBien] = (response?.data || []);
        dispatch(setUltimoBien(firstBien));
      });
    }
  }, [usuario]);


  // atajos de teclado
  React.useEffect(() => {
    const handleKeyPress = (event) => {
      // Verifica si la tecla presionada es 'Ctrl + S'
      const keyPressed = event.key.toLowerCase();
      if (event.ctrlKey && event.altKey && keyPressed === 'g') {
        formikBasicInformation.submitForm();
      }

      const [firstBien = {}] = (list?.data || []);
      if (event.ctrlKey && event.altKey && keyPressed === 'u') {
        formikBasicInformation.resetForm();
        for (const key in firstBien) {
          formikBasicInformation.setFieldValue(key, firstBien[key] || "");
        }
      }
    };

    // Agregar un listener para el evento 'keydown'
    window.addEventListener('keydown', handleKeyPress);

    // Remover el listener cuando el componente se desmonte
    return () => {
      window.removeEventListener('keydown', handleKeyPress);
    };
  }, [list]);


  // form basic information
  const formikBasicInformation = useFormik({
    validateOnMount: true,
    initialValues: {
      // first part form
      _id: '',
      dependencia: '',
      responsable: '',
      numeroEtiqueta: '',
      marca: 'S/M',
      modelo: 'S/M',
      serie: 'S/S',
      color: '',
      dimensiones: 'S/D',
      estado: '',
      observaciones: '',
      codigo: '',
    },
    validationSchema: formikBasicInformationSchema,
    onSubmit: async (values) => {
      try {
        if (!usuario?.dni) {
          navigate('/');
          return;
        }
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

        formData.append("inventariador", usuario?.dni);
        const response = await fetch("https://yocreoquesipuedohacerlo.com/enventario", {
          method: "post",
          body: formData
        });

        const { status, message = "Usuario no autorizado!" } = await response.json();
        if (!status) {
          swal("", message, "warning");
          return;
        }

        formikBasicInformation.resetForm();
        // limpiamos la imagen
        inputFileRef.current.value = '';
        const canvas = document.getElementById("canvasPerfil");
        const ctx = canvas.getContext('2d');
        ctx.clearRect(0, 0, canvas.width, canvas.height);
        canvas.height = 0;
        // limpiamos la imagen fin
        const response2 = await fetchListar(usuario);
        setlist(response2);

        const [firstBien] = (response2?.data || []);
        dispatch(setUltimoBien(firstBien));


        swal("", `Se ${values._id ? 'actualizó' : 'registró'} correctamente!`, "success");
      } catch (error) {
        swal("", "El sistema esta fuera de servicio, gracias!", "warning");
      }
    },
  });


  const clonarBien = (data) => {
    for (const key in data) {
      formikBasicInformation.setFieldValue(key, data[key] || "");
    }
  };


  return (
    <Box>
      <Box style={{ padding: '6px' }}>
        <Divider style={{ marginBottom: "25px" }}>
          <Chip label="Registro de bienes" color="success" />
        </Divider>
        <Grid container spacing={3}>
          <Grid item xs={12} sm={1} md={2} lg={3}>

            <Accordion defaultExpanded>
              <HtmlTooltip
                title={
                  <React.Fragment>
                    <Typography color="inherit">Ultimo bien registrado</Typography>
                    {ultimoBien && <b>
                      {`${Catalogo_Nacional.find(({ Codigo }) => Codigo == ultimoBien.codigo)?.label ?? ''} # Etiqueta : ${ultimoBien?.numeroEtiqueta}`}
                    </b>}
                  </React.Fragment>
                }
              >
                <AccordionSummary
                  expandIcon={<ExpandMoreIcon />}
                  aria-controls="panel1-content"
                  id="panel1-header"
                >
                  {ultimoBien ? <strong> {`${Catalogo_Nacional.find(({ Codigo }) => Codigo == ultimoBien.codigo)?.label ?? ''} : ${ultimoBien?.numeroEtiqueta}`}</strong> : ""}
                </AccordionSummary>
              </HtmlTooltip>
              <AccordionDetails>
                <Alert severity="info">Ctrl + Alt + G. (Registrar un bien)</Alert>
                <Alert severity="info">Ctrl + Alt + U. (Clonar el ultimo bien)</Alert>
              </AccordionDetails>
            </Accordion>

          </Grid>

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

          <Chip label={`${usuario?.nombres.charAt(0).toUpperCase()}${usuario?.nombres.slice(1).toLowerCase()} has registrado ${(list?.count || 0)} bienes!`} color="success" />
        </Divider>
        {/* <TableBienes rows={(list?.data || [])} callback={clonarBien} /> */}
        <CardBienes rows={(list?.data || [])} callback={clonarBien} />
      </Box>
    </Box>
  )
}

export default Registro;
