import React, { useEffect } from 'react';
import { useResource } from 'react-three-fiber';
import { DirectionalLight } from 'three';
import { useUserPreferences } from '../../../../preferences/hooks/useUserPreferences';
import { useActiveBoard } from '../../../hooks/useActiveBoard';


export function Lighting() {
    const lightRef = useResource<DirectionalLight>();
    const preferences = useUserPreferences();
    const { width: boardWidth, height: boardHeight } = useActiveBoard();

    useEffect(() => {
        if (lightRef.current) {
            lightRef.current.shadow.camera.left = -boardWidth / 2 - 1;
            lightRef.current.shadow.camera.right = boardWidth / 2 + 1;
            lightRef.current.shadow.camera.top = -boardHeight / 2 - 1;
            lightRef.current.shadow.camera.bottom = boardHeight / 2 + 1;

            lightRef.current.shadow.mapSize.width = 1024 * preferences.devicePixelRatio;
            lightRef.current.shadow.mapSize.height = 1024 * preferences.devicePixelRatio;

            // todo: when changing the shadow map size, the camera should rebuild
        }
    }, [ boardHeight, boardWidth, lightRef, preferences.devicePixelRatio ]);

    return (
        <>
            <directionalLight position={[ boardHeight / 2, boardWidth / 2, 30 ]} intensity={0.75} castShadow={true} ref={lightRef} />
            <ambientLight intensity={0.5} />
        </>
    );
}
