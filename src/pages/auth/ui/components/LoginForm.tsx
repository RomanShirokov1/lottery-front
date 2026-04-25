import { type FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAuthErrorMessage, loginByEmail, useAuthStore } from '@/entities/auth';
import { removeAuthRole, removeAuthToken } from '@/shared/lib/cookies/auth-token';
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
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedEmail = email.trim();

    if (!normalizedEmail || !password) {
      toast.error('Пожалуйста, заполните все поля');
      return;
    }

    try {
      setLoading(true);
      const authData = await loginByEmail({ email: normalizedEmail, password });
      login(authData.token, 'USER');
      toast.success('Успешный вход');
      navigate(ROUTES.userRoot);
    } catch (error) {
      removeAuthToken();
      removeAuthRole();
      toast.error(getAuthErrorMessage(error, 'Не удалось выполнить вход'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form className={styles.form} onSubmit={handleSubmit}>
        <Input
          id="login-email"
          label="Email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Введите email"
          autoComplete="email"
        />
        <PasswordInput
          id="login-password"
          label="Пароль"
          value={password}
          onChange={(event) => setPassword(event.target.value)}
          placeholder="Введите пароль"
        />
        <Button type="submit" fullWidth disabled={loading}>
          {loading ? 'Вход...' : 'Войти'}
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
