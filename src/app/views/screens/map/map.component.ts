import {Component, OnInit} from '@angular/core';
import * as Leaflet from "leaflet";
import {NgxPermissionsService} from "ngx-permissions";
/** Interfaces & Types */
import {ILocationData} from "src/app/models/interfaces/map.interfaces";
/** Local Modules */
import {MapService} from "src/app/controllers/map/map.service";


@Component({
    selector: 'app-map',
    templateUrl: './map.component.html',
    styleUrls: ['./map.component.scss']
})

export class MapComponent implements OnInit {
    private map: Leaflet.Map | null = null;
    public hasPermission: boolean = false;
    public locationData: ILocationData = {latitude: 0, longitude: 0};
    public loading: boolean = false;
    public ip: string = "";
    public location: string = "";
    public timeZone: string = "";
    public isp: string = "";
    public inputValue: string = "";

    constructor(
        private mapServices: MapService,
        private permissionService: NgxPermissionsService
    ) {
    }

    ngOnInit(): void {
        this.checkPermissions();
    }

    private checkPermissions(): void {
        this.loading = true;
        const permissions = ['geolocation'];

        this.permissionService.loadPermissions(permissions);
        this.permissionService.hasPermission(permissions[0])
            .then((result: boolean) => {
                this.hasPermission = result;

                if(result) {
                    this.getCurrentLocation();
                }
            });
    }

    private getCurrentLocation(): void {
        this.mapServices.getLocation()
            .subscribe(
                (data: ILocationData) => {
                    console.log('data', data)
                    this.locationData = data;
                    this.initMap(data)
                },
                (error) => {
                    console.error(error);
                }
            )
    }

    private async initMap(data: ILocationData): Promise<void> {
        const {latitude, longitude} = data;

        await this.mapServices.getIpAddress()
            .subscribe(
                (res: any) => {
                    this.ip = res.ip;

                    this.mapServices.getAddressItems(latitude, longitude)
                        .subscribe(
                            async (response: any) => {
                                this.location = response.name;
                                this.mapServices.getTimezoneAndIPS(res.ip ?? res.query)
                                    .subscribe(
                                        (item: any) => {
                                            if(item.utc_offset) {
                                                this.timeZone = `UTC ${item.utc_offset.replace(/^-(\d{2})(\d{2})$/, "-$1:$2")}`;
                                            this.isp = item.org;
                                            }
                                        },
                                        (error: any) => console.error(error)
                                    )
                                this.loading = false;
                            },
                            (error: any) => console.error(error)
                        )

                },
                (error) => console.error('GET_IP_ADDRESS: ', error)
            );


        this.map = Leaflet.map('map').setView([data.latitude, data.longitude], 17);
        Leaflet.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
            attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors'
        }).addTo(this.map);

        /** We configure the custom marker that will be rendered on the map. */
        const iconMaker= Leaflet.icon({
            iconUrl: "/assets/images/icon-location.svg",
            iconSize: [26, 36]
        });

        /** Now we configure the marker icon on the map. */
        Leaflet.marker([data.latitude, data.longitude], {icon: iconMaker}).addTo(this.map);
    }

    public async  searchIp(): Promise<void> {
        this.loading = true;
        await this.mapServices.getLatitudeAndLongitude(this.inputValue)
            .subscribe(
                (res: any) => {
                    this.mapServices.getAddressItems(res.lat, res.lon)
                        .subscribe(
                            async (response: any) => {
                                this.location = response.name;
                                await this.mapServices.getTimezoneAndIPS(res.ip ?? res.query)
                                    .subscribe(
                                        (responseTime: any) => {
                                            this.timeZone = `UTC ${responseTime.utc_offset.replace(/^-(\d{2})(\d{2})$/, "-$1:$2")}`;
                                            this.isp = responseTime.org;
                                            this.ip = this.inputValue;

                                            if(this.map) {
                                                const iconMaker= Leaflet.icon({
                                                    iconUrl: "/assets/images/icon-location.svg",
                                                    iconSize: [26, 36]
                                                });

                                                Leaflet.marker([res.lat, res.lon], {
                                                    icon: iconMaker
                                                }).addTo(this.map);
                                                this.map?.setView([res.lat, res.lon], 18);

                                                this.loading = false;
                                            }

                                        },
                                        (error: any) => console.error('GET_TIMEZONE_AND_IPS', error),
                                    )
                            },
                            (error) => console.error('GET_ADDRESS_ITEMS: ', error)
                        );
                },
                (error) => console.error('GET_LATITUDE_LONGITUDE: ', error));
    }
}
