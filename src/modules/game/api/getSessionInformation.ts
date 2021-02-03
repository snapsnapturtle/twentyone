import { AxiosPromise } from 'axios';
import { axiosInstance } from '../../../shared/axios';

interface SessionResponse {
    id: number;
    sessionKey: string;
    boards: {
        id: number;
        name: string;
        width: number;
        height: number;
        gridType: 'NONE' | 'SQUARE';
        gridLineColor?: string;
    }[]
}

export function getSessionInformation(sessionKey: string): AxiosPromise<SessionResponse> {
    return axiosInstance.get<SessionResponse>(`/v1/sessions/${sessionKey}`);
}
