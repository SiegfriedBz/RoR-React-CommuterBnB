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
            const updatedFlats = state.flats.map((flat: IFlat) => {
                return flat.flatId === updatedFlat.flatId ? updatedFlat : flat
            })
            return { ...state, flats: updatedFlats }
        default:
            return state
    }
}

export default flatsReducer
