import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { BasicToolComponent } from './basic-tool.component';

describe('BasicToolComponent', () => {
  let component: BasicToolComponent;
  let fixture: ComponentFixture<BasicToolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ BasicToolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(BasicToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
