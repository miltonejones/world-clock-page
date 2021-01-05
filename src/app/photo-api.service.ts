import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, } from 'rxjs';
import { NEWS_API_KEY, PHOTO_API_KEY } from './app.constants';
import * as tokyoData from './json/tokyo.json';
import * as icelandData from './photos.json';
import * as berlinData from './json/berlin.json';
import * as hollandData from './json/amsterdam.json';
import * as norwayData from './json/norway.json';
import * as newsData from './news.json';
import { map, catchError } from 'rxjs/operators';

enum PhotoType {
  NORWAY = "norway",
  ICELAND = "iceland",
  TOKYO = "tokyo",
  BERLIN = "berlin",
  HOLLAND = "amsterdam",
}

const COOKIE_NAME = 'pixel_photos';
@Injectable()
export class PhotoApiService {

  photoTypes = [
    { key: PhotoType.NORWAY, data: norwayData },
    { key: PhotoType.TOKYO, data: tokyoData },
    { key: PhotoType.ICELAND, data: icelandData },
    { key: PhotoType.BERLIN, data: berlinData },
    { key: PhotoType.HOLLAND, data: hollandData }
  ];
  photoType: any = {};
  constructor(private http: HttpClient) {
    this.photoType = this.photoTypes[Math.floor(Math.random() * this.photoTypes.length)]
  }
  apiUrl = "https://api.pexels.com/v1/search?query=iceland";

  getPhotos() {
    return new Observable(observer => {
      console.log(this.photoType.key)
      observer.next(this.photoType.data.default)
    })
    return
  }

  getNews() {
    const address = `http://newsapi.org/v2/everything?q=${this.photoType.key}&from=2021-01-04&sortBy=publishedAt&apiKey=${NEWS_API_KEY}`;
    return new Observable<any>(observer => {
      this.http.get(address)
        .pipe(catchError(err => {
          console.log({ err })
          observer.next(newsData.default);
          return of([])
        }))
        .subscribe(data => observer.next(data));
    });
  }
}