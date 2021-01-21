import { useCallback } from 'react';
import { useThree } from 'react-three-fiber';
import { DiceD10, DiceD12, DiceD20, DiceD4, DiceD6, DiceD8, DiceManager, DiceObject } from '../DiceLibrary';

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

export function useCreateDice(): (die: string, result: number) => Promise<any> {
    const { camera } = useThree();

    return useCallback((die: string, result: number) => new Promise<any>(resolve => {
        const diceObject = getDiceObject(die as any, '#2f8037', '#d7d500');

        diceObject.getObject().position.x = camera.position.x;
        diceObject.getObject().position.y = camera.position.y;
        diceObject.getObject().position.z = 4;

        diceObject.updateBodyFromMesh();

        diceObject.getObject().body.velocity.set(
            Math.random() * 20 - 10,
            Math.random() * 20 - 10,
            0
        );

        diceObject.getObject().body.angularVelocity.set(
            Math.random() * 3 + 3,
            Math.random() * 3 + 3,
            Math.random() * 3 + 3
        );

        DiceManager.prepareValues([
            { dice: diceObject, value: result }
        ]);

        while (DiceManager.throwRunning) {
            DiceManager.world.step(1.0 / 60.0);
        }

        resolve(diceObject);
    }), [ camera.position.x, camera.position.y ]);
}
