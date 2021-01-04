import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { AppComponent } from './app.component';
import { HelloComponent } from './hello.component';
import { PhotoGalleryComponent } from './photo-gallery/photo-gallery.component';
import { DigitalClockComponent } from './digital-clock/digital-clock.component';
import { PhotoApiService } from './photo-api.service';
import { HttpClientModule } from '@angular/common/http';
import { SearchBoxComponent } from './search-box/search-box.component';

@NgModule({
  imports:      [ BrowserModule, FormsModule, BrowserAnimationsModule, HttpClientModule ],
  declarations: [ AppComponent, HelloComponent, PhotoGalleryComponent, DigitalClockComponent, SearchBoxComponent ],
  bootstrap:    [ AppComponent ],
  providers: [PhotoApiService]
})
export class AppModule { }
