import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs/internal/Observable';

@Injectable({
  providedIn: 'root'
})
export class TranslationService {
  private apiUrl = 'http://127.0.0.1:5000/translate'; // LibreTranslate endpoint
  constructor(private http: HttpClient) { }
  ngOnInit(): void {
    console.log('TranslationService HttpClient Injection Successful:', this.http ? 'Yes' : 'No');
  }

  
  translate(text: string, targetLang: string, sourceLang: string = 'en'): Observable<any> {
    const headers = new HttpHeaders({ 'Content-Type': 'application/json' });
    const body = {
      q: text,
      source: sourceLang,
      target: targetLang,
      
    };
    
    return this.http.post(this.apiUrl, body, { headers });
  }
}
