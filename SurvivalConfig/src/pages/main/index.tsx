import React, { useState } from 'react'
import { useHistory } from 'react-router'
import useCreateUser from '../../hooks/useCreateUser'
import useGetUsernameInfoLazy from '../../hooks/useGetUsernameInfoLazy'
import { PageWrapper } from '../styles'
import CreateForm from './CreateForm'
import UserNameForm from './UserNameForm'
import { CreateFormValues, UsernameFormValues } from '../../types'

export default function MainPage() {
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [username, setUsername] = useState<string>('')
  const history = useHistory()
  const [findUsername] = useGetUsernameInfoLazy()

  const [createUser] = useCreateUser()

  const handleCreateSubmit = (values: CreateFormValues) => {
    createUser({ mobile: `+1${values.mobile?.replace(/\D/g, '')}`, minecraft_username: values.username })
      .then(data => history.push(`/user/${data.id}`))
      .catch(console.error)
  }

  const handleLookupSubmit = (values: UsernameFormValues) => {
    findUsername(values.username)
      .then(data => history.push(`/user/${data.id}`))
      .catch(e => {
        const status = e.status
        if (status === 404) {
          setUsername(values.username)
          setShowCreateForm(true)
        }
      })
  }

  return (
    <PageWrapper>
      <div style={{ marginTop: 100 }}>
        {showCreateForm ? (
          <CreateForm handleSubmit={handleCreateSubmit} initialValues={{ username }} />
        ) : (
          <UserNameForm handleSubmit={handleLookupSubmit} />
        )}
      </div>
    </PageWrapper>
  )
}
