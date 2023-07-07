class CustomError extends Error {
    status: any
    constructor(message, status) {
        super(message)
        this.status = status
    }
}