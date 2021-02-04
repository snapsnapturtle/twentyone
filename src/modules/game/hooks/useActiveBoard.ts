import { useContext } from 'react';
import { CampaignContext } from '../context/CampaignContext';

export function useActiveBoard() {
    const { activeBoard } = useContext(CampaignContext);

    return activeBoard;
}
