import React from "react";

export interface IFlashMessage {
    message: string | null,
    type: "success" | "info" | "warning" | "danger"
}

export interface IAppContext {
    flashMessage: IFlashMessage,
    isLoading: boolean,
    setFlashMessage: React.Dispatch<React.SetStateAction<IFlashMessage>>,
    setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
}
