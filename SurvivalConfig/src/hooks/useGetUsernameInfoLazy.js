import useLazyGetAPI from './useLazyGetAPI'

export default function useGetUsernameInfoLazy(options) {
  const lazyGet = useLazyGetAPI(options)

  return [username => lazyGet[0](`username/${username}`), lazyGet[1]]
}
