import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { HttpClient } from '@angular/common/http';
import { Country } from '../../models/country';
import { environment } from '../../../environments/environment';
import { Subject } from 'rxjs';
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

  constructor(private http: HttpClient) { }

  ngOnInit() {

    this.dtOptions = {
      pagingType: 'full_numbers',
      pageLength: 10
    };

    this.country = new Country();

    this.url = environment.url + 'core';

    this.uploader = new FileUploader({
      url: this.url + '/AddCountryFlag',
      isHTML5: true,
      allowedFileType: ['image'],
      method: 'POST',
      autoUpload: false
    });

    this.countries = [];
    this.loadCountries();
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
