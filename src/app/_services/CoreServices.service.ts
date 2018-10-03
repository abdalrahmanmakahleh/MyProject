import { Country } from './../models/country';
import { Observable } from 'rxjs';
import { Currency } from './../models/Currency';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { City } from '../models/City';
import { Area } from '../models/Area';
import { LockUp } from '../models/LockUp';
@Injectable({
  providedIn: 'root'
})
export class CoreService {
  url: string = environment.azureUrl + 'core';
  countries: Country[];
  cityForm: City;
  cities: City[];
  areaForm: Area;
  areas: Area[];
  Currencies: Currency[];
  lockUps: LockUp[];
  constructor(private http: HttpClient) { }



  loadCountries(): Observable<Country[]> {
    return this.http.get<Country[]>(this.url + '/LoadCountries');
  }

  loadCities(cityId: number = null, countryId: number = null, langId: number = null): Observable<City[]> {
    return this.http.get<City[]>(this.url + '/LoadCities?cityId=' + cityId + '&countryId=' + countryId + '&langId=' + langId);
  }

  loadAreas(areaId: number = null, cityId: number = null, countryId: number = null, langId: number = null): Observable<Area[]> {
    // tslint:disable-next-line:max-line-length
    return this.http.get<Area[]>(this.url + '/LoadArea?areaId=' + areaId + '&cityId=' + cityId + '&countryId=' + countryId + '&langId=' + langId);
  }

  loadCurrencies(): Observable<Currency[]> {
    return this.http.get<Currency[]>(this.url + '/LoadCurrencies');
  }

  LoadLockUpsByMajorCode(majorCode: number = 1): Observable<LockUp[]> {
    return this.http.get<LockUp[]>(this.url + '/LoadLockUpsByMajorCode?ID=' + majorCode);
  }


}