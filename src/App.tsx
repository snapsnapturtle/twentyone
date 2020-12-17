import { BaseProvider, DarkTheme, LightTheme } from 'baseui';
import React, { useEffect, useState } from 'react';
import { Client as Styletron } from 'styletron-engine-atomic';
import { Provider as StyletronProvider } from 'styletron-react';
import { Board } from './components/Board';
import { Main } from './components/Main';
import { connection } from './shared/connection';

const engine = new Styletron();

function App() {
    const [ dark, setDark ] = useState(true);
    useEffect(() => {
        connection.emit('initial_data');
    }, []);

    return (
        <StyletronProvider value={engine}>
            <BaseProvider theme={dark ? DarkTheme : LightTheme}>
                <div style={{ display: 'flex', height: '100%' }}>
                    <Main>
                        <Board />
                        {/*<Dice />*/}
                        {/*<Checkbox*/}
                        {/*    checked={dark}*/}
                        {/*    onChange={() => setDark(!dark)}*/}
                        {/*    labelPlacement={LABEL_PLACEMENT.right}*/}
                        {/*>*/}
                        {/*    Dark Mode?*/}
                        {/*</Checkbox>*/}
                    </Main>
                    {/*<Sidebar>*/}
                    {/*<Messages />*/}
                    {/*</Sidebar>*/}
                </div>
            </BaseProvider>
        </StyletronProvider>
    );
}

export default App;
