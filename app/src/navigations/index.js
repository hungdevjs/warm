import SplashScreen from '../components/SplashScreen';
import Layout from '../components/Layout';
import AuthRoutes from './AuthRoutes';
import MainRoutes from './MainRoutes';
import useAuth from '../hooks/useAuth';
import useUser from '../hooks/useUser';
import useCouple from '../hooks/useCouple';
import useProposal from '../hooks/useProposal';
import useUserStore from '../stores/user.store';

const Navigations = () => {
  const user = useUserStore((state) => state.user);
  const initialized = useUserStore((state) => state.initialized);
  const { initialized: authInitialized, user: authUser } = useAuth();
  useUser(authInitialized, authUser?.uid);
  useCouple();
  useProposal();

  if (!initialized || !authInitialized) return <SplashScreen />;

  if (!user) return <AuthRoutes />;

  return (
    <Layout>
      <MainRoutes />
    </Layout>
  );
};

export default Navigations;
