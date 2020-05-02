import LinearProgress from '@material-ui/core/LinearProgress'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/styles'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import Typography from '@material-ui/core/Typography'
import _ from 'lodash'
import React, { useState } from 'react'
import { useParams } from 'react-router'
import useUpdateMobileNumber from '../../hooks/useUpdateMobileNumber'
import useUpdateTimeSlots from '../../hooks/useUpdateTimeSlots'
import useUsernameRecord from '../../hooks/useUsernameRecord'
import { PageWrapper } from '../styles'
import MobileNumberForm from './mobileNumberForm'
import TimeSlots from './timeSlots'

const DAYS = ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday']

const useStyles = makeStyles({
  tabs: {
    justifyContent: 'space-evenly',
  },
  paper: {
    display: 'flex',
    flexDirection: 'column',
    marginTop: 32,
  },
  paperContent: {
    padding: 20,
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
  },
  progress: {
    marginTop: 16,
    width: 660,
  },
  typography: {
    marginBottom: 32,
    paddingLeft: 50,
    paddingRight: 50,
  },
})

export default function UsernamePage() {
  const { id } = useParams()

  const classes = useStyles()
  const [day, setDay] = useState(0)

  const { data, loading: loadingUsernameRecord, error, refetch } = useUsernameRecord(id)
  const [updateMobileNumber, { loading: updatingMobileNumber }] = useUpdateMobileNumber(id)
  const [updateTimeSlots, { loading: updatingTimeSlots }] = useUpdateTimeSlots(id)
  const loading = loadingUsernameRecord || updatingMobileNumber || updatingTimeSlots

  const handleSubmitMobileNumberChange = values => {
    updateMobileNumber({ mobile: `+1${values.mobile.replace(/\D/g, '')}` }).then(refetch)
  }

  if (error) {
    return <div>{error.toString()}</div>
  }

  return (
    <PageWrapper>
      {data && (
        <>
          <Typography variant="h4">{data.minecraft_username}</Typography>
          <div style={{ marginTop: 32 }}>
            <Paper
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                padding: 20,
              }}
              elevation={2}
            >
              <MobileNumberForm handleSubmit={handleSubmitMobileNumberChange} initialPhoneNumber={data.mobile} />
            </Paper>
            <Paper square className={classes.paper} elevation={2}>
              <Tabs
                classes={{ flexContainer: classes.tabs }}
                value={day}
                indicatorColor="primary"
                textColor="primary"
                onChange={(event, value) => setDay(value)}
                aria-label="disabled tabs example"
              >
                {_.times(7, i => (
                  <Tab key={i} label={DAYS[i]} />
                ))}
              </Tabs>
              <div className={classes.paperContent}>
                <Typography variant="body1" className={classes.typography}>
                  Here are your time slots. If someone logs into the server during a time you define here, you'll be
                  notified by text.
                </Typography>
                <TimeSlots slots={data.time_slots} day={day} refetch={refetch} updateTimeSlots={updateTimeSlots} />
              </div>
            </Paper>
          </div>
        </>
      )}
      {loading && <LinearProgress className={classes.progress} />}
    </PageWrapper>
  )
}
