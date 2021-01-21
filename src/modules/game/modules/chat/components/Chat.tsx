import { useStyletron } from 'baseui';
import { Block } from 'baseui/block';
import { FC } from 'react';

const RemoteMessage = (props: { sender?: string, content: string, dateSent: number }) => {
    const [ css, theme ] = useStyletron();

    return <>
        {props.sender && <div
            className={css({
                fontSize: '0.75em',
                fontFamily: 'Helvetica, sans-serif',
                marginLeft: '14px',
                color: theme.colors.contentTertiary
            })}
        >
            {props.sender}
        </div>}
        <div
            className={css({
                borderRadius: '20px',
                padding: '8px 14px',
                marginTop: '4px',
                marginBottom: '4px',
                display: 'inline-block',
                marginRight: '25%',
                backgroundColor: theme.colors.backgroundSecondary,
                color: theme.colors.contentPrimary,
                position: 'relative',
                fontFamily: 'Helvetica, sans-serif'
            })}
        >
            {props.content}
        </div>
    </>;
};

const Message = (props: { content: string, dateSent: number }) => {
    const [ css, theme ] = useStyletron();

    return <>
        <div
            className={css({
                borderRadius: '20px',
                padding: '8px 14px',
                marginTop: '4px',
                marginBottom: '4px',
                display: 'inline-block',
                marginLeft: '25%',
                backgroundColor: theme.colors.backgroundAccent,
                color: theme.colors.contentOnColor,
                position: 'relative',
                fontFamily: 'Helvetica, sans-serif'
            })}
        >
            {props.content}
        </div>
    </>;
};

const ChatWindow: FC = (props) => {
    const [ css ] = useStyletron();

    return <div {...props} className={css({
        display: 'flex',
        flexDirection: 'column',
        padding: '10px'
    })}
    />;
};

export function Chat() {
    const [ css, theme ] = useStyletron();
    return (
        <Block
            width="20em"
            height="100%"
            backgroundColor="backgroundTertiary"
            padding="1em"
            className={css({
                boxShadow: theme.lighting.shadow600,
                boxSizing: 'border-box'
            })}
        >
            <ChatWindow>
                <div style={{ alignItems: 'flex-start' }}>
                    <RemoteMessage sender="John Appleseed" content="Hey!" dateSent={289128912} />
                    <RemoteMessage content="Are you there?" dateSent={289128912} />
                </div>
                <div style={{alignItems: 'flex-end'}}>
                    <Message content="Hey! This is a very long message" dateSent={289128912} />
                </div>
            </ChatWindow>
        </Block>
    );
}
