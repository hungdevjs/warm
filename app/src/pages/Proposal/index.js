import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

import MainComponent from '../../components/MainComponent';
import useProposalStore from '../../stores/proposal.store';

const Proposal = () => {
  const navigate = useNavigate();
  const sentProposals = useProposalStore((state) => state.sentProposals);
  const proposalInitizlied = useProposalStore((state) => state.initialized);

  useEffect(() => {
    if (proposalInitizlied) {
      if (!!sentProposals.length) {
        navigate('/sent-proposals');
      } else {
        navigate('/propose');
      }
    }
  }, [proposalInitizlied, sentProposals]);

  return <MainComponent />;
};

export default Proposal;
