import { Block } from 'baseui/block';
import { StyledSpinnerNext } from 'baseui/spinner';
import { HeadingMedium } from 'baseui/typography';
import React, { createContext, FC, useEffect, useState } from 'react';
import { getCampaignInformation } from '../api/getCampaignInformation';
import { useConnection } from '../hooks/useConnection';

export interface Board {
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
        id: 0
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
    const connection = useConnection();

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

    useEffect(() => {
        connection.on('update_board', (updatedBoard: Board) => {
            const i = boards?.findIndex(b => b.id === updatedBoard.id);

            if (i !== undefined && i >= 0) {
                const newBoards = boards?.map((existingBoard, index) => {
                    if (index === i) {
                        return updatedBoard;
                    }

                    return existingBoard;
                });

                setBoards(newBoards);
            }
        });

        connection.on('delete_board', ({boardId: deletedBoardId}: {boardId: number}) => {
            const newBoards = boards?.filter(it => it.id !== deletedBoardId);
            setBoards(newBoards);
            setActiveBoardId((newBoards || [])[0]?.id)
        });

        return () => {
            connection.off('update_board');
            connection.off('delete_board')
        };
    }, [ connection, campaignId, boards ]);

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
        return <HeadingMedium>Something went wrong</HeadingMedium>;
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
        const activeBoard = boards?.find(it => it.id === activeBoardId);
        if (activeBoard) {
            contextValue.activeBoard = activeBoard;
        } else {
            contextValue.activeBoard = boards?.find(() => true)!!;
        }
    }

    return <CampaignContext.Provider value={contextValue} {...props} />;
};

export {
    CampaignContext,
    CampaignContextProvider
};
