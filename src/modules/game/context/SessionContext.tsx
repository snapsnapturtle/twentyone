import { createContext, FC } from 'react';

interface ISessionContext {
    sessionKey: string;
}

const SessionContext = createContext<ISessionContext>({
    sessionKey: ''
});

const SessionContextProvider: FC<{ sessionKey: string }> = ({ sessionKey, ...props }) => {
    const contextValue: ISessionContext = {
        sessionKey: sessionKey
    };

    return <SessionContext.Provider value={contextValue} {...props} />;
};

export {
    SessionContext,
    SessionContextProvider
};
