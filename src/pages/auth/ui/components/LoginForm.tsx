import { type FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { useAuthStore } from '@/entities/auth';
import { Button } from '@/shared/components/button';
import { Input } from '@/shared/components/input';
import { PasswordInput } from '@/shared/components/password-input';
import { ROUTES } from '@/shared/config/routes';
import styles from '../AuthPage.module.css';

type LoginFormProps = {
  onSwitchToRegister: () => void;
};

export const LoginForm = ({ onSwitchToRegister }: LoginFormProps) => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (event: any) => {
    event.preventDefault();

    if (!username || !password) {
      toast.error('Пожалуйста, заполните все поля');
      return;
    }

    const role = username.trim().toLowerCase() === 'admin' ? 'admin' : 'user';
    login(`demo-token:${username}`, role);
    toast.success('Успешный вход');
    navigate(role === 'admin' ? ROUTES.adminRoot : ROUTES.userRoot);
  };

  return (
    <>
      <form className={styles.form} onSubmit={handleSubmit}>
        <Input
          id="login-username"
          label="Логин"
          value={username}
          onChange={(event) => setUsername(event.target.value)}
          placeholder="Введите логин"
          autoComplete="username"
        />
        <PasswordInput
          id="login-password"
          label="Пароль"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Введите пароль"
        />
        <Button type="submit" fullWidth>
          Войти
        </Button>
      </form>

      <p className={styles.footer}>
        Нет аккаунта?{' '}
        <button type="button" className={styles.link} onClick={onSwitchToRegister}>
          Создать
        </button>
      </p>
    </>
  );
};
