import type { ButtonHTMLAttributes, PropsWithChildren } from 'react'
import { classNames } from '@/shared/lib/class-names/classNames'
import styles from './Button.module.css'

type ButtonVariant = 'primary' | 'secondary' | 'ghost'

type ButtonProps = PropsWithChildren<
  ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: ButtonVariant
    fullWidth?: boolean
  }
>

export const Button = ({
  children,
  variant = 'primary',
  className,
  fullWidth = false,
  type = 'button',
  ...props
}: ButtonProps) => {
  return (
    <button
      type={type}
      className={classNames(
        styles.button,
        styles[variant],
        fullWidth && styles.fullWidth,
        className,
      )}
      {...props}
    >
      {children}
    </button>
  )
}
