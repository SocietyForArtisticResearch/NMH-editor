import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { TinyMceModule } from 'angular-tinymce';
import { tinymceDefaultSettings } from 'angular-tinymce';
import { SortablejsModule } from 'angular-sortablejs';

import { AppComponent } from './app.component';
import { ObjectListComponent } from './object-list/object-list.component';
import { TextToolComponent } from './tools/text-tool/text-tool.component';
import { ExpoPreviewComponent } from './expo-preview/expo-preview.component';
import { ImageToolComponent } from './tools/image-tool/image-tool.component';
import { BasicToolComponent } from './tools/basic-tool/basic-tool.component';

/**
 * RCExpositionModel
 */

@NgModule({
  declarations: [
    AppComponent,
    ObjectListComponent,
    TextToolComponent,
    ExpoPreviewComponent,
    ImageToolComponent,
    BasicToolComponent
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
