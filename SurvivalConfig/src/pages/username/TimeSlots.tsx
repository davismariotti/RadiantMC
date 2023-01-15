import Button from '@mui/material/Button'
import IconButton from '@mui/material/IconButton'
import List from '@mui/material/List'
import ListItem from '@mui/material/ListItem'
import ListItemSecondaryAction from '@mui/material/ListItemSecondaryAction'
import ListItemText from '@mui/material/ListItemText'
import Paper from '@mui/material/Paper'
import DeleteIcon from '@mui/icons-material/Delete'
import EditIcon from '@mui/icons-material/Edit'
import _ from 'lodash'
import React, { useState } from 'react'
import HourSelectorDialog from './HourSelectorDialog'
import { formatHour } from './utils'
import { DaySlot, TimeSlot, TimeSlotData } from '../../types'
import { makeStyles } from '@mui/styles'

const useStyles = makeStyles({
  paper: {
    width: 300,
  },
  button: {
    marginTop: 32,
  },
})

interface Props {
  day: number
  slots: TimeSlotData
  refetch: any
  updateTimeSlots: any
}

export default function TimeSlots(props: Props) {
  const { day, slots, refetch, updateTimeSlots } = props

  const daySlots = slots.find((s: DaySlot) => s.day === day)?.slots || []

  const [slotEditing, setSlotEditing] = useState<TimeSlot | undefined>()
  const [open, setOpen] = useState<boolean>(false)

  const handleAddSlot = (addedSlot: TimeSlot) => {
    const newDaySlots = [...daySlots, addedSlot]

    const newDays = [...slots.filter(d => d.day !== day), { day, slots: newDaySlots }]

    updateTimeSlots({
      time_slots: newDays,
    }).then(refetch)
  }

  const handleEditSlot = (editedSlot: TimeSlot) => {
    const newDaySlots = [...daySlots.filter(s => s.id !== editedSlot.id), editedSlot]

    const newDays = [...slots.filter(d => d.day !== day), { day, slots: newDaySlots }]

    updateTimeSlots({
      time_slots: newDays,
    }).then(refetch)
  }

  const handleRemoveSlot = (removedSlotId: string) => {
    const newDaySlots = daySlots.filter(s => s.id !== removedSlotId)

    const newDays = [...slots.filter(d => d.day !== day), { day, slots: newDaySlots }]

    updateTimeSlots({
      time_slots: newDays,
    }).then(refetch)
  }

  const copyDayToAllDays = (): void => {
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
            onSubmit={(slotAddEdit: TimeSlot) => {
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
