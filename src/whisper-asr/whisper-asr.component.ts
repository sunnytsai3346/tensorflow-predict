import { CommonModule } from '@angular/common';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatProgressSpinner } from '@angular/material/progress-spinner';
import { pipeline } from '@xenova/transformers';

@Component({
  selector: 'app-whisper-asr',
  standalone: true,
  imports: [MatCardModule,CommonModule,FormsModule,MatProgressSpinner],
  templateUrl: './whisper-asr.component.html',
  styleUrls: ['./whisper-asr.component.css']
})
export class WhisperAsrComponent implements OnInit, OnDestroy {
  private recorder: MediaRecorder | null = null;
  private audioChunks: Blob[] = [];
  transcription: string = '';
  isRecording = false;
  whisperPipeline: any;
  isLoading = false; // For Material progress spinner

  async ngOnInit() {
    //this.whisperPipeline = await pipeline('automatic-speech-recognition', 'openai/whisper-large-v2');
    this.whisperPipeline = await pipeline('automatic-speech-recognition', 'openai/whisper-small');
  }

  async startRecording() {
    this.audioChunks = [];
    this.isRecording = true;
    this.isLoading = false;

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      this.recorder = new MediaRecorder(stream);
      
      this.recorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.recorder.onstop = async () => {
        this.isLoading = true;
        const audioBlob = new Blob(this.audioChunks, { type: 'audio/webm' });
        await this.transcribeAudio(audioBlob);
        this.isLoading = false;
      };

      this.recorder.start();
    } catch (err) {
      console.error('Error accessing microphone:', err);
      this.isRecording = false;
    }
  }

  stopRecording() {
    if (this.recorder) {
      this.recorder.stop();
      this.isRecording = false;
    }
  }

  async transcribeAudio(audioBlob: Blob) {
    const reader = new FileReader();
    reader.readAsArrayBuffer(audioBlob);
    reader.onloadend = async () => {
      const audioBuffer = reader.result as ArrayBuffer;
      this.transcription = 'Processing...';

      try {
        const result = await this.whisperPipeline(audioBuffer);
        this.transcription = result.text;
      } catch (error) {
        console.error('Error transcribing audio:', error);
        this.transcription = 'Error in transcription';
      }
    };
  }

  ngOnDestroy() {
    if (this.recorder) {
      this.recorder.stop();
    }
  }
}
