import { Html } from '@react-three/drei';
import React, { useEffect, useRef, useState } from 'react';
import { config, useSpring } from 'react-spring';
import { useFrame, useThree, useUpdate } from 'react-three-fiber';
import { BufferGeometry, Color, Mesh, Vector3 } from 'three';
import { MeshLine, MeshLineMaterial } from '../../../../../types/Three.Meshline';
import { calculateDistance } from '../../../../../util/calculateDistance';
import { useUserPreferences } from '../../../../preferences/hooks/useUserPreferences';
import { useColors } from '../hooks/useColors';
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

export function PolyLineRuler() {
    const htmlRef = useRef<any>();
    const { gl: { domElement } } = useThree();
    const distanceRef = useRef<HTMLDivElement>(null);
    const [ isDrawing, setIsDrawing ] = useState<boolean>(true);
    const mousePosition = useRef<[ x: number, y: number ]>([ 0, 0 ]);
    const [ lineVectors, setLineVectors ] = useState<[ x: number, y: number ][]>([]);
    const relativeMousePosition = useRelativeMousePosition();
    const preferences = useUserPreferences();
    const colors = useColors();
    const lineGeometry = useUpdate<Mesh>(mesh => {
        const a = new MeshLine();
        const points: number[] = [];

        lineVectors.forEach((v) => {
            points.push(v[ 0 ], v[ 1 ], 1);
            points.push(v[ 0 ], v[ 1 ], 1);
        });

        a.setPoints(points);

        mesh.geometry = a;
        mesh.material = new MeshLineMaterial({
            color: new Color(colors.backgroundAccent),
            lineWidth: 0.1
        });
    }, [ lineVectors ]);

    const [ { mouseX, mouseY }, set ] = useSpring<{ mouseX: number, mouseY: number }>(() => ({
        mouseX: 0,
        mouseY: 0,
        config: config.stiff
    }));

    const geometryRef = useUpdate<BufferGeometry>(geometry => {
        geometry.setFromPoints([]);
    }, []);

    useFrame(() => {
        const currentDistanceElement = distanceRef.current;

        if (lineVectors.length > 0) {
            const existingPath = lineVectors.map(position => new Vector3(position[ 0 ], position[ 1 ], 1));

            if (isDrawing) {
                // add current mouse position to line
                existingPath.push(new Vector3(mouseX.getValue(), mouseY.getValue(), 1));
            }

            geometryRef.current?.setFromPoints(existingPath);

            const currentHtmlRef = htmlRef.current;

            if (currentHtmlRef) {
                if (isDrawing) {
                    const pX = mouseX.getValue();
                    const pY = mouseY.getValue() + 0.5;

                    currentHtmlRef.position.set(pX, pY, 1);
                } else {
                    const lastPosition = lineVectors[ lineVectors.length - 1 ];
                    currentHtmlRef.position.set(lastPosition[ 0 ], lastPosition[ 1 ] + 0.5, 1);
                }
            }

            if (currentDistanceElement) {
                const distancePoints = [ ...lineVectors ];

                if (isDrawing) {
                    distancePoints.push(mousePosition.current);
                }

                const totalDistance = distancePoints.reduce((totalDistance: number, currentPosition, index, allPositions): number => {
                    if (index > 0) {
                        return totalDistance + calculateDistance(allPositions[ index - 1 ], currentPosition);
                    }

                    return 0;
                }, 0);

                if (totalDistance > 0) {
                    const displayDistance = Math.round(totalDistance);
                    currentDistanceElement.style.display = 'block';
                    currentDistanceElement.innerHTML = `${displayDistance * 5}&nbsp;ft\n${displayDistance}&nbsp;sq`;
                }
            }
        } else {
            geometryRef.current?.setFromPoints([]);

            if (currentDistanceElement) {
                currentDistanceElement.style.display = 'none';
            }
        }
    });

    useEffect(() => {
        function handlePointerDown(event: any) {
            if (event.button === LEFT_MOUSE_BUTTON) {
                if (!isDrawing) {
                    setIsDrawing(true);
                    setLineVectors([]);
                }

                setLineVectors(current => current.concat([ adjustVectorToPreference(relativeMousePosition(event.clientX, event.clientY), preferences.snapRulerToCenter) ]));
            }

            if (event.button === RIGHT_MOUSE_BUTTON) {
                if (isDrawing) {
                    setIsDrawing(false);
                    if (lineVectors.length === 1) {
                        setLineVectors([]);
                    }
                } else {
                    // clear all lines
                    setLineVectors([]);
                }
            }
        }

        function handlePointerMove(event: any) {
            const pos = adjustVectorToPreference(relativeMousePosition(event.clientX, event.clientY), preferences.snapRulerToCenter);
            mousePosition.current = pos;

            set({
                mouseX: pos[ 0 ],
                mouseY: pos[ 1 ]
            });
        }

        domElement.addEventListener('pointerdown', handlePointerDown);
        domElement.addEventListener('pointermove', handlePointerMove);

        return () => {
            domElement.removeEventListener('pointerdown', handlePointerDown);
            domElement.removeEventListener('pointermove', handlePointerMove);
        };
    }, [domElement, isDrawing, lineVectors.length, preferences.snapRulerToCenter, relativeMousePosition, set]);

    return (
        <>
            <mesh ref={htmlRef} position={[ 0, 0, 0 ]}>
                <Html style={{ pointerEvents: 'none' }}>
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
                            pointerEvents: 'none'
                        }} ref={distanceRef}
                    />
                </Html>
            </mesh>

            <mesh ref={lineGeometry} />

            {lineVectors.map((position, index) => (
                <mesh scale={[ 0.2, 0.2, 0.2 ]} position={[ position[ 0 ], position[ 1 ], 1 ]} key={index}>
                    <circleBufferGeometry args={[ 0.5, 360 ]} />
                    <meshBasicMaterial color={new Color(colors.backgroundAccent)} />
                </mesh>
            ))}
            <line>
                <bufferGeometry attach="geometry" ref={geometryRef} />
                <lineBasicMaterial color={new Color(colors.backgroundAccent)} />
            </line>
        </>
    );
}
