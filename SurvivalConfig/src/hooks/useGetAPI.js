import { useEffect, useState } from 'react'
import API from '../api'
import _ from 'lodash'
import useForceUpdate from './useForceUpdate'

export default function useGetAPI(endpoint, options) {
  const onCompleted = _.get(options, 'onCompleted')
  const onError = _.get(options, 'onError')

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState()
  const [data, setData] = useState()
  const [refetchValue, refetch] = useForceUpdate()

  useEffect(() => {
    setLoading(true)
    API.get(endpoint)
      .then(response => {
        setError(_.get(response, 'data.error'))

        const payload = _.get(response, 'data.payload')
        if (payload) {
          setData(payload)
          if (onCompleted) {
            onCompleted(payload)
          }
        }
        setLoading(false)
      })
      .catch(error => {
        setError(error)
        setLoading(false)
        if (onError) {
          onError(error)
        }
      })
  }, [endpoint, refetchValue])

  return { data, loading, error, refetch }
}
