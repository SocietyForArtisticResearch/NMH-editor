import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { DocUploaderComponent } from './doc-uploader.component';
import { RCExpoModel } from '../shared/RCExpoModel';

describe('DocUploaderComponent', () => {
  let component: DocUploaderComponent;
  let fixture: ComponentFixture<DocUploaderComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ DocUploaderComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(DocUploaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
