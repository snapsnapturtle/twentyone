export function useDisplayDistance() {
    return (rawDistance: number) => {
        return `${rawDistance * 5}&nbsp;ft\n${rawDistance}&nbsp;sq`
    }
}
