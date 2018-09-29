import { Component, OnInit } from '@angular/core';
import { FileUploader } from 'ng2-file-upload';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Country } from '../../models/country';
import { environment } from '../../../environments/environment';

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
  constructor(private http: HttpClient) {}

  ngOnInit() {
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

  loadCountries() {
    this.http.get<Country[]>(this.url + '/LoadCountries').subscribe(res => {
      this.countries = res;
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

  updateCountry(country: Country) {
    this.http.post(this.url + '/UpdateCountry', country).subscribe(res => {
      alert(res);
      this.loadCountries();
    });
  }
}
