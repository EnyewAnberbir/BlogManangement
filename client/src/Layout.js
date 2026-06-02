import Header from './Header';
import { Outlet } from 'react-router-dom';
import { useContext } from 'react';
import { UserContext } from './UserContext';

export default function Layout() {
  const { uiError } = useContext(UserContext);

  return (
    <main>
      <Header />
      {uiError ? <div className="global-error">{uiError}</div> : null}
      <Outlet />
    </main>
  );
}
