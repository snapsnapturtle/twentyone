import { Block } from 'baseui/block';
import { StyledSpinnerNext } from 'baseui/spinner';
import React, { createContext, FC, useEffect, useState } from 'react';
import { getSessionInformation } from '../api/getSessionInformation';

interface Board {
    id: number;
    name: string;
    width: number;
    height: number;
    gridType: 'NONE' | 'SQUARE';
    gridLineColor?: string;
}

interface ISessionContext {
    session: {
        id: number;
        key: string;
    };
    activeBoard: Board;
    setActiveBoard: (board: Board) => void;
    availableBoards: Board[];
}

const SessionContext = createContext<ISessionContext>({
    session: {
        id: 0,
        key: ''
    },
    activeBoard: {
        id: 0,
        name: '',
        width: 0,
        height: 0,
        gridType: 'NONE'
    },
    setActiveBoard: () => {},
    availableBoards: []
});

const SessionContextProvider: FC<{ sessionKey: string }> = ({ sessionKey, ...props }) => {
    const [ sessionInformation, setSessionInformation ] = useState<{ id: number, key: string }>();
    const [ activeBoardId, setActiveBoardId ] = useState<number>();
    const [ boards, setBoards ] = useState<Board[]>();

    const [ error, setError ] = useState<boolean>(false);
    const [ loading, setLoading ] = useState<boolean>(true);

    useEffect(() => {
        getSessionInformation(sessionKey).then(response => {
            setSessionInformation({
                id: response.data.id,
                key: response.data.sessionKey
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
    }, [ sessionKey ]);

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

    const contextValue: ISessionContext = {
        session: sessionInformation!!,
        availableBoards: boards!!,
        setActiveBoard: (board: Board) => {
            setActiveBoardId(board.id)
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

    console.log(contextValue.activeBoard)

    return <SessionContext.Provider value={contextValue} {...props} />;
};

export {
    SessionContext,
    SessionContextProvider
};
