import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProjectorCalibrationComponent } from './projector-calibration.component';

describe('ProjectorCalibrationComponent', () => {
  let component: ProjectorCalibrationComponent;
  let fixture: ComponentFixture<ProjectorCalibrationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ProjectorCalibrationComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProjectorCalibrationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
