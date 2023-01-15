import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import { Form, Formik, FormikHelpers } from 'formik'
import React from 'react'
import * as Yup from 'yup'
import { UsernameFormValues } from '../../types'

const UsernameSchema = Yup.object().shape({
  username: Yup.string().min(3, 'Too Short!').max(16, 'Too Long!').required('Required'),
})

interface Props {
  handleSubmit: (values: UsernameFormValues, formikHelpers: FormikHelpers<UsernameFormValues>) => void
}

export default function UserNameForm(props: Props) {
  const { handleSubmit } = props

  const initialValues: UsernameFormValues = { username: '' }

  return (
    <Formik initialValues={initialValues} onSubmit={handleSubmit} validationSchema={UsernameSchema}>
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
