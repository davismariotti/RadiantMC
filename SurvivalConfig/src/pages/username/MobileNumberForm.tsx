import Button from '@mui/material/Button'
import TextField from '@mui/material/TextField'
import { Form, Formik, FormikHelpers } from 'formik'
import React from 'react'
import InputMask from 'react-input-mask'
import * as Yup from 'yup'
import { MobileNumberFormValues } from '../../types'

const MobileChangeSchema = Yup.object().shape({
  mobile: Yup.string()
    .required('Required')
    .matches(/^\(\d{3}\) \d{3}-\d{4}$/, { message: 'Invalid phone number' }),
})

interface Props {
  handleSubmit: (values: MobileNumberFormValues, formikHelpers: FormikHelpers<MobileNumberFormValues>) => void
  initialPhoneNumber: string
}

export default function MobileNumberForm(props: Props) {
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
              <TextField
                id="mobile-input"
                label="Phone number"
                variant="outlined"
                name="mobile"
                value={values.mobile}
                error={!!errors.mobile}
                helperText={errors.mobile}
              />
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
