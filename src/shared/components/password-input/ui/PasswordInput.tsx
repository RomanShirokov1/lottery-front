import { useId, useState, type InputHTMLAttributes } from 'react';
import { Input } from '@/shared/components/input';
import styles from './PasswordInput.module.css';

import { IconEyeOff, IconEye } from '@tabler/icons-react';

type PasswordInputProps = Omit<InputHTMLAttributes<HTMLInputElement>, 'type'> & {
  label?: string;
  error?: string;
};

export const PasswordInput = ({ label, error, id, ...props }: PasswordInputProps) => {
  const generatedId = useId();
  const [visible, setVisible] = useState(false);
  const inputId = id ?? generatedId;

  return (
    <div className={styles.wrapper}>
      <Input
        id={inputId}
        label={label}
        error={error}
        type={visible ? 'text' : 'password'}
        autoComplete="current-password"
        {...props}
      />
      <button type="button" className={styles.toggle} onClick={() => setVisible((prev) => !prev)}>
        {visible ? <IconEyeOff /> : <IconEye />}
      </button>
    </div>
  );
};
