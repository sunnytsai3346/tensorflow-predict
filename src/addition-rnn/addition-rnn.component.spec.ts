import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdditionRnnComponent } from './addition-rnn.component';

describe('AdditionRnnComponent', () => {
  let component: AdditionRnnComponent;
  let fixture: ComponentFixture<AdditionRnnComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AdditionRnnComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AdditionRnnComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
