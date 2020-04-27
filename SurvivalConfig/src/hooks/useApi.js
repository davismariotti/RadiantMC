import { useEffect, useState } from 'react'
import API from '../api'
import _ from 'lodash'

export default function useAPI(endpoint, method) {
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState()
  const [data, setData] = useState()

  useEffect(() => {
    API.request({
      method,
      url: endpoint,
    })
      .then(response => {
        const payload = _.get(response, 'data.payload')
        if (payload) {
          setData(payload)
          setLoading(false)
        }
      })
      .catch(error => {
        setError(error)
        setLoading(false)
      })
  }, [])

  return { data, loading, error }
}
