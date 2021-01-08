import { MapControls } from '@react-three/drei';
import * as THREE from 'three';

export function MoveControls() {
    const keyMapping = {
        LEFT: THREE.MOUSE.ROTATE,
        MIDDLE: THREE.MOUSE.DOLLY,
        RIGHT: THREE.MOUSE.PAN
    };

    return <MapControls enableRotate={true} enableDamping={false} mouseButtons={keyMapping} maxZoom={150} minZoom={10} />;
}
