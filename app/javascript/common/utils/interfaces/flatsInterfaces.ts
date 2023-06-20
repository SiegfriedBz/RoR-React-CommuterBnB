import { IUser } from "./userInterfaces"
// FlatCategory types to handle client & server sides
export type FlatCategoryType = "entire place" | "private room" | "entire_place" | "private_room";

export interface IFlat {
    flatId: number,
    owner: IUser,
    pricePerNightInCents: number,
    title: string
    description: string,
    address: string,
    longitude: number,
    latitude: number,
    available: boolean,
    category: FlatCategoryType,
    images: string[] | []
}

export interface IFlatsContext {
    flats: IFlat[],
    setFlatsInContext: (flats: IFlat[]) => void,
    addFlatInContext: (flat: IFlat) => void,
    updateFlatInContext: (flat: IFlat) => void,
    deleteFlatInContext: (flatId: number) => void
}
