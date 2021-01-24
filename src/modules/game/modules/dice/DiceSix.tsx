import CANNON, { Vec3, World } from 'cannon';
import { useEffect, useRef } from 'react';
import { useFrame, useThree } from 'react-three-fiber';
import { useActiveDiceStore } from '../../hooks/useActiveDiceStore';
import { DiceManager, DiceObject } from './DiceLibrary';
import { useCreateDice } from './hooks/useCreateDice';

const boardWidth = 23;
const boardHeight = 15;

export function DiceSix() {
    const { scene } = useThree();
    const diceRefs = useRef<DiceObject[]>([]);
    const rollDice = useCreateDice();
    const diceToRoll = useActiveDiceStore(state => state.dice);
    const setDice = useActiveDiceStore(state => state.setDice);

    useEffect(() => {
        DiceManager.setWorld(new World());

        DiceManager.world.addBody(new CANNON.Body({
            mass: 0,
            shape: new CANNON.Plane(),
            material: DiceManager.floorBodyMaterial,
            position: new Vec3(0, 0, -1)
        }));

        const ceiling = new CANNON.Body({
            mass: 0,
            shape: new CANNON.Plane(),
            material: DiceManager.barrierBodyMaterial,
            position: new Vec3(0, 0, 4.5)
        });
        ceiling.quaternion.setFromAxisAngle(new Vec3(1, 0, 0), Math.PI);

        const wallTop = new CANNON.Body({
            mass: 0,
            shape: new CANNON.Plane(),
            material: DiceManager.barrierBodyMaterial,
            position: new Vec3(0, boardHeight / 2, -1)
        });
        wallTop.quaternion.setFromAxisAngle(new Vec3(1, 0, 0), Math.PI / 2);

        const wallLeft = new CANNON.Body({
            mass: 0,
            shape: new CANNON.Plane(),
            material: DiceManager.barrierBodyMaterial,
            position: new Vec3(-boardWidth / 2, 0, -1)
        });
        wallLeft.quaternion.setFromAxisAngle(new Vec3(0, 1, 0), Math.PI / 2);

        const wallRight = new CANNON.Body({
            mass: 0,
            shape: new CANNON.Plane(),
            material: DiceManager.barrierBodyMaterial,
            position: new Vec3(boardWidth / 2, 0, -1)
        });
        wallRight.quaternion.setFromAxisAngle(new Vec3(0, -1, 0), Math.PI / 2);

        const wallBottom = new CANNON.Body({
            mass: 0,
            shape: new CANNON.Plane(),
            material: DiceManager.barrierBodyMaterial,
            position: new Vec3(0, -boardHeight / 2, -1)
        });
        wallBottom.quaternion.setFromAxisAngle(new Vec3(-1, 0, 0), Math.PI / 2);

        DiceManager.world.addBody(ceiling);
        DiceManager.world.addBody(wallTop);
        DiceManager.world.addBody(wallLeft);
        DiceManager.world.addBody(wallRight);
        DiceManager.world.addBody(wallBottom);

        DiceManager.world.gravity.set(0, 0, -9.82 * 2);
        DiceManager.world.broadphase = new CANNON.NaiveBroadphase();
        DiceManager.world.solver.iterations = 16;
    }, []);

    useFrame(() => {
        DiceManager.world.step(1.0 / 60.0);

        diceRefs.current.forEach(it => {
            it.updateMeshFromBody();
        });
    });

    useEffect(() => {
        if (diceToRoll.length > 0) {
            if (diceRefs.current.length) {
                diceRefs.current.forEach(it => {
                    scene.remove(it.getObject());
                    DiceManager.world.remove(it.getObject().body!!);
                });
            }

            rollDice(diceToRoll).then(rolledDice => {
                rolledDice.forEach(it => {
                    scene.add(it.dice.getObject());
                    diceRefs.current.push(it.dice);
                });

                setDice([]);
            });
        }
    }, [ diceToRoll, rollDice, scene, setDice ]);

    return null;
}
