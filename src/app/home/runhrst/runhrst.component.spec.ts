import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RunhrstComponent } from './runhrst.component';

describe('RunhrstComponent', () => {
  let component: RunhrstComponent;
  let fixture: ComponentFixture<RunhrstComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ RunhrstComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(RunhrstComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
