import Button from '@mui/material/Button'
import Dialog from '@mui/material/Dialog'
import DialogActions from '@mui/material/DialogActions'
import DialogContent from '@mui/material/DialogContent'
import DialogContentText from '@mui/material/DialogContentText'
import DialogTitle from '@mui/material/DialogTitle'
import Slider from '@mui/material/Slider'
import { makeStyles } from '@mui/styles'
import React, { useState } from 'react'
import { formatHour, generateGUID } from './utils'
import { TimeSlot } from '../../types'

const useStyles = makeStyles({
  slider: {
    marginTop: 32,
  },
})

export default function HourSelectorDialog(props: {
  open: boolean
  onSubmit: (timeSlot: TimeSlot) => void
  onClose: () => void
  editId: string | undefined
  initialValue: [number, number]
}) {
  const { open, onSubmit, onClose, editId, initialValue } = props
  const classes = useStyles()

  const [value, setValue] = useState(initialValue)

  const handleSubmit = () => {
    onClose()
    onSubmit({
      id: editId || generateGUID(),
      start_time: value[0],
      end_time: Math.max(value[1] - 1, value[0]),
    })
  }

  const handleChange = (event: any, newValue: any) => {
    setValue(newValue)
  }

  return (
    <Dialog open={open}>
      <DialogTitle id="time-slot-dialog">{editId ? 'Edit' : 'Add'} Time Slot</DialogTitle>
      <DialogContent>
        <DialogContentText>
          To add a time slot, move the range selector to the times of day that you want to be notified when someone logs
          in.
        </DialogContentText>
        <Slider
          className={classes.slider}
          min={0}
          max={24}
          step={1}
          marks
          value={value}
          onChange={handleChange}
          valueLabelFormat={formatHour}
          valueLabelDisplay="on"
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="primary">
          Cancel
        </Button>
        <Button onClick={handleSubmit} color="primary">
          {editId ? 'Edit' : 'Add'}
        </Button>
      </DialogActions>
    </Dialog>
  )
}
