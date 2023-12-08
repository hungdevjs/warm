import Loading from '../components/Loading';
import AuthRoutes from './AuthRoutes';
import MainRoutes from './MainRoutes';
import useAuth from '../hooks/useAuth';
import useUser from '../hooks/useUser';

const Navigations = () => {
  const { initialized, user } = useAuth();
  useUser(user?.uid);

  if (!initialized) return <Loading />;

  if (!user) return <AuthRoutes />;

  return <MainRoutes />;
};

export default Navigations;
