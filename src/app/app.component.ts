import { Component, VERSION } from '@angular/core';
import { PhotoApiService } from './photo-api.service';
import { randomize } from './app.constants';
import { Observable } from 'rxjs';
import { trigger, state, style, animate, transition } from '@angular/animations';

@Component({
  selector: 'my-app',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css'],
  animations: [
    trigger('scroll', [
      state('on', style({left: '-100%'})),
      transition('* => *', [
        style({left: '-100%'}),
        animate(60000, style({left: '100%'}))
      ])
    ])
  ]
})
export class AppComponent {
  name = 'Angular ' + VERSION.major;
  state = 0;
  photo = '';
  photos: PhotoDatum[] = [];
  selected: PhotoDatum = {} as PhotoDatum;
  index = 0;
  backgroundPos = '0px 0px';
  backgroundSize = 'cover';
  articles: NewsArticle[] = []
  constructor(private api: PhotoApiService) {
    this.api.getPhotos()
      .subscribe((data: any) => {
        this.photos = randomize(data);
        this.next();
        console.log(data.length)
      }); 
    this.api.getNews()
      .subscribe((o: NewsResponse) => {  
        this.articles = o.articles;
      });
      this.photo = localStorage['default-image'];
  }

  scrollDone() {
    this.state++;
    this.articles = randomize(this.articles);
  }

  sizeImageToWindow(image: string): Observable<any> {
    return new Observable(observer => {
      const max = document.body.offsetWidth;
      const height = document.body.offsetHeight;
      const im = new Image();
      im.onload = () => {
        if (im.height > im.width) {
          return observer.next();
        }
        this.backgroundPos = '0px 0px';
        if (im.height > height) {
          const ratioX = max / im.width;
          const ratioY = height / im.height;
          const h = im.height * ratioX;
          const w = im.width * ratioY;
          this.backgroundSize = `${max}px ${h}px`;
        }
        localStorage['default-image'] = image;
        observer.next(image);
      }
      im.onerror = () => observer.next();
      im.src = image;
    })
  }

  before(image: string) {
    this.sizeImageToWindow(image)
      .subscribe(pic => {
        if (pic) this.photo = pic;
      });
  }

  next() {
    this.selected = this.photos[this.index];
    this.before(this.selected.src?.original);
    this.index = ++this.index % this.photos.length;
    setTimeout(() => this.next(), 9999);
  }
}

export interface NewsResponse {
  articles: NewsArticle[];
  status: string;
  totalResults: number
}

export interface PhotoDatum {
  avg_color: string;
  height: number;
  id: number;
  liked: boolean
  photographer: string;
  photographer_id: number;
  photographer_url: string;
  src: any
  url: string;
  width: number;
}

export interface NewsArticle {
  author: string;
  content: string;
  description: string;
  publishedAt: string;
  source: any;
  title: string;
  url: string;
  urlToImage: string;
}