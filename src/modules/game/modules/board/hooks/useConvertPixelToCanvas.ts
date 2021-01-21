import { useCallback } from 'react';
import { useThree } from 'react-three-fiber';

export function useConvertPixelToCanvas() {
    const { camera } = useThree();

    return useCallback((x: number, y: number): [ number, number ] => {
        const relativeX = x / camera.zoom;
        const relativeY = (y * -1) / camera.zoom;

        return [ Math.round(relativeX * 100) / 100, Math.round(relativeY * 100) / 100 ];
    }, [camera.zoom]);
}
