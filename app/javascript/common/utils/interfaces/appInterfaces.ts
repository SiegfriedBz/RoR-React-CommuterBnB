export interface IFlashMessage {
    message: string | null,
    type: "success" | "warning" | "danger"
}

export interface IAppContext {
    flashMessage: IFlashMessage,
    isLoading: boolean,
    setFlashMessage: (flashMessage: IFlashMessage) => void,
    setIsLoading: (isLoading: boolean) => void,
}
