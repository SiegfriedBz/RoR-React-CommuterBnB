import React from 'react';

export interface IUser {
    userId?: number,
    description?: string,
    email?: string,
    role?: string,
    createdAt?: string,
    image?: string
}

export interface IUserContext extends IUser {
    setUser: React.Dispatch<React.SetStateAction<IUser>>,
    setTokenInStorage: React.Dispatch<React.SetStateAction<string>>
}
