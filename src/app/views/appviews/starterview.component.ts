import { Component, OnInit, ViewChild } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { HttpClient } from '@angular/common/http';
import { Country } from '../../models/country';
import { environment } from '../../../environments/environment';
import { Subject } from 'rxjs';
import { MatPaginator, MatTableDataSource } from '@angular/material';

// import 'rxjs/add/operator/map';


@Component({
  selector: 'app-starter',
  templateUrl: 'starter.template.html'
})
export class StarterViewComponent implements OnInit {
  uploader: FileUploader;
  url: string;
  country: Country;
  countries: Country[];
  urlLoad: string;
  filePath: string;
  dtOptions: DataTables.Settings = {};
  dtTrigger: Subject<object> = new Subject();

  Name: string;
  Name2: string;
  Nationality: string;
  ST_CUR_COD: string;
  Refernce_No: string;
  Loc_Status: number;
  Phone_Code: number;


  displayedColumns: string[] = ['position', 'name', 'weight', 'symbol'];
  dataSource = new MatTableDataSource<PeriodicElement>(ELEMENT_DATA);

  extraForm: string;

  @ViewChild(MatPaginator) paginator: MatPaginator;


  constructor(private http: HttpClient) { }

  ngOnInit() {

    this.dataSource.paginator = this.paginator;

    this.country = new Country();
    this.country.Name = 'test';
    this.countries = [this.country];

    // { Name: 'test', Name2: 'Hydrogen', Nationality: 'Nationality' }];

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10
    };


    this.url = environment.url + 'core';

    this.uploader = new FileUploader({
      url: this.url + '/AddCountryFlag',
      isHTML5: true,
      allowedFileType: ['image'],
      method: 'POST',
      autoUpload: false
    });

    // this.countries = [];
    this.loadCountries();
  }

  showCityForm($event) {
    this.extraForm = $event.index === 1 ? 'city' : ($event.index === 2 ? 'area' : '');
  }
  applyFilter(filterValue: string) {
    this.dataSource.filter = filterValue.trim().toLowerCase();
  }
  loadCountries() {
    this.http.get<Country[]>(this.url + '/LoadCountries').subscribe(res => {
      this.countries = res;
      this.dtTrigger.next();

    });
  }


  UploadFlag() {
    this.uploader.uploadAll();
    this.uploader.onSuccessItem = (item, response, status, headers) => {
      if (response) {
        this.filePath = response;
        this.country.Flag = response;
        this.AddCountry(this.country);
      }
    };
  }

  save(form) {
    if (form.invalid) {
      return;
    }
    this.country = Object.assign({}, form.value);
    this.country.Loc_Status = Number(this.country.Loc_Status);
    if (this.uploader.queue.length > 0) {
      this.UploadFlag();
    } else {
      this.AddCountry(this.country);
    }
  }

  AddCountry(country: Country) {
    this.http.post(this.url + '/InsertCountry', this.country).subscribe(res => {
      alert(res);
      this.loadCountries();
    });
  }



  deleteCountry(id) {
    this.http
      .delete(this.url + '/DeleteCountry?countryId=' + id)
      .subscribe(res => {
        alert(res);
        this.loadCountries();
      });
  }

  updateCountry(form, country: Country) {
    this.Name = country.Name;
    this.Name2 = country.Name2;
    this.Nationality = country.Nationality;
    this.ST_CUR_COD = country.ST_CUR_COD;
    this.Refernce_No = country.Refernce_No;
    this.Loc_Status = country.Loc_Status;
    this.Phone_Code = country.Phone_Code;

    // this.http.post(this.url + '/UpdateCountry', country).subscribe(res => {
    //   alert(res);
    //   this.loadCountries();
    // });
  }
}
export interface PeriodicElement {
  name: string;
  position: number;
  weight: number;
  symbol: string;
}

const ELEMENT_DATA: PeriodicElement[] = [
  { position: 1, name: 'Hydrogen', weight: 1.0079, symbol: 'H' },
  { position: 2, name: 'Helium', weight: 4.0026, symbol: 'He' },
  { position: 3, name: 'Lithium', weight: 6.941, symbol: 'Li' },
  { position: 4, name: 'Beryllium', weight: 9.0122, symbol: 'Be' },
  { position: 5, name: 'Boron', weight: 10.811, symbol: 'B' },
  { position: 6, name: 'Carbon', weight: 12.0107, symbol: 'C' },
  { position: 7, name: 'Nitrogen', weight: 14.0067, symbol: 'N' },
  { position: 8, name: 'Oxygen', weight: 15.9994, symbol: 'O' },
  { position: 9, name: 'Fluorine', weight: 18.9984, symbol: 'F' },
  { position: 10, name: 'Neon', weight: 20.1797, symbol: 'Ne' },
  { position: 11, name: 'Sodium', weight: 22.9897, symbol: 'Na' },
  { position: 12, name: 'Magnesium', weight: 24.305, symbol: 'Mg' },
  { position: 13, name: 'Aluminum', weight: 26.9815, symbol: 'Al' },
  { position: 14, name: 'Silicon', weight: 28.0855, symbol: 'Si' },
  { position: 15, name: 'Phosphorus', weight: 30.9738, symbol: 'P' },
  { position: 16, name: 'Sulfur', weight: 32.065, symbol: 'S' },
  { position: 17, name: 'Chlorine', weight: 35.453, symbol: 'Cl' },
  { position: 18, name: 'Argon', weight: 39.948, symbol: 'Ar' },
  { position: 19, name: 'Potassium', weight: 39.0983, symbol: 'K' },
  { position: 20, name: 'Calcium', weight: 40.078, symbol: 'Ca' },
];
