import { Block } from 'baseui/block';
import { StyledSpinnerNext } from 'baseui/spinner';
import React, { createContext, FC, useEffect, useState } from 'react';
import { getCampaignInformation } from '../api/getCampaignInformation';

interface Board {
    id: number;
    name: string;
    width: number;
    height: number;
    gridType: 'NONE' | 'SQUARE';
    gridLineColor?: string;
}

interface CampaignInformation {
    id: number;
}

interface ICampaignContext {
    campaign: CampaignInformation;
    activeBoard: Board;
    setActiveBoard: (board: Board) => void;
    availableBoards: Board[];
}

const CampaignContext = createContext<ICampaignContext>({
    campaign: {
        id: 0,
    },
    activeBoard: {
        id: 0,
        name: '',
        width: 0,
        height: 0,
        gridType: 'NONE'
    },
    setActiveBoard: () => {
    },
    availableBoards: []
});

const CampaignContextProvider: FC<{ campaignId: number }> = ({ campaignId, ...props }) => {
    const [ campaignInformation, setCampaignInformation ] = useState<CampaignInformation>();
    const [ activeBoardId, setActiveBoardId ] = useState<number>();
    const [ boards, setBoards ] = useState<Board[]>();

    const [ error, setError ] = useState<boolean>(false);
    const [ loading, setLoading ] = useState<boolean>(true);

    useEffect(() => {
        getCampaignInformation(campaignId).then(response => {
            setCampaignInformation({
                id: response.data.id
            });

            setBoards(response.data.boards);

            if (response.data.boards.length > 0) {
                setActiveBoardId(response.data.boards[ 0 ].id);
            }
        }).catch(() => {
            setError(true);
        }).finally(() => {
            setLoading(false);
        });
    }, [ campaignId ]);

    if (loading) {
        return (
            <Block
                position="absolute"
                top="50%"
                left="50%"
                overrides={{
                    Block: {
                        style: {
                            transform: 'translate(-50%, -50%)'
                        }
                    }
                }}
            >
                <StyledSpinnerNext />
            </Block>
        );
    }

    if (error) {
        return <h1>Error :(</h1>;
    }

    const contextValue: ICampaignContext = {
        campaign: campaignInformation!!,
        availableBoards: boards!!,
        setActiveBoard: (board: Board) => {
            setActiveBoardId(board.id);
        },
        activeBoard: {
            id: 0,
            name: '',
            width: 0,
            height: 0,
            gridType: 'NONE'
        }
    };

    if (activeBoardId) {
        contextValue.activeBoard = boards?.find(it => it.id === activeBoardId)!!;
    }

    return <CampaignContext.Provider value={contextValue} {...props} />;
};

export {
    CampaignContext,
    CampaignContextProvider
};
