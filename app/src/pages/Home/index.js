import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import MainComponent from '../../components/MainComponent';
import useCoupleStore from '../../stores/couple.store';
import useProposalStore from '../../stores/proposal.store';

const Home = () => {
  const navigate = useNavigate();
  const couple = useCoupleStore((state) => state.couple);
  const coupleInitialized = useCoupleStore((state) => state.initialized);
  const sentProposals = useProposalStore((state) => state.sentProposals);
  const proposalInitizlied = useProposalStore((state) => state.initialized);

  useEffect(() => {
    if (coupleInitialized && proposalInitizlied) {
      if (!!sentProposals.length) {
        navigate('/home/sent-proposals');
      } else if (!couple) {
        navigate('/home/propose');
      } else {
        navigate('/home/timeline');
      }
    }
  }, [coupleInitialized, proposalInitizlied, couple, sentProposals]);

  return <MainComponent />;
};

export default Home;
