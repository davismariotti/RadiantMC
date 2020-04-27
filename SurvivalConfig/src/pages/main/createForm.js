import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import { Form, Formik } from 'formik'
import React from 'react'
import InputMask from 'react-input-mask'
import * as Yup from 'yup'

const CreateSchema = Yup.object().shape({
  username: Yup.string().min(3, 'Too Short!').max(16, 'Too Long!').required('Required'),
  mobile: Yup.string().required('Required'),
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
    >
      {({ values, errors, handleChange, handleBlur }) => {
        return (
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
                error={!!errors.username}
                helperText={errors.username}
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
              <Button color="primary" variant="contained" style={{ marginLeft: 16 }} type="submit">
                Create
              </Button>
            </div>
          </Form>
        )
      }}
    </Formik>
  )
}
