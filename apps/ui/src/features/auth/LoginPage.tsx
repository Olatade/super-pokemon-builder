import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import {
  login,
  selectAuthStatus,
  selectAuthError,
  clearAuthError,
} from './authSlice';
import { useAppDispatch } from '../withTypes';

interface LoginPageFormFields extends HTMLFormControlsCollection {
  username: HTMLInputElement;
  password: HTMLInputElement;
}
interface LoginPageFormElements extends HTMLFormElement {
  readonly elements: LoginPageFormFields;
}

export const LoginPage = () => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const authStatus = useSelector(selectAuthStatus);
  const authError = useSelector(selectAuthError);

  useEffect(() => {
    if (authStatus === 'succeeded') {
      navigate('/home');
    }
  }, [authStatus, navigate]);

  useEffect(() => {
    // Clear any login errors when the component unmounts
    return () => {
      if (authError) {
        dispatch(clearAuthError());
      }
    };
  }, [authError, dispatch]);

  const handleSubmit = (e: React.FormEvent<LoginPageFormElements>) => {
    e.preventDefault();

    const username = e.currentTarget.elements.username.value;
    const password = e.currentTarget.elements.password.value;

    dispatch(login({ username, password }));
  };

  const isLoading = authStatus === 'pending';

  return (
    <section>
      <h2>Welcome to your Pokemon team builder!</h2>
      <h3>Please log in:</h3>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username:</label>
        <input type="text" id="username" defaultValue="" required />
        <label htmlFor="password">Password:</label>
        <input type="text" id="password" defaultValue="" required />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Logging in...' : 'Log In'}
        </button>{' '}
        or <Link to={'/create-profile'}>Create Profile</Link>
      </form>
      {authError && <p style={{ color: 'red' }}>{authError}</p>}
    </section>
  );
};
