import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/styles'
import Tab from '@material-ui/core/Tab'
import Tabs from '@material-ui/core/Tabs'
import _ from 'lodash'
import React, { useState } from 'react'
import { useParams } from 'react-router'
import { PageWrapper } from '../styles'

const useStyles = makeStyles(theme => ({
  tabs: {
    justifyContent: 'space-evenly',
  },
  paper: {
    height: 300,
    display: 'flex',
    flexDirection: 'column',
  },
  paperContent: {
    padding: 20,
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
        slots.push({ startHour: currentStart, endHour: index })
        currentStart = undefined
      }
      if (value && index === 23) {
        slots.push({ startHour: currentStart, endHour: 24 })
      }
    }
  }
  return slots
}

const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']

export default function UsernamePage() {
  const { username } = useParams()
  const classes = useStyles()
  const [day, setDay] = useState(0)
  const [selected, setSelected] = useState(
    _.times(7, i => ({
      day: i,
      selected: _.times(24, () => false),
    }))
  )

  const handleChange = (hour, value) => {
    const copy = _.cloneDeep(selected)
    copy[day][hour] = value
    setSelected(copy)
  }

  return (
    <PageWrapper>
      Editing {username}
      <div style={{ marginTop: 100 }}>
        <Paper square className={classes.paper}>
          <Tabs
            classes={{ flexContainer: classes.tabs }}
            value={day}
            indicatorColor="primary"
            textColor="primary"
            onChange={(event, value) => setDay(value)}
            aria-label="disabled tabs example"
          >
            {_.times(7, i => (
              <Tab label={DAYS[i]} />
            ))}
          </Tabs>
          <div className={classes.paperContent}>
            {_.times(24, i => (
              <HourBox key={i} hour={i} value={selected[day][i]} handleChange={value => handleChange(i, value)} />
            ))}
          </div>
        </Paper>
      </div>
    </PageWrapper>
  )
}
