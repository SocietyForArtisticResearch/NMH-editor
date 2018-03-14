import { Output, EventEmitter, HostBinding, HostListener, Directive } from '@angular/core';

@Directive({
  selector: '[appDragDrop]'
})
export class DragDropDirective {
  @Output() private filesChangeEmitter : EventEmitter<FileList> = new EventEmitter();

  constructor() { }

  @HostBinding('style.background') private background = '#eee';

  @HostListener('dragover', ['$event']) public onDragOver(evt){
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#999';
  }

  @HostListener('dragleave', ['$event']) public onDragLeave(evt){
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#eee'
  }

  @HostListener('drop', ['$event']) public onDrop(evt){
    evt.preventDefault();
    evt.stopPropagation();
    this.background = '#eee';
    let files = evt.dataTransfer.files;
    if(files.length > 0){
      this.filesChangeEmitter.emit(files);
      console.log(this.filesChangeEmitter)
    }
  }
}
