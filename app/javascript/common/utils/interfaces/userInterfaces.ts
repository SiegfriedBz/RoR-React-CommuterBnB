import React from 'react';

export interface IUser {
    email: string,
    // role: string,
    token: string
}

export interface IUserContext extends IUser {
    setUser: React.Dispatch<React.SetStateAction<IUser>>,
    setTokenInStorage: React.Dispatch<React.SetStateAction<string>>
}
