export interface IFlat {
    flatId: number,
    ownerId: number,
    pricePerNightInCents: number,
    title: string
    description: string,
    address: string,
    longitude: number,
    latitude: number,
    available: boolean,
    category: string,
    images: string[] | []
}

export interface IFlatsContext {
    flats: IFlat[],
    setFlatsInContext: (flats: IFlat[]) => void,
    addFlatInContext: (flat: IFlat) => void,
    updateFlatInContext: (flat: IFlat) => void
}
