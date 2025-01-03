import * as React from 'react';
import { useFormik } from 'formik';
import * as Yup from "yup";
import swal from 'sweetalert';
import ArrowForwardIcon from '@mui/icons-material/ArrowForward';
import { LoadingButton } from '@mui/lab';
import { Box, Grid, TextField } from '@mui/material';
import { useNavigate } from "react-router-dom";
import SecurityIcon from '@mui/icons-material/Security';
import { useDispatch, useSelector } from 'react-redux';
import { setUser } from '../features/userSlice';


const formikLoginSchema = Yup.object().shape({
  dni: Yup.string().min(8, "DNI es muy corto!").max(9, "DNI es muy largo!").required("DNI es requerido!"),
});

const autenticarInventariador = async ({ dni }) => {
  const formData = new FormData();
  formData.append("dni", dni);

  const response = await fetch("https://yocreoquesipuedohacerlo.com/autenticarInventariador", {
    method: "post",
    body: formData
  });

  return await response.json();
};

const Login = () => {

  const dispatch = useDispatch();
  const navigate = useNavigate();

  React.useEffect(() => {
    if (localStorage.getItem("newInventariador")) {
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

      const { status, message, data } = await autenticarInventariador(values);
      if (!status) {
        swal("", message, "warning");
        return;
      }

      localStorage.setItem("newInventariador", JSON.stringify(data));
      dispatch(setUser(data));
      navigate('/registro');
    },
  });

  return (
    <Box>
      <Box style={{ padding: '25px' }}>
        <Grid container spacing={1}>
          <Grid item xs={12} sm={1} md={2} lg={4}></Grid>

          <Grid item xs={12} sm={10} md={8} lg={4}>
            <Grid container spacing={[4, 2]}>

              <Grid item xs={12} sm={12} md={12} lg={12}>
                <div style={{ width: "100%", textAlign: "center" }}>

                  <SecurityIcon style={{ fontSize: "128px", color: "#1976d2" }} />
                </div>
              </Grid>
              <Grid item xs={12} sm={12} md={12} lg={12}>
                <TextField
                  inputProps={{ maxLength: 100 }}
                  fullWidth
                  size="small"
                  id='dni'
                  label='Ingrese DNI'
                  variant='outlined'
                  sx={{ mb: 0.5 }}
                  value={formikLogin.values.dni}
                  onChange={formikLogin.handleChange}
                  error={formikLogin.touched.dni && Boolean(formikLogin.errors.dni)}
                  helperText={formikLogin.touched.dni && formikLogin.errors.dni}
                />
              </Grid>

              <Grid item xs={12} sm={12} md={12} lg={12}>
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

          <Grid item xs={12} sm={1} md={2} lg={4}></Grid>
        </Grid>
      </Box>
    </Box>
  );
}

export default Login;
