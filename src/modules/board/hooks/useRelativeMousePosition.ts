import { useCallback } from 'react';
import { useThree } from 'react-three-fiber';
import { useConvertPixelToCanvas } from './useConvertPixelToCanvas';

export function useRelativeMousePosition() {
    const convertPixelToCanvas = useConvertPixelToCanvas();
    const { gl: { domElement }, camera } = useThree();
    const clientRect = domElement.getBoundingClientRect();

    return useCallback((x: number, y: number): [ number, number ] => {
        const relativeX = (x - (clientRect.width / 2) - clientRect.left);
        const relativeY = ((y - (clientRect.height / 2) - clientRect.top));

        const canvasVector = convertPixelToCanvas(relativeX, relativeY);

        return [ canvasVector[ 0 ] + camera.position.x, canvasVector[ 1 ] + camera.position.y ];
    }, [ camera.position.x, camera.position.y, clientRect.height, clientRect.left, clientRect.top, clientRect.width, convertPixelToCanvas ]);
}
