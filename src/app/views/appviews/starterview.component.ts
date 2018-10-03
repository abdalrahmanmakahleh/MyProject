import { LockUp } from './../../models/LockUp';
import { CoreService } from './../../_services/CoreServices.service';
import { Component, OnInit, ViewChild } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { HttpClient } from '@angular/common/http';
import { Country } from '../../models/country';
import { City } from '../../models/City';
import { Area } from '../../models/Area';
import { environment } from '../../../environments/environment';
import { Subject } from 'rxjs';
import { MatPaginator, MatTableDataSource } from '@angular/material';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-starter',
  templateUrl: 'starter.template.html'
})

export class StarterViewComponent implements OnInit {
  url: string = environment.azureUrl + 'core';

  countryForm: Country;
  countries: Country[];
  cityForm: City;
  cities: City[];
  areaForm: Area;
  areas: Area[];
  LockUps: LockUp[];

  cityTableColumns: string[] = ['ID', 'Name', 'Name2', 'Country', 'actions'];
  citiesDataSource = new MatTableDataSource<City>();

  areaTableColumns: string[] = ['ID', 'Name', 'Name2', 'Country', 'City', 'actions'];
  areasDataSource = new MatTableDataSource<Area>();

  urlLoad: string;
  uploader: FileUploader;
  filePath: string;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<object> = new Subject();
  extraForm: string;

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(private http: HttpClient, private route: ActivatedRoute, private coreService: CoreService) { }

  ngOnInit() {

    this.countryForm = new Country();
    this.cityForm = new City();
    this.areaForm = new Area();

    this.route.data.subscribe(data => {
      this.countries = data.country;
      this.LockUps = data.lockUp;
    });

    this.citiesDataSource.paginator = this.paginator;
    this.areasDataSource.paginator = this.paginator;

    this.citiesDataSource = new MatTableDataSource<City>(this.cities);
    this.areasDataSource = new MatTableDataSource<Area>(this.areas);



    this.cityForm.Name = 'Amman';
    this.cities = [this.cityForm];

    this.areaForm.Name = 'Gardens';
    this.areas = [this.areaForm];

    this.uploader = new FileUploader({
      url: this.url + '/AddCountryFlag',
      isHTML5: true,
      allowedFileType: ['image'],
      method: 'POST',
      autoUpload: false
    });

    this.coreService.loadCountries();

    this.coreService.loadCities().subscribe(data => {
      this.cities = data;
    });
    this.coreService.loadAreas().subscribe(data => {
      this.areas = data;
    });

  }


  showCityAreaForm($event) {
    this.extraForm = $event.index === 1 ? 'city' : ($event.index === 2 ? 'area' : '');
  }

  filtercities(filterValue: string) {
    this.citiesDataSource.filter = filterValue.trim().toLowerCase();
  }

  filterAreas(filterValue: string) {
    this.areasDataSource.filter = filterValue.trim().toLowerCase();
  }


  UploadFlag() {
    this.uploader.uploadAll();
    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response) {
        this.filePath = response;
        this.countryForm.Flag = response;
        this.http.post(this.url + '/InsertCountry', this.countryForm).subscribe(res => {
          this.coreService.loadCountries();
        });
      }
    };
  }



  // add update delete country

  saveCountry(form) {
    if (form.invalid) {
      return;
    }
    this.countryForm = Object.assign({}, form.value);
    this.countryForm.Loc_Status = Number(this.countryForm.Loc_Status);
    if (this.uploader.queue.length > 0) {
      this.UploadFlag();
    } else {
      this.http.post(this.url + '/InsertCountry', this.countryForm).subscribe(res => {
        this.coreService.loadCountries();
      });
    }
  }

  deleteCountry(id) {
    this.http.delete(this.url + '/DeleteCountry?countryId=' + id).subscribe(res => {
      this.coreService.loadCountries();
    });
  }

  updateCountry(country: Country) {
    this.countryForm.Name = country.Name;
    this.countryForm.Name2 = country.Name2;
    this.countryForm.Nationality = country.Nationality;
    this.countryForm.ST_CUR_COD = country.ST_CUR_COD;
    this.countryForm.Refernce_No = country.Refernce_No;
    this.countryForm.Loc_Status = country.Loc_Status;
    this.countryForm.Phone_Code = country.Phone_Code;

    // this.http.post(this.url + '/UpdateCountry', country).subscribe(res => {
    //   alert(res);
    //   this.loadCountries();
    // });
  }


  // add update delete city

  saveCity(form) {
    if (form.invalid) { return; }
    this.cityForm = Object.assign({}, form.value);
    this.cityForm.Loc_Status = Number(this.cityForm.Loc_Status);
    this.http.post(this.url + '/InsertCity', this.cityForm).subscribe(res => {
      this.coreService.loadCities().subscribe(data => {
        this.cities = data;
      });
    });

  }

  deleteCity(id) {
    this.http.delete(this.url + '/DeleteCity?cityId=' + id).subscribe(res => {
      this.coreService.loadCountries();
    });
  }

  updateCity(city: City) {
    this.cityForm.Name = city.Name;
    this.cityForm.Name2 = city.Name2;

    this.cityForm.Refernce_No = city.Refernce_No;
    this.cityForm.Loc_Status = city.Loc_Status;

    // this.http.post(this.url + '/UpdateCountry', country).subscribe(res => {
    //   alert(res);
    //   this.loadCountries();
    // });
  }




  // add update delete Area

  saveArea(form) {
    if (form.invalid) { return; }
    this.areaForm = Object.assign({}, form.value);
    this.areaForm.Loc_Status = Number(this.areaForm.Loc_Status);
    this.http.post(this.url + '/InsertArea', this.areaForm).subscribe(res => {
      this.coreService.loadAreas();
    });
  }

  deleteArea(id) {
    this.http.delete(this.url + '/DeleteArea?areaId=' + id).subscribe(res => {
      this.coreService.loadAreas();
    });
  }

  updateArea(area: Area) {
    this.areaForm.Name = area.Name;
    this.areaForm.Name2 = area.Name2;
    this.areaForm.City = area.City;
    this.areaForm.Country = area.Country;
    this.areaForm.Refernce_No = area.Refernce_No;
    this.areaForm.Loc_Status = area.Loc_Status;

    // this.http.post(this.url + '/UpdateCountry', country).subscribe(res => {
    //   alert(res);
    //   this.loadCountries();
    // });
  }


}

