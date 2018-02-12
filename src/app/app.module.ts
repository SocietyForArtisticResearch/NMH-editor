import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TinyMceModule } from 'angular-tinymce';
import { tinymceDefaultSettings } from 'angular-tinymce';



import { AppComponent } from './app.component';
import { ObjectListComponent } from './object-list/object-list.component';
import { TextToolComponent } from './text-tool/text-tool.component';
import { ExpoPreviewComponent } from './expo-preview/expo-preview.component';

import { RCExpositionModel } from './shared/RC-exposition-model.service';


@NgModule({
  declarations: [
    AppComponent,
    ObjectListComponent,
    TextToolComponent,
    ExpoPreviewComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    TinyMceModule.forRoot(tinymceDefaultSettings())
  ],
  providers: [RCExpositionModel],
  bootstrap: [AppComponent]
})
export class AppModule {
  
  constructor () {
  }
}
