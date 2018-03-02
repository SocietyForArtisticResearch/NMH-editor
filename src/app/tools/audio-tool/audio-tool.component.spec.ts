import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AudioToolComponent } from './audio-tool.component';

describe('AudioToolComponent', () => {
  let component: AudioToolComponent;
  let fixture: ComponentFixture<AudioToolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AudioToolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AudioToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
