import {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  type Dispatch,
  type SetStateAction,
} from 'react'

interface UseControllableStateParams<T> {
  prop?: T
  onChange?: (value: T) => void
}

type SetStateFn<T> = (prevState?: T) => T

export function useControllableState<T>({
  prop,
  onChange,
}: UseControllableStateParams<T>) {
  const value = prop
  const onChangeRef = useRef(onChange)

  useEffect(() => {
    onChangeRef.current = onChange
  })

  const handleChange = useMemo(
    () =>
      ((...args) => {
        onChangeRef.current?.(...args)
      }) as (value: T) => void,
    [],
  )

  const setValue = useCallback<Dispatch<SetStateAction<T | undefined>>>(
    (nextValue) => {
      const setter = nextValue as SetStateFn<T>
      const value = typeof nextValue === 'function' ? setter(prop) : nextValue
      if (value !== prop) handleChange(value as T)
    },
    [prop, handleChange],
  )

  return [value, setValue] as const
}
