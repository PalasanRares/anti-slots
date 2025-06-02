export function numbericEnumValues<T extends object>(enumClass: T) {
    return Object.values(enumClass).filter(value =>
        typeof value === "number"
    )
}

export function alphabeticEnumValues<T extends object>(enumClass: T) {
    return Object.values(enumClass).filter(value => 
        isNaN(Number(value))
    )
}
