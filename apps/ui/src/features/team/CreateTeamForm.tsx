import React, { useState } from 'react';
import { createTeam, fetchTeams } from './teamSlice';
import { useAppDispatch, useAppSelector } from '../withTypes';
import { selectCurrentUserId } from '../auth/authSlice';
import { useNavigate } from 'react-router-dom';

interface AddPostFormFields extends HTMLFormControlsCollection {
  teamName: HTMLInputElement;
}
interface AddPostFormElements extends HTMLFormElement {
  readonly elements: AddPostFormFields;
}

export const CreateTeamForm = () => {
  const [addRequestStatus, setAddRequestStatus] = useState<'idle' | 'pending'>(
    'idle'
  );

  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const currentUserId = useAppSelector(selectCurrentUserId);

  const handleSubmit = async (e: React.FormEvent<AddPostFormElements>) => {
    // Prevent server submission
    e.preventDefault();

    const { elements } = e.currentTarget;
    const teamName = elements.teamName.value;

    const form = e.currentTarget;

    if (!currentUserId) {
      console.error('User not logged in. Cannot create team.');
      // Optionally, display a user-friendly message on the UI
      return;
    }

    try {
      setAddRequestStatus('pending');
      const createdTeam = await dispatch(
        createTeam({ name: teamName, profile_id: currentUserId })
      ).unwrap();
      console.log(createdTeam);
      form.reset();
      navigate(`/teams/${createdTeam.id}`);
    } catch (err: any) {
      console.error('Failed to create team: ', err);
    } finally {
      setAddRequestStatus('idle');
    }
  };

  return (
    <section>
      <h2>Create a new team</h2>
      <form onSubmit={handleSubmit}>
        <label htmlFor="teamName">Team name:</label>
        <input type="text" id="teamName" defaultValue="" required />
        <button disabled={addRequestStatus === 'pending'}>Create Team</button>
      </form>
    </section>
  );
};
