import Button from '@material-ui/core/Button'
import TextField from '@material-ui/core/TextField'
import { Form, Formik } from 'formik'
import React from 'react'
import InputMask from 'react-input-mask'
import * as Yup from 'yup'

const MobileChangeSchema = Yup.object().shape({
  mobile: Yup.string()
    .required('Required')
    .matches(/^\(\d{3}\) \d{3}-\d{4}$/, { message: 'Invalid phone number' }),
})

export default function MobileNumberForm(props) {
  const { handleSubmit, initialPhoneNumber } = props
  return (
    <Formik
      initialValues={{
        mobile: initialPhoneNumber.substr(2),
      }}
      onSubmit={handleSubmit}
      validationSchema={MobileChangeSchema}
      isInitialValid
      enableReinitialize
    >
      {({ values, errors, handleChange, isValid, dirty }) => (
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
          <Button
            color="primary"
            variant="contained"
            style={{ marginTop: 32 }}
            type="submit"
            disabled={!isValid || !dirty}
          >
            Change Phone Number
          </Button>
        </Form>
      )}
    </Formik>
  )
}
