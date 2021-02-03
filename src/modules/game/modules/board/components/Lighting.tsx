import React, { useEffect } from 'react';
import { useFrame, useResource, useThree } from 'react-three-fiber';
import { DirectionalLight, Vector3 } from 'three';
import { useUserPreferences } from '../../../../preferences/hooks/useUserPreferences';
import { useActiveBoard } from '../../../hooks/useActiveBoard';


export function Lighting() {
    const lightRef = useResource<DirectionalLight>();
    const preferences = useUserPreferences();
    const { camera } = useThree();
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

    useFrame(() => {
        lightRef.current.position.copy(camera.position).add(new Vector3(15, 15, 0));
        lightRef.current.position.z = 150 - camera.zoom;

        console.log(camera.zoom);
    });

    return (
        <>
            <directionalLight position={[ boardHeight / 2, boardWidth / 2, 30 ]} intensity={0.75} castShadow={true} ref={lightRef} />
            <ambientLight intensity={0.5} />
        </>
    );
}
