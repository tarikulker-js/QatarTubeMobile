const initialState = [];

export const videogIdReducer = (state = initialState, action) => {
    if(action.type == "setVideoId"){
        return action.payload;
    }
    
    return state;
}

export const playlistIdReducer = (state = initialState, action) => {
    if(action.type == "setPlaylistId"){
        return action.payload;
    }
    
    return state;
}

export const userIdReducer = (state = initialState, action) => {
    if(action.type == "setUserId"){
        return action.payload;
    }
    
    return state;
}

export const darkThemeReducer = (state = true, action) => {
    if(action.type == "setTheme"){
        return action.payload;
    }
    
    return state;
}
