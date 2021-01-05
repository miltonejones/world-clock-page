import { Component, HostListener, VERSION } from '@angular/core';
import { PhotoApiService } from './photo-api.service';
import { randomize } from './app.constants';
import { Observable } from 'rxjs';
import { trigger, state, style, animate, transition } from '@angular/animations';
const DEFAULT_PHOTO_URL = 'https://images.pexels.com/photos/4210053/pexels-photo-4210053.jpeg';
 
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
    ]),
    trigger("rotate", [
      state("turn", style({transform: "rotateY(360deg)"})),
      state("turned", style({transform: "rotateY(0deg)"})),
      transition("* => *", [animate("900ms linear")])
    ])
  ]
})
export class AppComponent {
  name = 'Angular ' + VERSION.major;
  state = 0;
  photo = '';
  turn = 'turned';
  photos: PhotoDatum[] = [];
  selected: PhotoDatum = {} as PhotoDatum;
  index = 0;
  backgroundPos = '0px 0px';
  backgroundSize = 'cover';
  articles: NewsArticle[] = [];
  ready = false;
  @HostListener('window:resize', ['$event'])
  onResize(): void {
    this.sizeImageToWindow(this.buildURL(this.photo), this.selected)
      .subscribe(console.log);
  }
  constructor(private api: PhotoApiService) {
    this.api.getPhotos()
      .subscribe((data: any) => {
        this.photos = randomize(this.curate(data));
        this.next();
      }); 
    this.api.getNews()
      .subscribe((o: NewsResponse) => {  
        if (o.articles?.length) {
          this.articles = randomize(o.articles);
        }
      });
      this.photo = localStorage['default-image'] || DEFAULT_PHOTO_URL;
  }

  curate(photos: PhotoDatum[]) {
    const body = {
      w: document.body.offsetWidth,
      h: document.body.offsetHeight
    }
    const body_horiz = body.w > body.h;
    return photos.filter((im: PhotoDatum) => {
      const image_horiz = im.width > im.height;
      return image_horiz === body_horiz;
    })
  }

  scrollDone() {
    this.state++;
    this.articles = randomize(this.articles);
  }

  compare(im: HTMLImageElement) {
    const body = {
      w: document.body.offsetWidth,
      h: document.body.offsetHeight
    }
    const image_horiz = im.width > im.width;
    const body_horiz = body.w > body.h;
    return {
      image_horiz, body_horiz
    }
  }

  sizeImageToWindow(image: string, selected: any): Observable<any> {
    return new Observable(observer => {
      const max = document.body.offsetWidth;
      const height = document.body.offsetHeight;
      const im = new Image();
      im.onload = () => {
        const stats = this.compare(im);
        // if (stats.image_horiz != stats.body_horiz) {
        //   console.log('skipping "%s"', image, stats)
        //   return observer.next();
        // }
        this.backgroundPos = '0px 0px';
        const ratioX = max / im.width;
        const ratioY = height / im.height;
        const h = im.height * ratioX;
        const w = im.width * ratioY;
        this.backgroundSize = `${max}px ${height}px`;
        this.turn = this.turn === 'turn' ? 'turned': 'turn';
        localStorage['default-image'] = image;
        if (selected) {
          this.selected = selected;
        }
        observer.next(image);
      }
      im.onerror = () => observer.next();
      im.src = image;
    });
  }

  before(image: string, selected: any) {
    this.sizeImageToWindow(image, selected)
      .subscribe(pic => {
        if (pic) this.photo = pic;
      });
  }

  buildURL(str) {
    const body = {
      w: document.body.offsetWidth,
      h: document.body.offsetHeight
    }
    return str.replace(/h=(\d+)\&w=(\d+)/, `h=${body.h}&w=${body.w}`);
  }

  next(): void {
    const body = {
      w: document.body.offsetWidth,
      h: document.body.offsetHeight
    }
    const selected = this.photos[this.index];
    if (selected) {
      const scaleDiff = (selected?.width/selected?.height) / (body.w/body.h);
      if (scaleDiff < .6) {
        return this.next();
      }
      this.before(this.buildURL(selected?.src?.large2x), selected);
      this.index = ++this.index % this.photos.length;
      setTimeout(() => this.next(), 9999);
    }
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