import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TinyMceModule } from 'angular-tinymce';
import { tinymceDefaultSettings } from 'angular-tinymce';
import { SortablejsModule } from 'angular-sortablejs';
import { AppComponent } from './app.component';
import { ObjectListComponent } from './object-list/object-list.component';
import { TextToolComponent } from './text-tool/text-tool.component';
import { ExpoPreviewComponent } from './expo-preview/expo-preview.component';

/**
 * RCExpositionModel
 */

@NgModule({
  declarations: [
    AppComponent,
    ObjectListComponent,
    TextToolComponent,
    ExpoPreviewComponent
  ],
  imports: [
    SortablejsModule.forRoot({ animation: 150 }),
    BrowserModule,
    FormsModule,
    TinyMceModule.forRoot(tinymceDefaultSettings()) // is customised in text-tool.component
  ],
  providers: [], 
  bootstrap: [AppComponent]
})
export class AppModule {
  
  constructor () {
  }
}
