import { useStyletron } from 'baseui';
import { Avatar } from 'baseui/avatar';
import React, { useEffect, useState } from 'react';
import { connection } from '../../../shared/connection';

interface Collaborator {
    id: string;
}

export function CollaboratorBar() {
    const theme = useStyletron()[ 1 ];
    const [ collaborators, setCollaborators ] = useState<Collaborator[]>([]);

    useEffect(() => {
        const handleUsersChanged = (updatedUsers: Collaborator[]) => {
            setCollaborators(updatedUsers);
        };
        connection.on('users_changed', handleUsersChanged);

        return () => {
            connection.off('users_changed', handleUsersChanged);
        };
    }, []);

    return (
        <div
            style={{
                display: 'flex',
                alignItems: 'center',
                position: 'absolute',
                right: '1em',
                top: '1em',
                boxSizing: 'border-box',
                height: '3em',
                padding: '0.5em',
                color: theme.colors.contentPrimary,
                boxShadow: theme.lighting.shadow500,
                background: theme.colors.backgroundTertiary
            }}
        >
            {collaborators.map(it => (
                <Avatar
                    key={it.id}
                    name={it.id}
                    size="scale800"
                    overrides={{
                        Root: {
                            style: {
                                marginLeft: '0.125em',
                                marginRight: '0.125em',
                                borderWidth:'0.1875em',
                                borderStyle: 'solid',
                                borderColor: it.id === connection.id ? theme.colors.borderWarning : theme.colors.borderAlt,
                            }
                        }
                    }}
                    src={`https://picsum.photos/seed/${it.id}/60/60.jpg`}
                />
            ))}
        </div>
    );
}
