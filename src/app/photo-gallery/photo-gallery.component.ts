import { Component, OnInit } from "@angular/core";
import {
  trigger,
  state,
  style,
  animate,
  transition
} from "@angular/animations";

@Component({
  selector: "[app-photo-gallery]",
  templateUrl: "./photo-gallery.component.html",
  styleUrls: ["./photo-gallery.component.css"],
  animations: [
    trigger("photoState", [
      state(
        "move",
        style({
          transform: "translateX(-100%) translateY(50px)"
        })
      ),
      state(
        "enlarge",
        style({
          transform: "scale(1.5)"
        })
      ),
      state(
        "spin",
        style({
          transform: "rotateY(180deg) rotateZ(90deg)"
        })
      ),
      transition("* => *", animate("500ms ease-in"))
    ])
  ]
})
export class PhotoGalleryComponent implements OnInit {
  position: string;
  photoUrl =
    "https://media.gettyimages.com/photos/american-entertainer-josephine-baker-in-costume-for-her-famous-banana-picture-id2665989?s=594x594";
  constructor() {}

  changePosition(newPos: string): void {
    this.position = newPos;
  }

  ngOnInit() {}
}
