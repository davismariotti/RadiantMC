import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import Typography from '@material-ui/core/Typography'
import { Form, Formik } from 'formik'
import React from 'react'
import * as Yup from 'yup'

const UsernameSchema = Yup.object().shape({
  username: Yup.string().min(3, 'Too Short!').max(16, 'Too Long!').required('Required'),
})

export default function UserNameForm(props) {
  const { handleSubmit } = props
  return (
    <Formik
      initialValues={{
        username: '',
      }}
      onSubmit={handleSubmit}
      validationSchema={UsernameSchema}
    >
      {({ values, errors, handleChange, handleBlur }) => (
        <Form>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', textAlign: 'center' }}>
            <Typography variant="body1" style={{ width: 600 }}>
              Enter your Minecraft username. If you've already signed up, you will be redirected to your account page.
              If you haven't signed up, you will need to provide your phone number on the next screen.
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
              />
              <Button color="primary" variant="contained" style={{ marginLeft: 16 }} type="submit">
                Look up
              </Button>
            </div>
          </div>
        </Form>
      )}
    </Formik>
  )
}
