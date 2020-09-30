import { ICacheService, CacheTimeout } from './ICacheService';

export class CacheService implements ICacheService {
  private cacheKeyPrefix: string = "__CS.";
  private storage: Storage;

  constructor(storage: Storage = window.sessionStorage) {
    this.storage = storage;
  }

  private _isSupportStorage(): boolean {
    let isSupportStorage: boolean = false;
    const supportsStorage: boolean = this.storage && JSON && typeof JSON.parse === "function" && typeof JSON.stringify === "function";
    if (supportsStorage) {
        // check for dodgy behaviour from iOS Safari in private browsing mode
        try {
            const testKey: string = "cs-cache-isSupportStorage-testKey";
            this.storage[testKey] = "1";
            this.storage.removeItem(testKey);
            isSupportStorage = true;
        } catch (ex) {
            // private browsing mode in iOS Safari, or possible full cache
        }
    }
    return isSupportStorage;
  }

  public Get(key: string): Promise<any> {
    return new Promise<any>((resolve, reject) => {
      key = this._ensureCacheKeyPrefix(key);
      let returnValue: any = undefined;

      if (this._isSupportStorage()) {

          if (!this._isCacheExpired(key)) {

              returnValue = this.storage[key];

              if (typeof returnValue === "string" && (returnValue.indexOf("{") === 0 || returnValue.indexOf("[") === 0)) {
                      returnValue = JSON.parse(returnValue);
              }
          }
      }
      resolve(returnValue);
    });
  }

  public Set(key: string, valueObj: any, cacheTimeout: CacheTimeout = CacheTimeout.default): Promise<boolean> {
    return new Promise<boolean>((resolve, reject) => {
      key = this._ensureCacheKeyPrefix(key);
      let didSetInCache: boolean = false;

      if (this._isSupportStorage()) {
          // get value as a string
          let cacheValue: any = undefined;

          if (valueObj === null || valueObj === undefined) {
              cacheValue = valueObj;
          } else if (typeof valueObj === "object") {
              cacheValue = JSON.stringify(valueObj);
          } else {
              cacheValue = `${valueObj}`;
          }

          // cache value
          this.storage[key] = cacheValue;
          const validityPeriodMs: number = this._getCacheTimeout(cacheTimeout);
          // cache expiry
          this.storage[this._getExpiryKey(key)] = ((new Date()).getTime() + validityPeriodMs).toString();
          didSetInCache = true;
      }

      resolve(didSetInCache);
    });
  }

  public Clear(key: string): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      key = this._ensureCacheKeyPrefix(key);
      this.storage.removeItem(key);
      this.storage.removeItem(this._getExpiryKey(key));
      
      resolve();
    });
  }

  public ClearAll(): Promise<void> {
    return new Promise<void>((resolve, reject) => {
      this.storage.clear();

      resolve();
    });
  }

  private _getExpiryKey(key: string): string {
      return key + "_expiry";
  }

  private _isCacheExpired(key: string): boolean {
      let isCacheExpired: boolean = true;
      const cacheExpiryString: string = this.storage[this._getExpiryKey(key)];

      if (typeof cacheExpiryString === "string" && cacheExpiryString.length > 0) {
          const cacheExpiryInt: number = parseInt(cacheExpiryString, 10);

          if (cacheExpiryInt > (new Date()).getTime()) {
              isCacheExpired = false;
          }
      }

      return isCacheExpired;
  }

  private _ensureCacheKeyPrefix(key: string): string {
      let prefixedKey: string = "";
      if (!key || key.indexOf(this.cacheKeyPrefix) !== 0) {
          prefixedKey = `${this.cacheKeyPrefix}${key}`;
      } else {
          prefixedKey = key;
      }
      return prefixedKey;
  }

  private _getCacheTimeout(cacheTimeout: CacheTimeout): number {
      const oneMinute: number = 60000;
      let timeout: number;
      switch (cacheTimeout) {
          case CacheTimeout.oneSecond:
              timeout = 1000;
              break;
          case CacheTimeout.short:
              timeout = oneMinute;
              break;
          case CacheTimeout.long:
              timeout = oneMinute * 60; // 1 hour
              break;
          case CacheTimeout.verylong:
              timeout = oneMinute * 60 * 24; // 24 hours
              break;
          default:
              timeout = oneMinute * 10; // 10 minutes
              break;
      }
      return timeout;
  }
}