export enum SaleStatus {
    DRAFT = 1,
    POSTED = 2,
    COMPLETED = 3,
    CANCELLED = 4,
}

export const SALE_STATUS_LABELS = {
    [SaleStatus.DRAFT]: 'Draft',
    [SaleStatus.POSTED]: 'Posted',
    [SaleStatus.COMPLETED]: 'Completed',
    [SaleStatus.CANCELLED]: 'Cancelled',
};

export enum PaymentStatus {
    UNPAID = 1,
    PARTIAL = 2,
    PAID = 3,
}

export const PAYMENT_STATUS_LABELS = {
    [PaymentStatus.UNPAID]: 'Unpaid',
    [PaymentStatus.PARTIAL]: 'Partial',
    [PaymentStatus.PAID]: 'Paid',
};

export enum PaymentMethod {
    CASH = 1,
    BANK_TRANSFER = 2,
    CREDIT_CARD = 3,
}

export const PAYMENT_METHOD_LABELS = {
    [PaymentMethod.CASH]: 'Cash',
    [PaymentMethod.BANK_TRANSFER]: 'Bank',
    [PaymentMethod.CREDIT_CARD]: 'Card',
};
