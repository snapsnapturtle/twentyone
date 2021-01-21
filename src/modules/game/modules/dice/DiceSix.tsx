import { Html } from '@react-three/drei';
import CANNON, { Vec3, World } from 'cannon';
import React, { useMemo, useRef } from 'react';
import { useFrame, useThree } from 'react-three-fiber';
import { DiceManager, DiceObject } from './DiceLibrary';
import { useCreateDice } from './hooks/useCreateDice';

const boardWidth = 23;
const boardHeight = 15;

export function DiceSix() {
    const { scene } = useThree();
    const diceRefs = useRef<DiceObject[]>([]);
    const rollDice = useCreateDice();

    useMemo(() => {
        const world = new World();

        world.addBody(new CANNON.Body({ mass: 0, shape: new CANNON.Plane(), material: DiceManager.floorBodyMaterial, position: new Vec3(0, 0, -1) }));

        let wallTop = new CANNON.Body({
            mass: 0,
            shape: new CANNON.Plane(),
            material: DiceManager.barrierBodyMaterial,
            position: new Vec3(0, boardHeight / 2, -1)
        });
        wallTop.quaternion.setFromAxisAngle(new Vec3(1, 0, 0), Math.PI / 2.5);

        let wallLeft = new CANNON.Body({
            mass: 0,
            shape: new CANNON.Plane(),
            material: DiceManager.barrierBodyMaterial,
            position: new Vec3(-boardWidth / 2, 0, -1)
        });
        wallLeft.quaternion.setFromAxisAngle(new Vec3(0, 1, 0), Math.PI / 2.5);

        let wallRight = new CANNON.Body({
            mass: 0,
            shape: new CANNON.Plane(),
            material: DiceManager.barrierBodyMaterial,
            position: new Vec3(boardWidth / 2, 0, -1)
        });
        wallRight.quaternion.setFromAxisAngle(new Vec3(0, -1, 0), Math.PI / 2.5);

        let wallBottom = new CANNON.Body({
            mass: 0,
            shape: new CANNON.Plane(),
            material: DiceManager.barrierBodyMaterial,
            position: new Vec3(0, -boardHeight / 2, -1)
        });
        wallBottom.quaternion.setFromAxisAngle(new Vec3(-1, 0, 0), Math.PI / 2.5);

        world.addBody(wallTop);
        world.addBody(wallLeft);
        world.addBody(wallRight);
        world.addBody(wallBottom);

        DiceManager.setWorld(world);
        DiceManager.world.gravity.set(0, 0, -9.82 * 2);
        DiceManager.world.broadphase = new CANNON.NaiveBroadphase();
        DiceManager.world.solver.iterations = 10;
    }, []);

    useFrame(() => {
        DiceManager.world.step(1.0 / 60.0);

        diceRefs.current.forEach(it => {
            it.updateMeshFromBody();
        });
    });

    const handleRollDiceClick = () => {
        if (diceRefs.current.length) {
            diceRefs.current.forEach(it => {
                scene.remove(it.getObject());
                DiceManager.world.remove(it.getObject().body);
            });
        }

        rollDice('d6', 6).then(obj => {
            scene.add(obj.getObject());
            diceRefs.current.push(obj);
        });
    };

    return <>
        <Html center>
            <button onClick={handleRollDiceClick}>roll dice</button>
        </Html>
    </>;
}
