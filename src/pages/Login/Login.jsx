import styles from './Login.module.css';
import { useEffect, useState } from 'react';
import PageNav from '../../components/PageNav/PageNav';
import { useAuth } from '../../contexts/FakeAuthContext';
import { useNavigate } from 'react-router-dom';
import Button from '../../components/Button/Button';
import Message from '../../components/Message/Message';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('admin@gmail.com');
  const [password, setPassword] = useState('qwerty');
  const { login, isLoggedIn, error } = useAuth();

  function handleSubmit(e) {
    e.preventDefault();
    if (email && password) login(email, password);
  }

  useEffect(() => {
    if (isLoggedIn) navigate('/app', { replace: true });
  }, [isLoggedIn, navigate]);

  return (
    <main className={styles.login}>
      <PageNav />
      <form className={styles.form} onSubmit={handleSubmit}>
        <div className={styles.row}>
          <label htmlFor="email">Email address</label>
          <input
            type="email"
            id="email"
            onChange={(e) => setEmail(e.target.value)}
            value={email}
          />
        </div>

        <div className={styles.row}>
          <label htmlFor="password">Password</label>
          <input
            type="password"
            id="password"
            onChange={(e) => setPassword(e.target.value)}
            value={password}
          />
        </div>

        <div>
          <Button type="primary" onClick={handleSubmit}>
            Login
          </Button>
          {error && <Message message="Login or passwors is incorrect" />}
        </div>
      </form>
    </main>
  );
}
