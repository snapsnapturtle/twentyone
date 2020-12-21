import { BaseProvider, DarkTheme, LightTheme } from 'baseui';
import React, { FC } from 'react';
import { Client as Styletron } from 'styletron-engine-atomic';
import { Provider as StyletronProvider } from 'styletron-react';
import { Board } from './modules/board/components/Board';
import { CollaboratorBar } from './modules/collaborators/components/CollaboratorBar';
import { UserPreferencesContextProvider } from './modules/preferences/contexts/UserPreferencesContext';
import { useUserPreferences } from './modules/preferences/hooks/useUserPreferences';
import { Toolbox } from './modules/toolbox/components/Toolbox';
import { ToolContextProvider } from './modules/toolbox/contexts/ToolContext';
import { Main } from './shared/components/Main';
import { ShortcutHandler } from './shared/components/ShortcutHandler';

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

function App() {
    return (
        <StyletronProvider value={engine}>
            <UserPreferencesContextProvider>
                <UserBaseProvider>
                    <div style={{ display: 'flex', height: '100%' }}>
                        <ToolContextProvider>
                            <ShortcutHandler />
                            <Main>
                                <Board />
                                <Toolbox />
                                <CollaboratorBar />
                            </Main>
                        </ToolContextProvider>
                    </div>
                </UserBaseProvider>
            </UserPreferencesContextProvider>
        </StyletronProvider>
    );
}

export default App;
