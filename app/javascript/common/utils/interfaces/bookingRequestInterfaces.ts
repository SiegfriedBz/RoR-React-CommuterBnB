export type BookingRequestStatusType = 'pending' | 'rejected' | 'completed'

export interface IBookingRequest {
    transactionRequestId: number,
    updatedAt: string,
    startingDate: string,
    endingDate: string,
    exchangePricePerNightInCents: number,
    responderAgreed: boolean,
    initiatorAgreed: boolean,
    responderId: number,
    initiatorId: number,
    responderFlatId: number,
    initiatorFlatId?: number,
    status: BookingRequestStatusType,
}
