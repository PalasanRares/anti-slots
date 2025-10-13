export function numbericEnumValues<T extends object>(enumClass: T) {
    return Object.values(enumClass).filter(
        (value) => typeof value === "number"
    );
}

export function numericEnumSize<T extends object>(enumClass: T) {
    return Object.keys(enumClass).length / 2;
}

export function alphabeticEnumValues<T extends object>(enumClass: T) {
    return Object.values(enumClass).filter((value) => isNaN(Number(value)));
}
