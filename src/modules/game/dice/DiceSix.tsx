import CANNON, { Vec3, World } from 'cannon';
import React, { useEffect, useRef } from 'react';
import { useFrame, useResource, useThree } from 'react-three-fiber';
import { PointLight } from 'three';
import { DiceD10, DiceD12, DiceD20, DiceD4, DiceD6, DiceD8, DiceManager, DiceObject } from './DiceLibrary';

export function DiceSix() {
    const { scene } = useThree();
    const ref = useResource<PointLight>();
    const diceRef = useRef<DiceD4 | DiceD6 | DiceD8 | DiceD12 | DiceD20 | DiceD10>();
    const diceRefs = useRef<DiceObject[]>([]);

    useEffect(() => {
        const world = new World();
        world.addBody(new CANNON.Body({ mass: 0, shape: new CANNON.Plane(), material: DiceManager.floorBodyMaterial, position: new Vec3(0, 0, -1) }));

        let wallTop = new CANNON.Body({ mass: 0, shape: new CANNON.Plane(), material: DiceManager.barrierBodyMaterial, position: new Vec3(0, 6.5, 0) });
        wallTop.quaternion.setFromAxisAngle(new Vec3(1, 0, 0), Math.PI / 2);
        wallTop.force.set(2, 0, 0);

        let wallLeft = new CANNON.Body({ mass: 0, shape: new CANNON.Plane(), material: DiceManager.barrierBodyMaterial, position: new Vec3(-12.5, 0, 0) });
        wallLeft.quaternion.setFromAxisAngle(new Vec3(0, 1, 0), Math.PI / 2);

        let wallRight = new CANNON.Body({ mass: 0, shape: new CANNON.Plane(), material: DiceManager.barrierBodyMaterial, position: new Vec3(12.5, 0, 0) });
        wallRight.quaternion.setFromAxisAngle(new Vec3(0, -1, 0), Math.PI / 2);

        let wallBottom = new CANNON.Body({ mass: 0, shape: new CANNON.Plane(), material: DiceManager.barrierBodyMaterial, position: new Vec3(0, -6.5, 0) });
        wallBottom.quaternion.setFromAxisAngle(new Vec3(-1, 0, 0), Math.PI / 2);

        world.addBody(wallTop);
        world.addBody(wallLeft);
        world.addBody(wallRight);
        world.addBody(wallBottom);

        DiceManager.setWorld(world);
        DiceManager.world.gravity.set(0, 0, -9.82 * 2);
        DiceManager.world.broadphase = new CANNON.NaiveBroadphase();
        DiceManager.world.solver.iterations = 16;
    }, [ scene ]);

    useEffect(() => {
        function getDiceObject(dieType: 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20', faceColor: string, dieColor: string): DiceObject {
            switch (dieType) {
                case 'd4':
                    return new DiceD4({
                        size: 0.75,
                        fontColor: faceColor,
                        backColor: dieColor
                    });
                case 'd6':
                    return new DiceD6({
                        size: 0.75,
                        fontColor: faceColor,
                        backColor: dieColor
                    });
                case 'd8':
                    return new DiceD8({
                        size: 0.75,
                        fontColor: faceColor,
                        backColor: dieColor
                    });
                case 'd10':
                    return new DiceD10({
                        size: 0.75,
                        fontColor: faceColor,
                        backColor: dieColor
                    });
                case 'd12':
                    return new DiceD12({
                        size: 0.75,
                        fontColor: faceColor,
                        backColor: dieColor
                    });
                case 'd20':
                    return new DiceD20({
                        size: 0.75,
                        fontColor: faceColor,
                        backColor: dieColor
                    });

            }
        }

        function roll(dieType: 'd4' | 'd6' | 'd8' | 'd10' | 'd12' | 'd20', faceColor: string, dieColor: string): DiceObject {
            const die = getDiceObject(dieType, faceColor, dieColor);
            die.getObject()!!.position.x = Math.random() * 6 - 3;
            die.getObject()!!.position.y = Math.random() * 6 - 3;
            die.getObject()!!.position.z = 4;

            die.updateBodyFromMesh();

            // @ts-ignore
            die.getObject()!!.body.velocity.set(
                Math.random() * 30 - 15,
                Math.random() * 30 - 15,
                0
            );

            // @ts-ignore
            die.getObject()!!.body.angularVelocity.set(
                Math.random() * 20 - 10,
                Math.random() * 20 - 10,
                Math.random() * 20 - 10
            );

            // @ts-ignore
            scene.add(die.getObject());
            diceRefs.current.push(die);

            return die;
        }

        const dieOne = roll('d20', '#d7be69', '#010328');
        const dieTwo = roll('d20', '#ffdaea', '#940949');

        DiceManager.prepareValues([
            { dice: dieOne, value: 1 },
            { dice: dieTwo, value: 20 }
        ]);
    }, [ scene ]);

    useFrame(() => {
        if (DiceManager.throwRunning) { // run simulation
            while (DiceManager.throwRunning) {
                DiceManager.world.step(1.0 / 60.0);
            }
        } else {
            DiceManager.world.step(1.0 / 60.0);
        }
        diceRef.current?.updateMeshFromBody();

        diceRefs.current.forEach(it => it.updateMeshFromBody());
    });

    return (
        <>
            <spotLight position={[ 0, 0, 30 ]} intensity={0.75} castShadow={true} ref={ref} />
            {/*{ref.current && <cameraHelper args={[ ref.current.shadow.camera ]} />}*/}
        </>
    );
}
