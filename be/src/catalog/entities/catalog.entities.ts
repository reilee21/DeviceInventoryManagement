import { Entity, Column, PrimaryGeneratedColumn } from 'typeorm';

@Entity('brands')
export class Brand {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100, unique: true })
    name: string;
}

@Entity('categories')
export class Category {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100, unique: true })
    name: string;
}

export enum ConditionEnum {
    LIKE_NEW = 1,
    GOOD = 2,
    FAIR = 3
}

export const CONDITION_LABELS = {
    [ConditionEnum.LIKE_NEW]: 'Like New',
    [ConditionEnum.GOOD]: 'Good',
    [ConditionEnum.FAIR]: 'Fair'
};

export enum ItemStatusEnum {
    IN_STOCK = 1,
    LIQUIDATED = 2,
    WARRANTY_RETURN = 3,
    ARCHIVED = 4
}

export const ITEM_STATUS_LABELS = {
    [ItemStatusEnum.IN_STOCK]: 'InStock',
    [ItemStatusEnum.LIQUIDATED]: 'Liquidated',
    [ItemStatusEnum.WARRANTY_RETURN]: 'WarrantyReturn',
    [ItemStatusEnum.ARCHIVED]: 'Archived'
};

export enum PurchaseStatusEnum {
    OPEN = 1,
    POSTED = 2,
    CANCELLED = 3
}

export const PURCHASE_STATUS_LABELS = {
    [PurchaseStatusEnum.OPEN]: 'Open',
    [PurchaseStatusEnum.POSTED]: 'Posted',
    [PurchaseStatusEnum.CANCELLED]: 'Cancelled'
};

export enum SourceTypeEnum {
    CUSTOMER = 1,
    DEALER = 2,
    TRADE_IN = 3
}

export const SOURCE_TYPE_LABELS = {
    [SourceTypeEnum.CUSTOMER]: 'Customer',
    [SourceTypeEnum.DEALER]: 'Dealer',
    [SourceTypeEnum.TRADE_IN]: 'TradeIn'
};

@Entity('locations')
export class Location {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ length: 100, unique: true })
    name: string;
}
