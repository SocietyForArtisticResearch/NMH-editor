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
import { ExpoPreviewComponent } from './expo-preview/expo-preview.component';
import { BasicToolComponent } from './tools/basic-tool/basic-tool.component';
import { MarkdownToolComponent } from './tools/markdown-tool/markdown-tool.component';
import { DocUploaderComponent } from './doc-uploader/doc-uploader.component';
import { StyleEditComponent } from './style-edit/style-edit.component';
import { AudioToolComponent } from './tools/audio-tool/audio-tool.component';
import { DragAndDropComponent } from './drag-and-drop/drag-and-drop.component';
import { DragDropDirective } from './drag-and-drop/drag-drop.directive';
import { VideoToolComponent } from './tools/video-tool/video-tool.component';
import { ImageToolComponent } from './tools/image-tool/image-tool.component';

// url routing
const appRoutes: Routes = [
  { path: '', component: MarkdownToolComponent },
  { path: 'objectList', component: ObjectListComponent },
  { path: 'editor', component: MarkdownToolComponent }
 ];

@NgModule({
  declarations: [
    AppComponent,
    ObjectListComponent,
    ExpoPreviewComponent,
    BasicToolComponent,
    MarkdownToolComponent,
    DocUploaderComponent,
    StyleEditComponent,
    AudioToolComponent,
    DragAndDropComponent,
    DragDropDirective,
    VideoToolComponent,
    ImageToolComponent
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
