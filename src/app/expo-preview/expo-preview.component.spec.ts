import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ExpoPreviewComponent } from './expo-preview.component';

describe('ExpoPreviewComponent', () => {
  let component: ExpoPreviewComponent;
  let fixture: ComponentFixture<ExpoPreviewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ExpoPreviewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ExpoPreviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
