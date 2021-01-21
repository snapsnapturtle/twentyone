import { BaseProvider, DarkTheme, LightTheme } from 'baseui';
import { ToasterContainer } from 'baseui/toast';
import React, { FC } from 'react';
import { BrowserRouter, Route, Switch } from 'react-router-dom';
import { Client as Styletron } from 'styletron-engine-atomic';
import { Provider as StyletronProvider } from 'styletron-react';
import { DashboardPage } from './modules/dashboard/pages/DashboardPage';
import { GamePage } from './modules/game/pages/GamePage';
import { JoinSessionPage } from './modules/join-session/pages/JoinSessionPage';
import { UserPreferencesContextProvider } from './modules/preferences/contexts/UserPreferencesContext';
import { useUserPreferences } from './modules/preferences/hooks/useUserPreferences';
import { ProfilePage } from './modules/profile/pages/ProfilePage';
import { Main } from './shared/components/Main';

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
                    <ToasterContainer>
                        <BrowserRouter>
                            <Main>
                                <Switch>
                                    <Route exact path="/" component={DashboardPage} />
                                    <Route exact path="/session/:sessionKey" component={GamePage} />
                                    <Route exact path="/join-session" component={JoinSessionPage} />
                                    <Route exact path="/join-session/:sessionKey" component={JoinSessionPage} />
                                    <Route exact path="/profile" component={ProfilePage} />
                                </Switch>
                            </Main>
                        </BrowserRouter>
                    </ToasterContainer>
                </UserBaseProvider>
            </UserPreferencesContextProvider>
        </StyletronProvider>
    );
}

export default App;
