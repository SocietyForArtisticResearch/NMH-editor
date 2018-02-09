import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { EditorModule } from '@tinymce/tinymce-angular';
import { FormsModule } from '@angular/forms';



import { AppComponent } from './app.component';
import { ObjectListComponent } from './object-list/object-list.component';
import { TextToolComponent } from './text-tool/text-tool.component';
import { ExpoPreviewComponent } from './expo-preview/expo-preview.component';


@NgModule({
  declarations: [
    AppComponent,
    ObjectListComponent,
    TextToolComponent,
    ExpoPreviewComponent
  ],
  imports: [
    BrowserModule,
    EditorModule,
    FormsModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
