import { CommonModule } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { Component } from '@angular/core';
import { MatCardModule } from '@angular/material/card';

@Component({
  selector: 'app-tensorflow-opencv-demo',
  imports: [MatCardModule,CommonModule],
  templateUrl: './tensorflow-opencv-demo.component.html',
  styleUrl: './tensorflow-opencv-demo.component.css'
})
export class TensorflowOpencvDemoComponent {
  selectedFile: File | null = null;
  predictionResult: string = "";
  imageUrl: string | null = null; // ✅ To display image preview
  isLoading: boolean = false; // ✅ Add a loading state
  constructor(private http: HttpClient) {}
  onFileSelected(event: any) {
    this.selectedFile = event.target.files[0];

    if (this.selectedFile) {
      // ✅ Clear previous prediction & set default black text
      this.predictionResult = "";
      this.imageUrl = URL.createObjectURL(this.selectedFile);
    }

  }

  onUpload() {
    if (!this.selectedFile) return;

     // ✅ Clear previous result and show loading
    this.predictionResult = "";
    this.isLoading = true;

    const formData = new FormData();
    formData.append("image", this.selectedFile);

    

    this.http.post<{ label: string }>("http://127.0.0.1:5000/predict", formData)
      .subscribe(
        (response) => {
          console.dir(response);
          this.predictionResult = response.label;
          this.isLoading = false;
        },
        (error) => {
          console.error('call predict endpoint error:', error);
          this.isLoading = false;
        }
      );
  }

  getPredictionStyle() {
    if (!this.predictionResult) {
      return { color: "black", "font-size": "16px", "font-weight": "bold" };
    }
    return this.predictionResult === "Face"
      ? { color: "green", "font-size": "16px", "font-weight": "bold" }
      : { color: "red", "font-size": "16px", "font-weight": "bold" };
  }


}
