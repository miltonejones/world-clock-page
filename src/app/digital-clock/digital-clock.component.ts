import {
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  OnInit,
  ViewChild
} from "@angular/core";
import { Observable } from "rxjs";

@Component({
  selector: "app-digital-clock",
  templateUrl: "./digital-clock.component.html",
  styleUrls: ["./digital-clock.component.css"]
})
export class DigitalClockComponent implements OnInit {
  am = false;
  dots: Dot[] = [];
  timePoint: TimePoint = {} as TimePoint;
  datePoint: DatePoint = {} as DatePoint;
  maxLeft = 0;
  pastLeft = new EventEmitter<Dot>();
  url = racingStripe();
  constructor(private ch: ChangeDetectorRef) {}

  display(f: TimePoint) {
    this.timePoint = f;
    this.am = parseInt(f.h, 10) < 12;
    this.datePoint = {
      day: dayOf(new Date().getDay()),
      date: new Date().getDate().toString()
    };
  }

  go() {
    this.dots.map(d => d.go());
    setTimeout(() => this.go(), 1000);
  }

  ngOnInit() {
    this.tick().subscribe(f => this.display(f));
    this.dots = [];
    let num = Math.max(new Date().getSeconds() - 3, 0);
    for (let i = 0; i < 28; i++) {
      const n = num % 60;
      const ss = n < 10 ? `0${n}` : n.toString();
      this.dots.push(new Dot(this.pastLeft, ss, i * 24));
      this.maxLeft = num;
      num++;
    }
    this.pastLeft.subscribe(p => {
      const value = ++this.maxLeft;
      const num = value % 60;
      p.trans = "left 0s";
      p.left = 26 * 24;
      p.value = num < 10 ? `0${num}` : num.toString();
    });
    this.go();
  }
  tick(): Observable<TimePoint> {
    return new Observable<TimePoint>(observer => {
      const run = () => {
        const d = new Date();
        let hh = (d.getHours() % 12)
        const h = d.getHours().toString();
        let m = d.getMinutes().toString();
        const s = d.getSeconds().toString();
        if (parseInt(m, 10) < 10) {
          m = `0${m}`;
        }
        if (hh < 1) { hh = 12 };
        observer.next({ h, m, s, hh });
        window.requestAnimationFrame(run);
      };
      window.requestAnimationFrame(run);
    });
  }
}

class Dot {
  left = 0;
  value = "";
  trans = "left 1s";
  active = false;
  pastLeft = new EventEmitter<Dot>();
  constructor(p: EventEmitter<Dot>, v = "", l = 0) {
    this.pastLeft = p;
    this.value = v;
    this.left = l;
  }
  go() {
    this.trans = "all 1s";
    this.left -= 24;
    if (this.left < -24) {
      this.pastLeft.emit(this);
    }
    this.active = this.left > 90 && this.left < 120;
  }
}

export interface TimePoint {
  hh: number;
  h: string;
  m: string;
  s: string;
}

export interface DatePoint {
  day: string;
  date: string;
}

export function racingStripe() {
  const cv = document.createElement("canvas");
  cv.width = 470;
  cv.height = 200;
  var ctx = cv.getContext("2d");
  const x1 = cv.width * 0.75;
  const x2 = cv.width * 0.5;
  const y2 = cv.height + 10;
  if (ctx) {
    ctx.lineWidth = 16;
    ctx.strokeStyle = "#ffaaaa";
    ctx.beginPath();
    ctx.moveTo(x1, -10);
    ctx.lineTo(x2, y2);
    ctx.stroke();

    ctx.strokeStyle = "#999999";
    ctx.lineWidth = 8;
    ctx.beginPath();
    ctx.moveTo(x1 + 20, -10);
    ctx.lineTo(x2 + 20, y2);
    ctx.stroke();
  }
  return cv.toDataURL();
}

export function dayOf(i: number) {
  return ["sun", "mon", "tue", "wed", "thu", "fri", "sat"][i];
}
