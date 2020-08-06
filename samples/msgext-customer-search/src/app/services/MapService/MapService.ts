import { IMapService } from './IMapService';
import { IMapLocation } from '../../model/IMapLocation';

export class MapService implements IMapService {

    public async getLocation(address: string, city: string, state: string, zip: string):
        Promise<IMapLocation | null> {

        let result: IMapLocation | null = null;

        // Remove "." and trim address to make Bing maps happy
        const adjustedAddress = address.replace('.', ' ').trim();

        const response = await fetch(`https://dev.virtualearth.net/REST/v1/Locations/US/${state}/${zip}/${city}/${adjustedAddress}?key=${process.env["BING_MAPS_KEY"]}`,
            {
                method: 'GET',
                headers: { "accept": "application/json" },
            });

        if (response.ok) {
            const responseJson = await response.json();
            result = responseJson;
        } else {
            throw (`Error ${response.status}: ${response.statusText}`);
        }

        return result;
    }

    public getMapApiKey(): string {
        return process.env["BING_MAPS_KEY"] || "";
    }

    public async getMapImageUrl(address: string, city: string, state: string,
        country: string, postalCode: string): Promise<string> {

        let result = "#";

        if (country &&
            country.toLowerCase() == "usa" &&
            postalCode) {

            // If here we have no location cached; call the web service
            let location = await this.getLocation(address, city, state, postalCode);
            result = this.getMapImageUrlFromLocation(location);
        }

        return result;
    }

    private getMapImageUrlFromLocation(location: IMapLocation | null) {

        if (location) {
            const coordinates =
                location.resourceSets[0].resources[0].point.coordinates;
            const latitude = coordinates[0];
            const longitude = coordinates[1];

            const apiKey = this.getMapApiKey();

            return `https://dev.virtualearth.net/REST/v1/Imagery/Map/Road/${latitude},${longitude}/16?mapSize=400,200&pp=${latitude},${longitude}&key=${apiKey}`;

        } else {
            return "#";
        }
    }

}