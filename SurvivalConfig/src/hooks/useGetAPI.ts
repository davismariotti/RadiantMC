import _ from 'lodash'
import { useEffect, useState } from 'react'
import API from '../api'
import useForceUpdate from './useForceUpdate'
import { GetOptions, GetResult } from '../types'

export default function useGetAPI(endpoint: string, options?: GetOptions): GetResult {
  const onCompleted = _.get(options, 'onCompleted')
  const onError = _.get(options, 'onError')

  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<Error | undefined>()
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
      .catch((error: Error) => {
        setError(error)
        setLoading(false)
        if (onError) {
          onError(error)
        }
      })
    // eslint-disable-next-line
  }, [endpoint, refetchValue])

  return { data, loading, error, refetch }
}
