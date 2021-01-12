import { Html } from '@react-three/drei';
import React, { useEffect, useRef, useState } from 'react';
import { config, useSpring } from 'react-spring';
import { useFrame, useThree } from 'react-three-fiber';
import { Color, Mesh } from 'three';
import { calculateDistance } from '../../../../util/calculateDistance';
import { useUserPreferences } from '../../../preferences/hooks/useUserPreferences';
import { useColors } from '../hooks/useColors';
import { useDisplayDistance } from '../hooks/useDisplayDistance';
import { useRelativeMousePosition } from '../hooks/useRelativeMousePosition';

const LEFT_MOUSE_BUTTON = 0;
const RIGHT_MOUSE_BUTTON = 2;

function adjustVectorToPreference(vector: [ x: number, y: number ], snapToCenter: boolean): [ x: number, y: number ] {
    if (snapToCenter) {
        return [ Math.round(vector[ 0 ]), Math.round(vector[ 1 ]) ];
    } else {
        return [ Math.round(vector[ 0 ] * 10) / 10, Math.round(vector[ 1 ] * 10) / 10 ];
    }
}

export function CircleRuler() {
    const { gl: { domElement } } = useThree();
    const distanceRef = useRef<HTMLDivElement>(null);
    const [ isDrawing, setIsDrawing ] = useState<boolean>(true);
    const [ centerVector, setCenterVector ] = useState<[ x: number, y: number ]>();
    const relativeMousePosition = useRelativeMousePosition();
    const preferences = useUserPreferences();
    const displayDistance = useDisplayDistance();
    const circleGeometryMesh = useRef<Mesh>();
    const colors = useColors();

    const [ { radius }, set ] = useSpring<{ radius: number }>(() => ({
        radius: 0.5,
        config: config.stiff
    }));

    useFrame(() => {
        const circleMesh = circleGeometryMesh.current;
        const currentDistanceElement = distanceRef.current;

        if (centerVector && circleMesh) {
            const newRadius = radius.getValue() * 2;
            circleMesh.scale.set(newRadius, newRadius, newRadius);

            if (currentDistanceElement) {
                if (newRadius > 0) {
                    const displayRadius = Math.round(radius.getValue() - 0.5);
                    currentDistanceElement.innerHTML = displayDistance(displayRadius);
                }
            }

        }
    });

    useEffect(() => {
        function handlePointerDown(event: any) {
            if (event.button === LEFT_MOUSE_BUTTON) {
                if (!isDrawing) {
                    setIsDrawing(true);
                    set({ radius: 0.5, immediate: true });
                    setCenterVector(adjustVectorToPreference(relativeMousePosition(event.clientX, event.clientY), preferences.snapRulerToCenter));
                    return;
                }

                if (centerVector === undefined) {
                    setCenterVector(adjustVectorToPreference(relativeMousePosition(event.clientX, event.clientY), preferences.snapRulerToCenter));
                } else {
                    setIsDrawing(false);
                }
            }

            if (event.button === RIGHT_MOUSE_BUTTON) {
                // clear all lines
                setIsDrawing(false);
                setCenterVector(undefined);
                set({ radius: 0.5, immediate: true });
            }
        }

        function handlePointerMove(event: any) {
            if (centerVector && isDrawing) {
                set({
                    immediate: false,
                    radius: (
                        calculateDistance(
                            centerVector,
                            adjustVectorToPreference(relativeMousePosition(event.clientX, event.clientY), preferences.snapRulerToCenter)
                        ) + 0.5
                    )
                });
            }
        }

        domElement.addEventListener('pointerdown', handlePointerDown);
        domElement.addEventListener('pointermove', handlePointerMove);

        return () => {
            domElement.removeEventListener('pointerdown', handlePointerDown);
            domElement.removeEventListener('pointermove', handlePointerMove);
        };
    }, [ centerVector, domElement, isDrawing, preferences.snapRulerToCenter, relativeMousePosition, set ]);

    return (
        <>
            {centerVector && <Html style={{ pointerEvents: 'none' }} position={[ centerVector[ 0 ], centerVector[ 1 ] + 0.5, 0 ]}>
                <div
                    style={{
                        color: colors.contentInversePrimary,
                        background: colors.backgroundInversePrimary,
                        fontWeight: 400,
                        fontFamily: 'monospace',
                        transform: 'translate(-50%, -50%)',
                        padding: '0.25em 0.5em',
                        borderRadius: '0.125em',
                        textAlign: 'center',
                        pointerEvents: 'none',
                        zIndex: 0
                    }} ref={distanceRef}
                />
            </Html>}
            {centerVector && <mesh position={[ centerVector[ 0 ], centerVector[ 1 ], 1 ]} scale={[ 0.5, 0.5, 0.5 ]} ref={circleGeometryMesh}>
                <circleBufferGeometry attach="geometry" args={[ 0.5, 360 ]} />
                <meshStandardMaterial color={new Color(colors.backgroundAccent)} transparent opacity={0.25} />
            </mesh>}
            {centerVector && <mesh position={[ centerVector[ 0 ], centerVector[ 1 ], 1 ]} scale={[ 0.2, 0.2, 0.2 ]}>
                <circleBufferGeometry attach="geometry" args={[ 0.5, 360 ]} />
                <meshStandardMaterial color={new Color(colors.backgroundAccent)} />
            </mesh>}
        </>
    );
}
