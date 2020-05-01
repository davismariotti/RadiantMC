import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import { Form, Formik } from 'formik'
import React from 'react'
import InputMask from 'react-input-mask'
import * as Yup from 'yup'

const CreateSchema = Yup.object().shape({
  username: Yup.string().min(3, 'Too Short!').max(16, 'Too Long!').required('Required'),
  mobile: Yup.string()
    .required('Required')
    .matches(/^\(\d{3}\) \d{3}-\d{4}$/, { message: 'Invalid phone number' }),
})

export default function CreateForm(props) {
  const { handleSubmit, initialValues } = props
  return (
    <Formik
      initialValues={{
        username: '',
        mobile: '',
        ...initialValues,
      }}
      onSubmit={handleSubmit}
      validationSchema={CreateSchema}
      isInitialValid={false}
    >
      {({ values, errors, handleChange, handleBlur, isValid, touched }) => {
        return (
          <Form>
            <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
              <Typography variant="body1" style={{ width: 600 }}>
                Enter your Minecraft username, and phone number you want to be notified at when other players login. You
                can configure specific times to be notified on the next screen.
              </Typography>
              <div style={{ display: 'flex', alignItems: 'center', marginTop: 32 }}>
                <TextField
                  id="username-input"
                  label="Username"
                  variant="outlined"
                  name="username"
                  onChange={handleChange}
                  onBlur={handleBlur}
                  value={values.username}
                  error={!!errors.username}
                  helperText={errors.username}
                  style={{ marginRight: 16 }}
                />
                <InputMask mask="(999) 999-9999" value={values.mobile} onChange={handleChange} maskChar=" ">
                  {() => (
                    <TextField
                      id="mobile-input"
                      label="Phone number"
                      variant="outlined"
                      name="mobile"
                      value={values.mobile}
                      error={!!errors.mobile}
                      helperText={errors.mobile}
                    />
                  )}
                </InputMask>
                <Button
                  color="primary"
                  variant="contained"
                  style={{ marginLeft: 16 }}
                  type="submit"
                  disabled={!isValid}
                >
                  Create
                </Button>
              </div>
            </div>
          </Form>
        )
      }}
    </Formik>
  )
}
