import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { ReactiveFormsModule, FormsModule } from '@angular/forms';
import { TinyMceModule } from 'angular-tinymce';
import { tinymceDefaultSettings } from 'angular-tinymce';
import { SortablejsModule } from 'angular-sortablejs';
import { Routes, RouterModule } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';

// markdown editor:
//import { SimplemdeModule, SIMPLEMDE_CONFIG } from 'ng2-simplemde'

import { AppComponent } from './app.component';
import { ObjectListComponent } from './object-list/object-list.component';
import { TextToolComponent } from './tools/text-tool/text-tool.component';
import { ExpoPreviewComponent } from './expo-preview/expo-preview.component';
import { ImageToolComponent } from './tools/image-tool/image-tool.component';
import { BasicToolComponent } from './tools/basic-tool/basic-tool.component';
import { MarkdownToolComponent } from './tools/markdown-tool/markdown-tool.component';
import { DocUploaderComponent } from './doc-uploader/doc-uploader.component';
import { StyleEditComponent } from './style-edit/style-edit.component';

// url routing
const appRoutes: Routes = [
  { path: '', component: MarkdownToolComponent },
  { path: 'objectList', component: ObjectListComponent },
 ];

@NgModule({
  declarations: [
    AppComponent,
    ObjectListComponent,
    TextToolComponent,
    ExpoPreviewComponent,
    ImageToolComponent,
    BasicToolComponent,
    MarkdownToolComponent,
    DocUploaderComponent,
    StyleEditComponent
  ],
  imports: [
    SortablejsModule.forRoot({ animation: 150 }),
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    TinyMceModule.forRoot(tinymceDefaultSettings()),
    RouterModule.forRoot(appRoutes),
    HttpClientModule
  ],
  providers: [], 
  bootstrap: [AppComponent]
})
export class AppModule {
  
  constructor () {
  }
}
