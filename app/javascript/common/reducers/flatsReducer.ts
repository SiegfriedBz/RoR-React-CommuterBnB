import { flatsActions } from "../actions"
import { IFlat } from "../utils/interfaces"

const flatsReducer = (state, action) => {
    switch(action.type) {
        case flatsActions.SET_ALL_FLATS:
            return { ...state, flats: action.payload }
        case flatsActions.ADD_FLAT:
            return { ...state, flats: [ ...state.flats, action.payload ] }
        case flatsActions.UPDATE_FLAT:
            const updatedFlat = action.payload
            if(state.flats.length === 0) {
                return { ...state, flats: [ updatedFlat ] }
            } else {
                const updatedFlats = state.flats.map((flat: IFlat) => {
                    return flat.flatId === updatedFlat.flatId ? updatedFlat : flat
                })
                return { ...state, flats: updatedFlats }
            }
        case flatsActions.DELETE_FLAT:
            const flatId = action.payload
            const filteredFlats = state.flats.filter((flat: IFlat) => {
                return flat.flatId !== flatId
            })
            return { ...state, flats: filteredFlats }
        default:
            return state
    }
}

export default flatsReducer
