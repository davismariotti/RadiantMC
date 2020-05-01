import Button from '@material-ui/core/Button'
import IconButton from '@material-ui/core/IconButton'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemSecondaryAction from '@material-ui/core/ListItemSecondaryAction'
import ListItemText from '@material-ui/core/ListItemText'
import Paper from '@material-ui/core/Paper'
import { makeStyles } from '@material-ui/core/styles'
import Tab from '@material-ui/core/Tab'
import EditIcon from '@material-ui/icons/Edit'
import DeleteIcon from '@material-ui/icons/Delete'
import _ from 'lodash'
import React, { useState } from 'react'
import { useParams } from 'react-router'
import useUpdateTimeSlots from '../../hooks/useUpdateTimeSlots'
import HourSelectorDialog from './hourSelectorDialog'
import { formatHour } from './utils'

const useStyles = makeStyles({
  paper: {
    width: 300,
  },
  button: {
    marginTop: 32,
  },
})

export default function TimeSlots(props) {
  const { day, slots, refetch, updateTimeSlots } = props
  const { id } = useParams()

  const daySlots = slots.find(s => s.day === day).slots

  const [slotEditing, setSlotEditing] = useState()
  const [open, setOpen] = useState(false)

  const handleAddSlot = addedSlot => {
    const newDaySlots = [...daySlots, addedSlot]

    const newDays = [...slots.filter(d => d.day !== day), { day, slots: newDaySlots }]

    updateTimeSlots({
      time_slots: newDays,
    }).then(refetch)
  }

  const handleEditSlot = editedSlot => {
    const newDaySlots = [...daySlots.filter(s => s.id !== editedSlot.id), editedSlot]

    const newDays = [...slots.filter(d => d.day !== day), { day, slots: newDaySlots }]

    updateTimeSlots({
      time_slots: newDays,
    }).then(refetch)
  }

  const handleRemoveSlot = removedSlotId => {
    const newDaySlots = daySlots.filter(s => s.id !== removedSlotId)

    const newDays = [...slots.filter(d => d.day !== day), { day, slots: newDaySlots }]

    updateTimeSlots({
      time_slots: newDays,
    }).then(refetch)
  }

  const copyDayToAllDays = () => {
    const newDays = _.times(7, i => ({ day: i, slots: daySlots }))

    updateTimeSlots({
      time_slots: newDays,
    }).then(refetch)
  }

  const classes = useStyles()

  return (
    <>
      <Paper elevation={1} className={classes.paper}>
        {daySlots.length > 0 && (
          <List>
            {daySlots.map((slot, idx) => (
              <ListItem key={idx}>
                <ListItemText primary={`${formatHour(slot.start_time)} - ${formatHour(slot.end_time + 1)}`} />
                <ListItemSecondaryAction>
                  <IconButton
                    aria-label="edit"
                    onClick={() => {
                      setSlotEditing(slot)
                      setOpen(true)
                    }}
                  >
                    <EditIcon />
                  </IconButton>
                  <IconButton edge="end" aria-label="remove" onClick={() => handleRemoveSlot(slot.id)}>
                    <DeleteIcon />
                  </IconButton>
                </ListItemSecondaryAction>
              </ListItem>
            ))}
          </List>
        )}
        {open && (
          <HourSelectorDialog
            initialValue={slotEditing ? [slotEditing.start_time, slotEditing.end_time + 1] : [7, 23]}
            open={open}
            onSubmit={slotAddEdit => {
              if (!!slotEditing) {
                handleEditSlot(slotAddEdit)
              } else {
                handleAddSlot(slotAddEdit)
              }
            }}
            onClose={() => {
              setOpen(false)
              setSlotEditing(undefined)
            }}
            editId={slotEditing ? slotEditing.id : undefined}
          />
        )}
      </Paper>
      <Button color="primary" variant="contained" onClick={() => setOpen(true)} className={classes.button}>
        Add Slot
      </Button>
      <Button color="primary" variant="contained" onClick={copyDayToAllDays} className={classes.button}>
        Copy This Day to All Days
      </Button>
    </>
  )
}
