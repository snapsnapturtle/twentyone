import { BaseProvider, DarkTheme, LightTheme } from 'baseui';
import { Check } from 'baseui/icon';
import { DURATION, SnackbarProvider, useSnackbar } from 'baseui/snackbar';
import React, { FC, useEffect } from 'react';
import { Client as Styletron } from 'styletron-engine-atomic';
import { Provider as StyletronProvider } from 'styletron-react';
import { Board } from './modules/game/board/components/Board';
import { ColorsContextProvider } from './modules/game/board/context/ColorsContext';
import { CollaboratorBar } from './modules/game/collaborators/components/CollaboratorBar';
import { UserPreferencesContextProvider } from './modules/preferences/contexts/UserPreferencesContext';
import { useUserPreferences } from './modules/preferences/hooks/useUserPreferences';
import { Toolbox } from './modules/game/toolbox/components/Toolbox';
import { ToolContextProvider } from './modules/game/toolbox/contexts/ToolContext';
import { Main } from './shared/components/Main';
import { ShortcutHandler } from './shared/components/ShortcutHandler';
import { connection } from './shared/connection';

const engine = new Styletron();

const UserBaseProvider: FC = ({ children }) => {
    const preferences = useUserPreferences();
    let theme;

    switch (preferences.theme) {
        case 'auto':
            theme = window.matchMedia('(prefers-color-scheme: dark)').matches ? DarkTheme : LightTheme;
            break;
        case 'light':
            theme = LightTheme;
            break;
        case 'dark':
            theme = DarkTheme;
            break;
    }

    return <BaseProvider theme={theme} children={children!!} />;
};

function ConnectionStatus() {
    const { enqueue, dequeue } = useSnackbar();

    useEffect(() => {
        connection.io.on('error', () => {
            enqueue({ message: 'Reconnecting to server...', progress: true }, DURATION.infinite);
        });

        connection.io.on('reconnect', () => {
            dequeue()
            enqueue({ message: 'Connection established', startEnhancer: ({ size }) => <Check size={size} /> });
        });
    }, [dequeue, enqueue]);

    return null;
}

function App() {
    return (
        <StyletronProvider value={engine}>
            <UserPreferencesContextProvider>
                <UserBaseProvider>
                    <SnackbarProvider>
                        <ConnectionStatus />
                        <div style={{ display: 'flex', height: '100%' }}>
                            <ToolContextProvider>
                                <ShortcutHandler />
                                <Main>
                                    <ColorsContextProvider>
                                        <Board />
                                    </ColorsContextProvider>
                                    <Toolbox />
                                    <CollaboratorBar />
                                </Main>
                            </ToolContextProvider>
                        </div>
                    </SnackbarProvider>
                </UserBaseProvider>
            </UserPreferencesContextProvider>
        </StyletronProvider>
    );
}

export default App;
