import { createContext, useContext, useReducer } from 'react';
import PropTypes from 'prop-types';

const AuthContext = createContext();

const initialState = {
  user: null,
  isLoggedIn: false,
  error: false,
};

const FAKE_USER = {
  name: 'Jack',
  email: 'admin@gmail.com',
  password: 'qwerty',
  avatar: 'https://i.pravatar.cc/100?u=zz',
};

function reducer(state, action) {
  switch (action.type) {
    case 'login':
      return { ...state, user: action.payload, isLoggedIn: true };
    case 'logout':
      return { ...state, user: null, isLoggedIn: false };
    case 'error':
      return { ...state, error: true };
    default:
      throw new Error('AuthReducer: unknown action.');
  }
}

AuthProvider.propTypes = {
  children: PropTypes.any,
};

function AuthProvider({ children }) {
  const [{ user, isLoggedIn, error }, dispatch] = useReducer(
    reducer,
    initialState
  );

  function login(email, password) {
    if (email === FAKE_USER.email && password === FAKE_USER.password) {
      dispatch({ type: 'login', payload: FAKE_USER });
    } else {
      dispatch({ type: 'error' });
    }
  }

  function logout() {
    dispatch({ type: 'logout' });
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoggedIn,
        login,
        logout,
        error,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined)
    throw new Error('AuthContext was used outside ContextProvider');

  return context;
}

export { AuthProvider, useAuth };
