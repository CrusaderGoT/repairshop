import { InputHTMLAttributes, useState, useEffect } from "react"

// A typical debounced input react component
export function DebouncedInput({
    value: initialValue,
    onChange,
    debounce = 50,
    ...props
  }: {
    value: string | number
    onChange: (value: string | number) => void
    debounce?: number
  } & Omit<InputHTMLAttributes<HTMLInputElement>, 'onChange'>) {
    const [value, setValue] = useState(initialValue)
  
    useEffect(() => {
      setValue(initialValue)
    }, [initialValue])
  
    useEffect(() => {
      const timeout = setTimeout(() => {
        onChange(value)
      }, debounce)
  
      return () => clearTimeout(timeout)
    }, [value, debounce]) // eslint-disable-line react-hooks/exhaustive-deps
  
    return (
      <input {...props} value={value} onChange={e => setValue(e.target.value)} />
    )
}
  