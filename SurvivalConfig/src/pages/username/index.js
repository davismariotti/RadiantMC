import Button from '@material-ui/core/Button'
import CircularProgress from '@material-ui/core/CircularProgress'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/styles'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import _ from 'lodash'
import React, { useState } from 'react'
import { useParams } from 'react-router'
import useUpdateMobileNumber from '../../hooks/useUpdateMobileNumber'
import useUpdateTimeSlots from '../../hooks/useUpdateTimeSlots'
import useUsernameRecord from '../../hooks/useUsernameRecord'
import { PageWrapper } from '../styles'
import MobileNumberForm from './mobileNumberForm'

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

const useStyles = makeStyles(theme => ({
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
  hourBoxContainer: {
    display: 'flex',
    flexDirection: 'row',
    justifyContent: 'center',
    flexGrow: 1,
    alignItems: 'center',
  },
  hourBox: {
    margin: 3,
    height: 45,
    width: 45,
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: props => (props.active ? theme.palette.primary.main : ''),
  },
  updateTimeSlotsButton: {
    marginTop: 32,
  },
}))

const formatHour = hour => {
  if (hour === 0) {
    return '12am'
  } else if (hour === 12) {
    return '12pm'
  } else if (hour < 13) {
    return `${hour}am`
  }
  return `${hour - 12}pm`
}

const HourBox = props => {
  const { handleChange, value, hour } = props
  const classes = useStyles({ active: value })
  return (
    <Paper elevation={2} className={classes.hourBox} onClick={() => handleChange(!value)}>
      {formatHour(hour)}
    </Paper>
  )
}

const formatSlots = selectedHours => {
  let currentStart = undefined
  const slots = []
  for (let index = 0; index < selectedHours.length; index++) {
    const value = selectedHours[index]
    if (currentStart === undefined) {
      if (value) {
        currentStart = index
      }
    }
    if (currentStart !== undefined) {
      if (!value) {
        slots.push({ start_time: currentStart, end_time: index })
        currentStart = undefined
      }
      if (value && index === 23) {
        slots.push({ start_time: currentStart, end_time: 24 })
      }
    }
  }
  return slots
}

const deconstructSlots = days => {
  const selected = []
  for (let day of days) {
    const hours = _.times(24, () => false)
    for (let slot of day.slots) {
      const start_time = slot.start_time
      const end_time = slot.end_time
      _.range(start_time, end_time).forEach(i => (hours[i] = true))
    }
    selected.push({
      day: day.day,
      selected: hours,
    })
  }

  return selected
}

export default function UsernamePage() {
  const { id } = useParams()

  const classes = useStyles()
  const [day, setDay] = useState(0)
  const [selected, setSelected] = useState(
    _.times(7, i => ({
      day: i,
      selected: _.times(24, () => false),
    }))
  )

  const { data, error, refetch } = useUsernameRecord(id, {
    onCompleted: data => {
      setSelected(deconstructSlots(data.time_slots))
    },
  })
  const [updateTimeSlots] = useUpdateTimeSlots(id)
  const [updateMobileNumber] = useUpdateMobileNumber(id)

  const handleSubmitMobileNumberChange = values => {
    updateMobileNumber({ mobile: `+1${values.mobile.replace(/\D/g, '')}` }).then(refetch)
  }

  const handleUpdateTimeSlots = () => {
    updateTimeSlots({
      time_slots: selected.map((value, idx) => ({
        day: value.day,
        slots: formatSlots(value.selected),
      })),
    }).then(refetch)
  }

  const handleChange = (hour, value) => {
    const copy = _.cloneDeep(selected)
    copy[day].selected[hour] = value
    setSelected(copy)
  }

  if (error) {
    return <div>{error.toString()}</div>
  }

  if (!data) {
    return (
      <PageWrapper>
        <CircularProgress style={{ marginTop: 150 }} />
      </PageWrapper>
    )
  }

  const hours = _.chunk(
    _.times(24, i => (
      <HourBox key={i} hour={i} value={selected[day].selected[i]} handleChange={value => handleChange(i, value)} />
    )),
    12
  )

  return (
    <PageWrapper>
      Editing {data.minecraft_username}
      <div style={{ marginTop: 100 }}>
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
            <div className={classes.hourBoxContainer}>{hours[0]}</div>
            <div className={classes.hourBoxContainer}>{hours[1]}</div>
            <Button
              color="primary"
              variant="contained"
              onClick={handleUpdateTimeSlots}
              className={classes.updateTimeSlotsButton}
            >
              Update Time Slots
            </Button>
          </div>
        </Paper>
      </div>
    </PageWrapper>
  )
}
