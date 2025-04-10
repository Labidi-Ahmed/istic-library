import AppHeader from './AppHeader';
import {Outlet} from 'react-router-dom';

const AppLayout = () => {
  return (
    <div className="flex min-h-screen flex-col">
      <AppHeader />
      <main className="flex-1">
        <Outlet />
      </main>
    </div>
  );
};

export default AppLayout;
