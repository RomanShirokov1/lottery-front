import { type FormEvent, useState } from 'react';
import { toast } from 'react-toastify';
import { Button } from '@/shared/components/button';
import { Input } from '@/shared/components/input';
import { PasswordInput } from '@/shared/components/password-input';
import styles from '../AuthPage.module.css';

type RegisterFormProps = {
  onSwitchToLogin: () => void;
};

export const RegisterForm = ({ onSwitchToLogin }: RegisterFormProps) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');

  const handleSubmit = (event: any) => {
    event.preventDefault();

    if (!username || !password || !repeatPassword) {
      toast.error('Пожалуйста, заполните все поля');
      return;
    }

    if (password !== repeatPassword) {
      toast.error('Пароли не совпадают');
      return;
    }

    toast.success('Аккаунт успешно создан');
    onSwitchToLogin();
  };

  return (
    <>
      <form className={styles.form} onSubmit={handleSubmit}>
        <Input
          id="register-username"
          label="Логин"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          placeholder="Введите логин"
          autoComplete="username"
        />
        <PasswordInput
          id="register-password"
          label="Пароль"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Введите пароль"
          autoComplete="new-password"
        />
        <PasswordInput
          id="register-repeat-password"
          label="Подтвердите пароль"
          value={repeatPassword}
          onChange={(event) => setRepeatPassword(event.target.value)}
          placeholder="Подтвердите пароль"
          autoComplete="new-password"
        />
        <Button type="submit" fullWidth>
          Создать аккаунт
        </Button>
      </form>

      <p className={styles.footer}>
        Уже есть аккаунт?{' '}
        <button type="button" className={styles.link} onClick={onSwitchToLogin}>
          Войти
        </button>
      </p>
    </>
  );
};
