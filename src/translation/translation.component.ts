import { Component } from '@angular/core';
import { TranslationService } from '../translation.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-translation',
  imports: [CommonModule,FormsModule],
  templateUrl: './translation.component.html',
  styleUrl: './translation.component.css'
})
export class TranslationComponent {
  textToTranslate: string = '';
  translatedText: string = '';
  targetLanguage: string = 'es'; // Default to Spanish
  sourceLanguage: string = 'en'; // Default to English
  languages = [
    { code: 'en', name: 'English' },
    { code: 'es', name: 'Spanish' },
    { code: 'fr', name: 'French' },
    { code: 'de', name: 'German' },
    { code: 'zh', name: 'Chinese' },
    { code: 'ar', name: 'Arabic' },
  ];
  constructor(private translationService: TranslationService) {}
  //constructor() {}
  ngOnInit(): void {
    console.log('HttpClient Injection Successful:', this.translationService ? 'Yes' : 'No');
  }
  onTranslate() {
    this.translatedText = 'Please enter text to translate.';
    if (this.textToTranslate.trim()) {
      this.translationService
        .translate(this.textToTranslate, this.targetLanguage, this.sourceLanguage)
        .subscribe(
          (response) => {
            this.translatedText = response.translatedText;
          },
          (error) => {
            console.error('Translation error:', error);
          }
        );
    } else {
      this.translatedText = 'Please enter text to translate.';
    }
  }

}
