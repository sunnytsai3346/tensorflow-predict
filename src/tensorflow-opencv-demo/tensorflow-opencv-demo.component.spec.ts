import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TensorflowOpencvDemoComponent } from './tensorflow-opencv-demo.component';

describe('TensorflowOpencvDemoComponent', () => {
  let component: TensorflowOpencvDemoComponent;
  let fixture: ComponentFixture<TensorflowOpencvDemoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TensorflowOpencvDemoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TensorflowOpencvDemoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
