import { Html } from '@react-three/drei';
import React, { MutableRefObject, useEffect, useRef, useState } from 'react';
import { config, useSpring } from 'react-spring';
import { useFrame, useThree, useUpdate } from 'react-three-fiber';
import { BufferGeometry, Vector3 } from 'three';
import { useUserPreferences } from '../../preferences/hooks/useUserPreferences';
import { useRelativeMousePosition } from '../hooks/useRelativeMousePosition';

const LEFT_MOUSE_BUTTON = 0;
const RIGHT_MOUSE_BUTTON = 2;

interface RulerProps {
    mousePosition: MutableRefObject<[ x: number, y: number ]>
}

function adjustVectorToPreference(vector: [ x: number, y: number ], snapToCenter: boolean): [ x: number, y: number ] {
    if (snapToCenter) {
        return [ Math.round(vector[ 0 ]), Math.round(vector[ 1 ]) ];
    } else {
        return [ Math.round(vector[ 0 ] * 10) / 10, Math.round(vector[ 1 ] * 10) / 10 ];
    }
}

export function PolyLineRuler(props: RulerProps) {
    const htmlRef = useRef<any>();
    const { gl: { domElement } } = useThree();
    const distanceRef = useRef<HTMLDivElement>(null);
    const [ isDrawing, setIsDrawing ] = useState<boolean>(true);
    const mousePosition = useRef<[ x: number, y: number ]>([ 0, 0 ]);
    const [ lineVectors, setLineVectors ] = useState<[ x: number, y: number ][]>([]);
    const relativeMousePosition = useRelativeMousePosition();
    const preferences = useUserPreferences();

    const [ { mouseX, mouseY }, set ] = useSpring<{ mouseX: number, mouseY: number }>(() => ({
        mouseX: 0,
        mouseY: 0,
        config: { ...config.stiff, clamp: true }
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
                        const dx = Math.abs(allPositions[ index - 1 ][ 0 ] - currentPosition[ 0 ]);
                        const dy = Math.abs(allPositions[ index - 1 ][ 1 ] - currentPosition[ 1 ]);

                        return totalDistance + Math.max(dx, dy);
                    }

                    return 0;
                }, 0);

                if (totalDistance > 0) {
                    currentDistanceElement.style.display = 'block';
                    currentDistanceElement.innerHTML = `${totalDistance * 5}&nbsp;ft\n${totalDistance}&nbsp;sq`;
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
                            color: 'white',
                            background: 'rgba(203,203,203, 0.5)',
                            fontFamily: 'sans-serif',
                            fontWeight: 600,
                            fontSize: '1em',
                            transform: 'translate(-50%, -50%)',
                            padding: '0.125em 0.5em',
                            borderRadius: '0.25em',
                            textAlign: 'center',
                            pointerEvents: 'none'
                        }} ref={distanceRef}
                    />
                </Html>
            </mesh>
            {lineVectors.map((position, index) => (
                <mesh scale={[ 0.05, 0.05, 0.05 ]} position={[ position[ 0 ], position[ 1 ], 1 ]} key={index}>
                    <circleBufferGeometry args={[ 1, 360 ]} />
                    <meshBasicMaterial color="red" />
                </mesh>
            ))}
            <line>
                <bufferGeometry attach="geometry" ref={geometryRef} />
                <lineBasicMaterial color="red" linewidth={20} />
            </line>
        </>
    );
}
