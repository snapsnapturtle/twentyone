import { Input } from 'baseui/input';
import { StyledLink } from 'baseui/link';
import { ListItem, ListItemLabel } from 'baseui/list';
import React, { createRef, useEffect, useState } from 'react';
import { connection } from '../shared/connection';

const SendMessageInput = () => {
    const [ value, setValue ] = React.useState('');

    const handleKeyPress = (event: React.KeyboardEvent<HTMLInputElement>) => {
        if (event.key === 'Enter') {
            connection.emit('send_message', {
                author: 'Jonah',
                content: value
            });
            setValue('');
        }
    };

    return (
        <Input
            value={value}
            onChange={(e: any) => setValue(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Send a message..."
            clearOnEscape
        />
    );
};

interface MessageProps {
    content: any;
    author: string;
    dateSent: number;
}

const Message = ({ content, author }: MessageProps) => {
    return (
        <ListItem>
            <ListItemLabel description={content}>{author}</ListItemLabel>
        </ListItem>
    );
};

export const Messages = () => {
    const [ messages, setMessages ] = useState<{ content: any, author: string, date_sent: number }[]>([]);
    const messageListRef = createRef<HTMLDivElement>();

    useEffect(() => {
        // @ts-ignore
        connection.on('update_messages', (res) => {
            setMessages(res.reverse());
        });

        return () => {
            connection.off('update_messages');
        };
    }, []);

    useEffect(() => {
        if (messageListRef.current) {
            messageListRef.current.scrollTop = messageListRef.current?.scrollHeight;
        }
    }, [ messageListRef, messages ]);

    return (
        <>
            <div style={{ height: 'calc(100vh - 72px)', overflow: 'scroll', marginBottom: '12px' }} ref={messageListRef}>
                <StyledLink href="//roll20.net" target="_blank" rel="noreferrer noopener">View older messages</StyledLink>
                {messages.map(it => <Message
                    key={it.date_sent} content={it.content} author={it.author} dateSent={it.date_sent}
                />)}
            </div>
            <SendMessageInput />
        </>
    );
};
