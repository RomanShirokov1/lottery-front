import type { InputHTMLAttributes } from 'react'
import { classNames } from '@/shared/lib/class-names/classNames'
import styles from './Input.module.css'

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
  label?: string
  error?: string
}

export const Input = ({ label, error, className, id, ...props }: InputProps) => {
  return (
    <label className={styles.field} htmlFor={id}>
      {label && <span className={styles.label}>{label}</span>}
      <input
        id={id}
        className={classNames(styles.input, className)}
        {...props}
      />
      {error && <span className={styles.error}>{error}</span>}
    </label>
  )
}
