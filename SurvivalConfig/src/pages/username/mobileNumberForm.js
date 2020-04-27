import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import { Form, Formik } from 'formik'
import React from 'react'
import InputMask from 'react-input-mask'

export default function MobileNumberForm(props) {
  const { handleSubmit, initialPhoneNumber } = props
  return (
    <Formik
      initialValues={{
        mobile: initialPhoneNumber.substr(2),
      }}
      onSubmit={handleSubmit}
    >
      {({ values, errors, handleChange }) => (
        <Form>
          <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
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
          </div>
          <Button color="primary" variant="contained" style={{ marginTop: 32 }} type="submit">
            Change phone number
          </Button>
        </Form>
      )}
    </Formik>
  )
}
