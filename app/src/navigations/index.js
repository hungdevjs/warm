import SplashScreen from '../components/SplashScreen';
import Layout from '../components/Layout';
import AuthRoutes from './AuthRoutes';
import MainRoutes from './MainRoutes';
import useAuth from '../hooks/useAuth';
import useUser from '../hooks/useUser';
import useCouple from '../hooks/useCouple';
import useProposal from '../hooks/useProposal';

const Navigations = () => {
  const { initialized, user } = useAuth();
  useUser(user?.uid);
  useCouple();
  useProposal();

  if (!initialized) return <SplashScreen />;

  if (!user) return <AuthRoutes />;

  return (
    <Layout>
      <MainRoutes />
    </Layout>
  );
};

export default Navigations;
