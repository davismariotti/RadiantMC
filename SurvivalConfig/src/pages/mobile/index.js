import React from 'react'
import { useParams } from 'react-router'

export default function MobileEditor() {
  const { mobile } = useParams()
  return <div>Editing {mobile}</div>
}
