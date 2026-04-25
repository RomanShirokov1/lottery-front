import { type FormEvent, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { getAuthErrorMessage, registerByEmail, useAuthStore } from '@/entities/auth';
import { removeAuthRole, removeAuthToken } from '@/shared/lib/cookies/auth-token';
import { Button } from '@/shared/components/button';
import { Input } from '@/shared/components/input';
import { PasswordInput } from '@/shared/components/password-input';
import { ROUTES } from '@/shared/config/routes';
import styles from '../AuthPage.module.css';

type RegisterFormProps = {
  onSwitchToLogin: () => void;
};

export const RegisterForm = ({ onSwitchToLogin }: RegisterFormProps) => {
  const navigate = useNavigate();
  const login = useAuthStore((state) => state.login);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [repeatPassword, setRepeatPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();

    const normalizedEmail = email.trim();

    if (!normalizedEmail || !password || !repeatPassword) {
      toast.error('Пожалуйста, заполните все поля');
      return;
    }

    if (password !== repeatPassword) {
      toast.error('Пароли не совпадают');
      return;
    }

    try {
      setLoading(true);
      const authData = await registerByEmail({ email: normalizedEmail, password });
      login(authData.token, 'USER');
      toast.success('Аккаунт успешно создан');
      navigate(ROUTES.userRoot);
    } catch (error) {
      removeAuthToken();
      removeAuthRole();
      toast.error(getAuthErrorMessage(error, 'Не удалось создать аккаунт'));
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <form className={styles.form} onSubmit={handleSubmit}>
        <Input
          id="register-email"
          label="Email"
          type="email"
          value={email}
          onChange={(event) => setEmail(event.target.value)}
          placeholder="Введите email"
          autoComplete="email"
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
        <Button type="submit" fullWidth disabled={loading}>
          {loading ? 'Создание...' : 'Создать аккаунт'}
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
