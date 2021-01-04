import { Component, Input } from "@angular/core";
import {
  trigger,
  state,
  style,
  animate,
  transition
} from "@angular/animations";

@Component({
  selector: "hello",
  template: `
    <h1>Hello {{ name }}!</h1>

    <div [@popOverState]="stateName">
      this is some popover content I just added
    </div>
    <button (click)="toggle()">Toggle popover state</button>
  `,
  styles: [
    `
      h1 {
        font-family: Lato;
      }
    `
  ],
  animations: [
    trigger("popOverState", [
      state(
        "show",
        style({
          opacity: 1
        })
      ),
      state(
        "hide",
        style({
          opacity: 0
        })
      ),
      transition("show => hide", animate("200ms ease-out")),
      transition("hide => show", animate("400ms ease-in"))
    ])
  ]
})
export class HelloComponent {
  @Input() name: string;
  show = false;
  get stateName() {
    return this.show ? "show" : "hide";
  }
  toggle() {
    this.show = !this.show;
  }
}
