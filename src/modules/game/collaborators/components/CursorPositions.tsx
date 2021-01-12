import { useTexture } from '@react-three/drei';
import React, { useEffect, useRef, useState } from 'react';
import { config, useSpring } from 'react-spring';
import { useFrame, useResource, useThree } from 'react-three-fiber';
import { Mesh } from 'three';
import { connection } from '../../../../shared/connection';
import { useRelativeMousePosition } from '../../board/hooks/useRelativeMousePosition';

function useMousePosition(handler: (mouseVector: [ x: number, y: number ]) => void) {
    const { gl: { domElement } } = useThree();
    const relativeMousePosition = useRelativeMousePosition();

    useEffect(() => {
        const handlePointerMove = (event: PointerEvent) => {
            handler(relativeMousePosition(event.clientX, event.clientY));
        };

        domElement.addEventListener('pointermove', handlePointerMove);

        return () => {
            domElement.removeEventListener('pointermove', handlePointerMove);
        };
    }, [ domElement, handler ]);
}

const PersonalCursor = () => {
    const currentPosition = useRef<[ x: number, y: number ]>();
    const lastPosition = useRef<[ x: number, y: number ]>();

    useMousePosition((position => {
        currentPosition.current = position;
    }));

    useEffect(() => {
        const interval = setInterval(() => {
            if (currentPosition.current && lastPosition.current !== currentPosition.current) {
                lastPosition.current = currentPosition.current;

                connection.emit('cursor_changed', {
                    id: connection.id,
                    name: 'Jonah',
                    position: currentPosition.current
                });
            }
        }, 100);

        return () => {
            clearInterval(interval);
        };
    }, []);

    return null;
};

export const RemoteCursor = ({ id }: { id: string }) => {
    const meshRef = useResource<Mesh>();
    const texture: any = useTexture('assets/cursor.svg');

    const [ { x, y }, set ] = useSpring<{ x: number, y: number }>(() => ({
        x: 0,
        y: 0,
        config: config.stiff
    }));

    useEffect(() => {
        connection.on('cursors_updated', (newCursors: { id: string, name: string, position: [ x: number, y: number ] }[]) => {
            const currentCursor = newCursors.find(it => it.id === id);
            if (currentCursor) {
                set({ x: currentCursor.position[ 0 ], y: currentCursor.position[ 1 ] });
            }
        });

        return () => {
            connection.off('cursors_updated');
        };
    });

    useFrame(() => {
        meshRef.current.position.set(x.getValue(), y.getValue(), 2);
    });

    return (
        <mesh ref={meshRef} position={[ 0, 0, 2 ]} scale={[ 0.2, 0.2, 0.2 ]}>
            <planeBufferGeometry />
            <meshBasicMaterial map={texture} attach="material" transparent />
        </mesh>
    );
};

export const CursorPositions = () => {
    const [ remoteCursorsIds, setRemoteCursorsIds ] = useState<string[]>([]);

    useEffect(() => {
        connection.on('cursors_updated', (newCursors: { id: string, name: string, position: [ x: number, y: number ] }[]) => {
            const newCursorsWithoutPersonal = newCursors.map(it => it.id).filter(cursorId => cursorId !== connection.id);

            if (remoteCursorsIds.length !== newCursorsWithoutPersonal.length || !newCursorsWithoutPersonal.every((value, index) => value === remoteCursorsIds[ index ])) {
                setRemoteCursorsIds(newCursorsWithoutPersonal);
            }
        });

        return () => {
            connection.off('cursors_updated');
        };
    }, [ remoteCursorsIds ]);

    return (
        <>
            <PersonalCursor />
            {remoteCursorsIds.map(it => <RemoteCursor id={it} key={it} />)}
        </>
    );
};
