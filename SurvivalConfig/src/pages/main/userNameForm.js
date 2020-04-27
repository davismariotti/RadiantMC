import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
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
          <div style={{ display: 'flex', alignItems: 'center' }}>
            <TextField
              id="username-input"
              label="Username"
              variant="outlined"
              name="username"
              onChange={handleChange}
              onBlur={handleBlur}
              value={values.username}
              error={errors.username}
              helperText={errors.username}
            />
            <Button color="primary" variant="contained" style={{ marginLeft: 16 }} type="submit">
              Look up
            </Button>
          </div>
        </Form>
      )}
    </Formik>
  )
}
