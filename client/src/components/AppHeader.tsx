import {UserMenu} from './auth/UserMenu';

const AppHeader = () => {
  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-12 items-center justify-end">
        <div className="relative">
          <UserMenu />
        </div>
      </div>
    </header>
  );
};

export default AppHeader;
