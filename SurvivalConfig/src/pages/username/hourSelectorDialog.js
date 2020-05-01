import Button from '@material-ui/core/Button'
import Dialog from '@material-ui/core/Dialog'
import DialogActions from '@material-ui/core/DialogActions'
import DialogContent from '@material-ui/core/DialogContent'
import DialogContentText from '@material-ui/core/DialogContentText'
import DialogTitle from '@material-ui/core/DialogTitle'
import Slider from '@material-ui/core/Slider'
import { makeStyles } from '@material-ui/core/styles'
import React, { useState } from 'react'
import { formatHour, generateGUID } from './utils'

const useStyles = makeStyles({
  slider: {
    marginTop: 32,
  },
})

export default function HourSelectorDialog(props) {
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

  const handleChange = (event, newValue) => {
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
