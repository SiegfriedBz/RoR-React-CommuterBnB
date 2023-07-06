import React from "react"

export interface IUser {
    userId?: number,
    description?: string,
    email?: string,
    role?: string,
    createdAt?: string,
    image?: string
}

export interface IUserContext {
    user?: IUser,
    setUser: React.Dispatch<React.SetStateAction<IUser>>,
    tokenInStorage?: string,
    setTokenInStorage: React.Dispatch<React.SetStateAction<string>>,
}
