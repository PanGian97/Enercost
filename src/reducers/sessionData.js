import { USER_SESSION } from "../actions/types"

let initialState = {}

const sessionDataReducer = (state = initialState, action) => {
    const { type, payload } = action;

    switch (type) {
        case USER_SESSION:
            return payload
        default:
            return state;
    }
};

export default sessionDataReducer;