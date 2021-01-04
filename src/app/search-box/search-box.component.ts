import { Component, OnInit } from '@angular/core';

@Component({
  selector: '[app-search-box]',
  templateUrl: './search-box.component.html',
  styleUrls: ['./search-box.component.css']
})
export class SearchBoxComponent implements OnInit {
  value = '';
  constructor() { }

  ngOnInit(): void {
  }

  find(): void {
    window.open('https://www.google.com/search?q=' + this.value);
    this.value = '';
  }

}
