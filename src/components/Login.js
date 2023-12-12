import * as React from 'react';
import { useFormik } from 'formik';
import * as Yup from "yup";
import swal from 'sweetalert';
import AppBar from '@mui/material/AppBar';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { LoadingButton } from '@mui/lab';
import { Toolbar, Typography, Box, Grid, TextField } from '@mui/material';
import { useNavigate } from "react-router-dom";

const DNIS = [
  "74026816", "48115295", "42142607", "77491421", "61611530", "46984573", "73422124", "43917257", "60507843",
  "71033109", "76723091", "71248260", "61702269", "71272141", "77014764", "75259917", "71391049", "73088000",
  "12345678", "74060603", "75624129", "72708818", "73456805", "71790187", "71067923", "76400492", "74931655",
  "71600418", "71820114", "75524592", "61025653", "26703070", "26706371", "59384120", "76937817", "40028772",
  "77014664", "42703180", "71062503", "72546177", "73662634", "75514017", "72408548", "74224991", "74917084",
  "72255382", "74969966", "43558264", "46966682", "73422125", "45715771", "75022980", "70495793", "12345679",
  "97654321", "75022847", "71062506", "75359845", "70191785", "73196892", "43014008", "18090716", "005938412",
  "76805412", "47289731", "43014008", "47164545", "46866718", "47507504"
];

const formikLoginSchema = Yup.object().shape({
  dni: Yup.string().min(8, "dni es muy corto!").max(9, "dni es muy largo!").required("dni es requerido!"),
});

const Login = () => {

  const navigate = useNavigate();
  React.useEffect(() => {
    if (localStorage.getItem("inventariador")) {
      navigate('/registro');
    }
  }, []);


  // form basic information
  const formikLogin = useFormik({
    validateOnMount: true,
    initialValues: {
      dni: '',
    },
    validationSchema: formikLoginSchema,
    onSubmit: async (values) => {
      if (DNIS.includes((values.dni.trim()))) {
        localStorage.setItem("inventariador", values.dni);
        navigate('/registro');
      } else {
        swal("", "Usuario no autorizado!", "error");
      }
    },
  });

  return (
    <Box>
      <Box sx={{ flexGrow: 1 }}>
        <AppBar position="static">
          <Toolbar>
            {/* <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
            >
              <MenuIcon />
            </IconButton> */}
            <Typography variant="h6" component="div" align='center' sx={{ flexGrow: 1 }}>
              Registro de bienes
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
                  label='Ingrese dni'
                  variant='outlined'
                  sx={{ mb: 0.5 }}
                  value={formikLogin.values.dni}
                  onChange={formikLogin.handleChange}
                  error={formikLogin.touched.dni && Boolean(formikLogin.errors.dni)}
                  helperText={formikLogin.touched.dni && formikLogin.errors.dni}
                />
              </Grid>

              <Grid item xs={12} sm={12} md={6} lg={6}>
                <LoadingButton
                  style={{ width: "100%" }}
                  color='primary'
                  variant='contained'
                  loading={formikLogin.isSubmitting}
                  loadingPosition='start'
                  startIcon={<ArrowForwardIcon />}
                  onClick={async () => {
                    await formikLogin.submitForm();
                  }}>
                  Ingresar
                </LoadingButton>
              </Grid>
            </Grid>
          </Grid>

          <Grid item xs={12} sm={1} md={2} lg={3}></Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default Login;
