import React, { useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

import {
  createProfile,
  selectAuthStatus,
  selectAuthError,
  clearAuthError,
} from './authSlice';
import { useAppDispatch } from '../withTypes';

interface LoginPageFormFields extends HTMLFormControlsCollection {
  username: HTMLInputElement;
  password: HTMLInputElement;
  email: HTMLInputElement;
}
interface LoginPageFormElements extends HTMLFormElement {
  readonly elements: LoginPageFormFields;
}

export const CreateProfilePage = () => {
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
    const email = e.currentTarget.elements.email.value;

    dispatch(createProfile({ username, email, password }));
  };

  const isLoading = authStatus === 'pending';

  return (
    <section>
      <h2>Welcome to your Pokemon team builder!</h2>
      <h3>Please create a profile:</h3>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username:</label>
        <input type="text" id="username" defaultValue="" required />
        <label htmlFor="email">Email:</label>
        <input type="text" id="email" defaultValue="" required />
        <label htmlFor="password">Password:</label>
        <input type="text" id="password" defaultValue="" required />
        <button type="submit" disabled={isLoading}>
          {isLoading ? 'Creating Profile...' : 'Create my builder Profile'}
        </button>{' '}
        or <Link to="/login">Login</Link>
      </form>
      {authError && <p style={{ color: 'red' }}>{authError}</p>}
    </section>
  );
};
