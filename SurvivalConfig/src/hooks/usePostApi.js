import _ from 'lodash'
import { useState } from 'react'
import API from '../api'

export default function usePostAPI(endpoint) {
  const [loading, setLoading] = useState(false)

  const post = data => {
    setLoading(true)
    return API.post(endpoint, {
      ...data,
    })
      .then(response => {
        setLoading(false)
        const error = _.get(response, 'data.error')
        if (error) {
          return Promise.reject(error)
        }
        const payload = _.get(response, 'data.payload')
        return Promise.resolve(payload)
      })
      .catch(error => {
        setLoading(false)
        return Promise.reject(error)
      })
  }

  return [post, { loading }]
}
