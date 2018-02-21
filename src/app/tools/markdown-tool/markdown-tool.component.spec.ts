import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MarkdownToolComponent } from './markdown-tool.component';

describe('MarkdownToolComponent', () => {
  let component: MarkdownToolComponent;
  let fixture: ComponentFixture<MarkdownToolComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MarkdownToolComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MarkdownToolComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
