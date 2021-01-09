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

        let wallTop = new CANNON.Body({ mass: 0, shape: new CANNON.Plane(), material: DiceManager.barrierBodyMaterial, position: new Vec3(0, 5, 0) });
        wallTop.quaternion.setFromAxisAngle(new Vec3(1, 0, 0), Math.PI / 2);

        let wallLeft = new CANNON.Body({ mass: 0, shape: new CANNON.Plane(), material: DiceManager.barrierBodyMaterial, position: new Vec3(-5, 0, 0) });
        wallLeft.quaternion.setFromAxisAngle(new Vec3(0, 1, 0), Math.PI / 2);

        let wallRight = new CANNON.Body({ mass: 0, shape: new CANNON.Plane(), material: DiceManager.barrierBodyMaterial, position: new Vec3(5, 0, 0) });
        wallRight.quaternion.setFromAxisAngle(new Vec3(0, -1, 0), Math.PI / 2);

        let wallBottom = new CANNON.Body({ mass: 0, shape: new CANNON.Plane(), material: DiceManager.barrierBodyMaterial, position: new Vec3(0, -5, 0) });
        wallBottom.quaternion.setFromAxisAngle(new Vec3(-1, 0, 0), Math.PI / 2);

        world.addBody(wallTop);
        world.addBody(wallLeft);
        world.addBody(wallRight);
        world.addBody(wallBottom);

        DiceManager.setWorld(world);
        DiceManager.world.gravity.set(0, 0, -9.82);
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
            die.getObject()!!.position.z = Math.random() * 2 + 2;

            die.updateBodyFromMesh();

            // @ts-ignore
            die.getObject()!!.body.velocity.set(
                Math.random() * 8 - 4,
                Math.random() * 8 - 4,
                Math.random()
            );

            // @ts-ignore
            die.getObject()!!.body.angularVelocity.set(
                Math.random() * 8 - 4,
                Math.random() * 8 - 4,
                Math.random() * 8
            );


            // @ts-ignore
            scene.add(die.getObject());
            diceRefs.current.push(die);

            return die;
        }

        const dieOne = roll('d6', '#332503', '#fcB711');
        const dieTwo = roll('d6', '#331807', '#f37021');
        const dieThree = roll('d6', '#330013', '#cc004c');
        const dieFour = roll('d6', '#1e1d33', '#6460aa');
        const dieFive = roll('d6', '#002233', '#0089d0');
        const dieSix = roll('d6', '#043316', '#0db14b');

        DiceManager.prepareValues([
            { dice: dieOne, value: 1 },
            { dice: dieTwo, value: 2 },
            { dice: dieThree, value: 3 },
            { dice: dieFour, value: 4 },
            { dice: dieFive, value: 5 },
            { dice: dieSix, value: 6 }
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
            <spotLight position={[ 0, 0, 25 ]} intensity={0.75} castShadow={true} ref={ref} />
            {/*{ref.current && <cameraHelper args={[ ref.current.shadow.camera ]} />}*/}
        </>
    );
}
