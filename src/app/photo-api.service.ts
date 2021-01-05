import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable, of, } from 'rxjs';
import { NEWS_API_KEY, PHOTO_API_KEY } from './app.constants';
import * as photoData from './photos.json';
import * as newsData from './news.json';
import { map, catchError } from 'rxjs/operators';

const COOKIE_NAME = 'pixel_photos';
@Injectable()
export class PhotoApiService {

  constructor(private http: HttpClient) { }
  apiUrl = "https://api.pexels.com/v1/search?query=iceland";

  getPhotos() {
    return new Observable(observer => {
      observer.next(photoData.default)
    })
    return
  }

  getNews() {
    const address = `http://newsapi.org/v2/everything?q=iceland&from=2021-01-04&sortBy=publishedAt&apiKey=${NEWS_API_KEY}`;
    return new Observable<any>(observer => {
      this.http.get(address)
        .pipe(catchError(err => {
          console.log({err})
          observer.next(newsData.default);
          return of([])
        }))
        .subscribe(data => observer.next(data));
    });
  }
}