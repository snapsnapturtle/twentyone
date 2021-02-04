import { useContext } from 'react';
import { CampaignContext } from '../context/CampaignContext';

export function useCampaignId(): number {
    const { campaign } = useContext(CampaignContext);

    return campaign.id;
}
