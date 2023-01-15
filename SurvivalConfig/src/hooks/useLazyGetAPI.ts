import _ from 'lodash'
import { useState } from 'react'
import API from '../api'
import { GetOptions, LazyGetResult } from '../types'

export default function useLazyGetAPI(options?: GetOptions): LazyGetResult {
  const onCompleted = _.get(options, 'onCompleted')
  const onError = _.get(options, 'onError')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<Error | undefined>()
  const [data, setData] = useState<any | undefined>()

  const get = (endpoint: string) => {
    setLoading(true)
    return API.get(endpoint)
      .then(response => {
        const error = _.get(response, 'data.error')
        if (error) {
          setError(error)
          return Promise.reject(error)
        }

        const payload = _.get(response, 'data.payload')
        if (payload) {
          setData(payload)
          if (onCompleted) {
            onCompleted(payload)
          }
        }
        setLoading(false)
        return Promise.resolve(payload)
      })
      .catch(error => {
        setError(error)
        setLoading(false)
        if (onError) {
          onError(error.response)
        }
        return Promise.reject(error.response)
      })
  }

  return [get, { data, loading, error, refetch: get }]
}
