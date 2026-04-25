import { useState } from 'react';
import { LoginForm, RegisterForm } from './components';
import styles from './AuthPage.module.css';

type AuthMode = 'login' | 'register';

export const AuthPage = () => {
  const [mode, setMode] = useState<AuthMode>('login');

  return (
    <main className={styles.page}>
      <section className={styles.card}>
        <h1 className={styles.title}>{mode === 'login' ? 'Вход' : 'Регистрация'}</h1>

        {mode === 'login' ? (
          <LoginForm onSwitchToRegister={() => setMode('register')} />
        ) : (
          <RegisterForm onSwitchToLogin={() => setMode('login')} />
        )}
      </section>
    </main>
  );
};
