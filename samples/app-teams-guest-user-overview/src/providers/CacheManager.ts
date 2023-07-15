import { PnPClientStorage } from '@pnp/core/storage'


export interface ICacheManager {
    BlockUser(UserId: string): void;
    UnBlockUser(UserId: string): void;
    DeleteUser(UserId: string): void;
    GetUserState(UserId: string): CacheAction;
}

export enum CacheAction {
    BlockUser = "BlockUser",
    UnblockUser = "UnblockUser",
    DeleteUser = "DeleteUser",
}

const CachePrefix = "GuestUserOverview_";

const MinutesFromNow = (min: number) => {
    return new Date(new Date().getTime() + 2 * 60000);
}

export class CacheManager implements ICacheManager {
    private storage: PnPClientStorage;

    constructor(storage: PnPClientStorage) {
        this.storage = storage;
    }

    public BlockUser(UserId: string): void {
        this.storage.session.put(CachePrefix + UserId, CacheAction.BlockUser, MinutesFromNow(2));
        setTimeout(() => {
            this.storage.session.deleteExpired();
        }, 1000 * 60 * 2.1);
    }

    public UnBlockUser(UserId: string): void {
        this.storage.session.put(CachePrefix + UserId, CacheAction.UnblockUser, MinutesFromNow(2));
        setTimeout(() => {
            this.storage.session.deleteExpired();
        }, 1000 * 60 * 2.1);
    }

    public DeleteUser(UserId: string): void {
        this.storage.session.put(CachePrefix + UserId, CacheAction.DeleteUser, MinutesFromNow(2));
        setTimeout(() => {
            this.storage.session.deleteExpired();
        }, 1000 * 60 * 2.1);
    }

    public GetUserState(UserId: string): CacheAction {
        return this.storage.session.get(CachePrefix + UserId);
    }

}