import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ImageToolComponent } from './image-tool.component';

describe('ImageToolComponent', () => {
  let component: ImageToolComponent;
  let fixture: ComponentFixture<ImageToolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ImageToolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ImageToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
