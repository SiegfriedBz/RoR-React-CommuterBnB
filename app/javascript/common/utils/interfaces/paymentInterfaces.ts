import { IUser } from './userInterfaces'
export type PaymentStatus = 'pending' | 'initiated' | 'completed' | 'failed'

export interface IPayment {
    paymentId: number,
    transactionRequestId: number,
    payer: IUser,
    payee: IUser,
    amountInCents: number,
    status: PaymentStatus,
    createdAt: string
}
