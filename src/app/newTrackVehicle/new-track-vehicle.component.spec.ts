import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewTrackVehicleComponent } from './new-track-vehicle.component';

describe('NewTrackVehicleComponent', () => {
  let component: NewTrackVehicleComponent;
  let fixture: ComponentFixture<NewTrackVehicleComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NewTrackVehicleComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NewTrackVehicleComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
