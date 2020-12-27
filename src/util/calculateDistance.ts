export function calculateDistance(pointA: [ x: number, y: number ], pointB: [ x: number, y: number ]): number {
    const dx = Math.abs(pointA[ 0 ] - pointB[ 0 ]);
    const dy = Math.abs(pointA[ 1 ] - pointB[ 1 ]);

    return Math.max(dx, dy);
}
