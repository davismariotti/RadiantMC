import { useEffect, useState } from 'react'
import API from '../api'
import _ from 'lodash'
import useForceUpdate from './useForceUpdate'

export default function useGetAPI(endpoint, { onCompleted, onError }) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState()
  const [data, setData] = useState()
  const [refetchValue, refetch] = useForceUpdate()

  useEffect(() => {
    setLoading(true)
    API.get(endpoint)
      .then(response => {
        const payload = _.get(response, 'data.payload')
        if (payload) {
          setData(payload)
          setLoading(false)
          if (onCompleted) {
            onCompleted(payload)
          }
        }
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
