import { ComponentFixture, TestBed } from '@angular/core/testing';

import { WhisperAsrComponent } from './whisper-asr.component';

describe('WhisperAsrComponent', () => {
  let component: WhisperAsrComponent;
  let fixture: ComponentFixture<WhisperAsrComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [WhisperAsrComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(WhisperAsrComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
