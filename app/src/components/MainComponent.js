import useCoupleStore from '../stores/couple.store';
import useProposalStore from '../stores/proposal.store';
import SplashScreen from './SplashScreen';

const MainComponent = ({ children }) => {
  const coupleInitialized = useCoupleStore((state) => state.initialized);
  const proposalInitizlied = useProposalStore((state) => state.initialized);

  if (!coupleInitialized || !proposalInitizlied) return <SplashScreen />;

  return children;
};

export default MainComponent;
