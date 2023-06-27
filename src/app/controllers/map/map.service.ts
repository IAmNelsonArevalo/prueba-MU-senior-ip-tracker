import {Injectable} from '@angular/core';
import {Observable, Subscription} from "rxjs";
import {HttpClient} from "@angular/common/http";
/** Interfaces & Types */
import type {ILocationData} from "src/app/models/interfaces/map.interfaces";

@Injectable({
    providedIn: 'root'
})
export class MapService {
    public latitude: number = 0;
    public longitude: number = 0;
    constructor(
        private http: HttpClient
    ) {
    }

    public getLocation(): Observable<ILocationData> {
        return new Observable((observer) => {
            navigator.geolocation.getCurrentPosition(
                (position: GeolocationPosition) => {
                    const locationData: ILocationData = {
                        latitude: position.coords.latitude,
                        longitude: position.coords.longitude
                    };

                    observer.next(locationData);
                    observer.complete();
                },
                (error: GeolocationPositionError) => {
                    observer.error(error);
                }
            );
        })
    }

    public getIpAddress(): Observable<Object> {
        return this.http.get(`https://api.seeip.org/jsonip`)
    }

    public getAddressItems(latitude: number, longitude: number): Observable<Object> {
        return this.http.get(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}`);
    }

    public getTimezoneAndIPS(ip: string): any {
        return this.http.get(`https://ipapi.co/${ip}/json/`)
    }
    public getLatitudeAndLongitude(ip: string): Observable<any> {
        return this.http.get(`http://ip-api.com/json/${ip}`, {
            headers: {
                "Access-Control-Allow-Origin": "*"
            }
        })
    }
}
