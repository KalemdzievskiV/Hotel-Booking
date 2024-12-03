import { User } from './user.type';
import { Hotel } from './hotel.type';

export enum NotificationType {
    PRICE_CHANGE = 'PRICE_CHANGE',
    AVAILABILITY = 'AVAILABILITY',
    PROMOTIONS = 'PROMOTIONS',
    BOOKING_REMINDER = 'BOOKING_REMINDER',
    HOTEL_NEWS = 'HOTEL_NEWS',
    MAINTENANCE = 'MAINTENANCE'
}

export enum SubscriptionStatus {
    ACTIVE = 'ACTIVE',
    EXPIRED = 'EXPIRED',
    CANCELLED = 'CANCELLED'
}

export interface Subscription {
    id?: number;
    user: User;
    hotel: Hotel;
    startDate: string;
    endDate: string;
    status: SubscriptionStatus;
    notificationType: NotificationType;
}
