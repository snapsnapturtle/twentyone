import { useCallback } from 'react';
import { useThree } from 'react-three-fiber';

export function useRelativeMousePosition() {
    const { gl: { domElement }, camera } = useThree();
    const clientRect = domElement.getBoundingClientRect();

    return useCallback((x: number, y: number): [ number, number ] => {
        const relativeX = (x - ((clientRect.width / 2) + clientRect.left)) / camera.zoom + camera.position.x;
        const relativeY = ((y - ((clientRect.height / 2) + clientRect.top)) *-1 )/ camera.zoom + camera.position.y;

        return [ relativeX, relativeY ];
    }, [camera.position.x, camera.position.y, camera.zoom, clientRect.height, clientRect.left, clientRect.top, clientRect.width]);
}
