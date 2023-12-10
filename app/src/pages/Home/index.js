import { useMemo, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import MainComponent from '../../components/MainComponent';
import Main from './components/Main';
import useCoupleStore from '../../stores/couple.store';
import useProposalStore from '../../stores/proposal.store';

const Home = () => {
  const navigate = useNavigate();
  const couple = useCoupleStore((state) => state.couple);
  const coupleInitialized = useCoupleStore((state) => state.initialized);
  const sentProposals = useProposalStore((state) => state.sentProposals);
  const proposalInitizlied = useProposalStore((state) => state.initialized);

  useEffect(() => {
    console.log('home', {
      coupleInitialized,
      proposalInitizlied,
      sentProposals,
      couple,
    });
    if (coupleInitialized && proposalInitizlied) {
      if (!!sentProposals.length) {
        navigate('/home/sent-proposals');
      } else if (!couple) {
        navigate('/home/propose');
      }
    }
  }, [coupleInitialized, proposalInitizlied, couple, sentProposals]);

  const Component = useMemo(() => {
    if (couple) return <Main />;
    return null;
  }, [couple, sentProposals]);

  return <MainComponent>{Component}</MainComponent>;
};

export default Home;
