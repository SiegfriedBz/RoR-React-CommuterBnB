import { IUser } from "./userInterfaces"
import { IBookingRequest } from "./bookingRequestInterfaces"

export interface IReview {
    id: number;
    reviewer: IUser;
    flatId: number;
    transactionRequest: IBookingRequest;
    content: string;
    rating: number;
    createdAt: string;
}
