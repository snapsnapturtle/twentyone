import { MapControls } from '@react-three/drei';
import * as THREE from 'three';

export function MoveControls() {
    const keyMapping = {
        LEFT: THREE.MOUSE.ROTATE,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.PAN
    };

    return <MapControls enableRotate={false} enableDamping={false} mouseButtons={keyMapping} maxZoom={120} minZoom={10} />;
}
