import { AxiosPromise } from 'axios';
import { axiosInstance } from '../../../shared/axios';

interface CampaignResponse {
    id: number;
    boards: {
        id: number;
        name: string;
        width: number;
        height: number;
        gridType: 'NONE' | 'SQUARE';
        gridLineColor?: string;
    }[]
}

export function getCampaignInformation(id: number): AxiosPromise<CampaignResponse> {
    return axiosInstance.get<CampaignResponse>(`/v1/campaigns/${id}`);
}
