import {
  createBrowserRouter,
  createRoutesFromElements,
  Navigate,
  Route,
  RouterProvider,
} from 'react-router-dom';
import PrivateRoutes from './components/auth/PrivateRoutes';
import PublicRoutes from './components/auth/PublicRoutes';
import Login from './pages/auth/login';
import NotFoundPage from './pages/NorFoundPage';

const router = createBrowserRouter(
  createRoutesFromElements(
    <>
      <Route path="/" element={<Navigate to={'/app'} />} />
      <Route element={<PrivateRoutes />}>
        <Route path="/app" element={<div>hello world</div>}></Route>
      </Route>
      <Route element={<PublicRoutes />}>
        <Route path="/login" element={<Login />} />
      </Route>
      <Route path="*" element={<NotFoundPage />} />
    </>
  )
);

function App() {
  return (
    <>
      <RouterProvider router={router} />
    </>
  );
}

export default App;
