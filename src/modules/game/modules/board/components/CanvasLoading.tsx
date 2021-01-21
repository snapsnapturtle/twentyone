import { Html } from '@react-three/drei';
import React from 'react';
import { useColors } from '../hooks/useColors';

export function CanvasLoading() {
    const colors = useColors();

    return (
        <Html center>
            <span style={{ fontFamily: 'sans-serif', color: colors.contentPrimary }}>Loading&nbsp;board...</span>
        </Html>
    );
}
