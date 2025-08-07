import { Link } from 'react-router-dom';

import { UserIcon } from './UserIcon';

import { useAppDispatch, useAppSelector } from '../features/withTypes';
import { logout, selectCurrentUser } from '../features/auth/authSlice';

export const Navbar = () => {
  const dispatch = useAppDispatch();
  const user = useAppSelector(selectCurrentUser);

  const isLoggedIn = !!user.username;

  let navContent: React.ReactNode = null;

  if (isLoggedIn) {
    const onLogoutClicked = () => {
      dispatch(logout());
    };

    navContent = (
      <div className="navContent">
        <div className="navLinks">
          <Link to="/teams">Teams</Link>
        </div>
        <div className="userDetails">
          <UserIcon size={32} />
          {user.username}
          <button className="button small" onClick={onLogoutClicked}>
            Log Out
          </button>
        </div>
      </div>
    );
  }

  return (
    <nav>
      <section>
        <h1>Super Pokemon builder</h1>
        {navContent}
      </section>
    </nav>
  );
};
