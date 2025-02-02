import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TensorflowPredictComponent } from './tensorflow-predict.component';

describe('TensorflowPredictComponent', () => {
  let component: TensorflowPredictComponent;
  let fixture: ComponentFixture<TensorflowPredictComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TensorflowPredictComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TensorflowPredictComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
