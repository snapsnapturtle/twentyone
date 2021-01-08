import CANNON, { Vec3, World } from 'cannon';
import React, { useEffect, useRef } from 'react';
import { useFrame, useResource, useThree } from 'react-three-fiber';
import { PointLight } from 'three';
import { DiceD20, DiceD6, DiceManager } from './Dice2';

export function DiceSix() {
    const { scene } = useThree();
    const ref = useResource<PointLight>();
    const worldRef = useRef<World>();
    const diceRef = useRef<DiceD20>();

    useEffect(() => {
        const world = new World();

        let floorBody = new CANNON.Body({ mass: 0, shape: new CANNON.Plane(), material: DiceManager.floorBodyMaterial, position: new Vec3(0, 0, -1) });
        world.addBody(floorBody);

        worldRef.current = world;

        DiceManager.setWorld(world);
        DiceManager.world.gravity.set(0, 0, -9.82);
        DiceManager.world.broadphase = new CANNON.NaiveBroadphase();
        DiceManager.world.solver.iterations = 16;

        const dice = new DiceD20({
            size: 0.5,
            fontColor: '#ffffff',
            backColor: '#094e3e'
        });

        diceRef.current = dice;

        // @ts-ignore
        scene.add(dice.getObject());

        let yRand = Math.random() * 20
        dice.getObject()!!.position.x = -2;
        dice.getObject()!!.position.y = -2;
        // dice.getObject()!!.position.z = -15 + (1 % 3) * 1.5;
        dice.getObject()!!.quaternion.x = (Math.random() * 90 - 45) * Math.PI / 180;
        dice.getObject()!!.quaternion.z = (Math.random() * 90 - 45) * Math.PI / 180;

        dice.updateBodyFromMesh();

        let rand = Math.random() * 5;
        // @ts-ignore
        dice.getObject()!!.body.velocity.set(25 + rand, 40 + yRand, 15 + rand);
        // @ts-ignore
        dice.getObject()!!.body.angularVelocity.set(20 * Math.random() - 10, 20 * Math.random() - 10, 20 * Math.random() - 10);


        // @ts-ignore
        dice.getObject()!!.body.velocity.set(2, 3, 1);
        // @ts-ignore
        dice.getObject()!!.body.angularVelocity.set(3, 0, 4);


        DiceManager.prepareValues([ { dice, value: 20 } ]);
    }, [ scene ]);

    useFrame(() => {
        if (worldRef.current) {
            worldRef.current.step(1.0 / 60.0);
            diceRef.current?.updateMeshFromBody();
        }
    });

    return (
        <>
            <spotLight position={[ 0, 0, 10 ]} intensity={1} castShadow={true} ref={ref} />
            {/*{ref.current && <cameraHelper args={[ ref.current.shadow.camera ]} />}*/}
        </>
    );
}
