import React from 'react';
import { useNavigate } from 'react-router-dom';

import { login } from './authSlice';
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

  const handleSubmit = async (e: React.FormEvent<LoginPageFormElements>) => {
    e.preventDefault();

    const username = e.currentTarget.elements.username.value;
    const password = e.currentTarget.elements.password.value;

    await dispatch(login({ username, password }));

    navigate('/teams');
  };

  return (
    <section>
      <h2>Welcome to your Pokemon team builder!</h2>
      <h3>Please log in:</h3>
      <form onSubmit={handleSubmit}>
        <label htmlFor="username">Username:</label>
        <input type="text" id="username" defaultValue="" required />

        <label htmlFor="password">Password:</label>
        <input type="text" id="password" defaultValue="" required />

        <button>Log In</button>
      </form>
    </section>
  );
};
