import React from 'react'
import { useHistory } from 'react-router'
import useGetUsernameInfoLazy from '../../hooks/useGetUsernameInfoLazy'
import { PageWrapper } from '../styles'
import UserNameForm from './userNameForm'

export default function MainPage() {
  const history = useHistory()

  const [findUsername] = useGetUsernameInfoLazy()

  const handleSubmit = values => {
    findUsername(values.username)
      .then(data => history.push(`/user/${data.id}`))
      .catch(e => {
        const status = e.status
        if (status === 404) {
        }
      })
  }

  return (
    <PageWrapper>
      <div style={{ marginTop: 100 }}>
        <UserNameForm handleSubmit={handleSubmit} />
      </div>
    </PageWrapper>
  )
}
