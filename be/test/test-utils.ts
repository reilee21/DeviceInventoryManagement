import { Repository, ObjectLiteral } from 'typeorm';

export type MockRepository<T extends ObjectLiteral = any> = {
    [P in keyof Repository<T>]: jest.Mock;
};

export const mockRepository = (): MockRepository => ({
    find: jest.fn(),
    findOne: jest.fn(),
    create: jest.fn(),
    save: jest.fn(),
    update: jest.fn(),
    delete: jest.fn(),
    remove: jest.fn(),
    count: jest.fn(),
    query: jest.fn(),
    findOneBy: jest.fn(),
    findAndCount: jest.fn(),
} as any);
