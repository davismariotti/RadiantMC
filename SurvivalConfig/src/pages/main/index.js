import React from 'react'
import { useHistory } from 'react-router'
import { PageWrapper } from '../styles'
import UserNameForm from './userNameForm'

export default function MainPage() {
  const history = useHistory()

  const handleSubmit = values => {
    console.log('values', values)
    history.push(`/username/${values.username}`)
  }

  return (
    <PageWrapper>
      <div style={{ marginTop: 100 }}>
        <UserNameForm handleSubmit={handleSubmit} />
      </div>
    </PageWrapper>
  )
}
