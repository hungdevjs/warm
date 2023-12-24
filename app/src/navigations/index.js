import SplashScreen from '../components/SplashScreen';
import Layout from '../components/Layout';
import AuthRoutes from './AuthRoutes';
import MainRoutes from './MainRoutes';
import useNotificationRegister from '../hooks/useNotificationRegister';
import useAuth from '../hooks/useAuth';
import useUser from '../hooks/useUser';
import useCouple from '../hooks/useCouple';
import useProposal from '../hooks/useProposal';
import useNotification from '../hooks/useNotification';
import useUserStore from '../stores/user.store';
import ProposalRoute from './ProposalRoute';

const Navigations = () => {
  useNotificationRegister();

  const user = useUserStore((state) => state.user);
  const initialized = useUserStore((state) => state.initialized);
  const { initialized: authInitialized, user: authUser } = useAuth();
  useUser(authInitialized, authUser?.uid);
  useCouple();
  useProposal();
  useNotification();

  if (!initialized || !authInitialized) return <SplashScreen />;

  if (!user) return <AuthRoutes />;

  if (!user.coupleId) return <ProposalRoute />;

  return (
    <Layout>
      <MainRoutes />
    </Layout>
  );
};

export default Navigations;
