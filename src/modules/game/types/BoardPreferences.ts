export enum GridType {
    NONE = 'NONE',
    SQUARE = 'SQUARE',
    HEX = 'HEX'
}

export interface BoardPreferences {
    width: number;
    height: number;
    grid: {
        type: GridType;
        lineColor: string;
    },
}
