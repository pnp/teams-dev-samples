import { INorthwindService } from './NorthwindService/INorthwindService';
import { NorthwindServiceMock } from './NorthwindService/NorthwindServiceMock';
import { NorthwindService } from './NorthwindService/NorthwindService';

import { IMapService } from './MapService/IMapService';
import { MapServiceMock } from './MapService/MapServiceMock';
import { MapService } from './MapService/MapService';

export class ServiceFactory {

    public static getNorthwindService(): INorthwindService {

        if (process.env["ENVIRONMENT"] === "mock") {
            return new NorthwindServiceMock();
        } else {
            return new NorthwindService();
        }
    }

    public static getMapService(): IMapService {
        if (process.env["ENVIRONMENT"] === "mock") {
            return new MapServiceMock();
        } else {
            return new MapService();
        }
    }

}