import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PictureToolComponent } from './picture-tool.component';

describe('PictureToolComponent', () => {
  let component: PictureToolComponent;
  let fixture: ComponentFixture<PictureToolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PictureToolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PictureToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
