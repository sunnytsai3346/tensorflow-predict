import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import * as tf from '@tensorflow/tfjs';
import * as tfvis from '@tensorflow/tfjs-vis';

@Component({
  selector: 'app-projector-calibration',
  imports: [FormsModule,CommonModule],
  templateUrl: './projector-calibration.component.html',
  styleUrl: './projector-calibration.component.css'
})
export class ProjectorCalibrationComponent implements OnInit {
  model: tf.Sequential | null = null;
  correctedCoords: number | null = null;
  distortedX:number =0;
  distortedY:number =0;
  

  ngOnInit(): void {
    this.initializeModel();
  }

  // Initialize the model
  initializeModel() {
    this.model = tf.sequential();
    this.model.add(tf.layers.dense({ units: 64, inputShape: [2], activation: 'relu' }));
    this.model.add(tf.layers.dense({ units: 64, activation: 'relu' }));
    this.model.add(tf.layers.dense({ units: 2 })); // Output 2D coordinates
    this.model.compile({ optimizer: 'adam', loss: 'meanSquaredError' });
    console.log('Model initialized.');
  }

  // Generate synthetic training data (distorted vs. corrected coordinates)
  generateCalibrationData(numSamples: number) {
    const inputs: number[][] = [];
    const outputs: number[][] = [];

    for (let i = 0; i < numSamples; i++) {
      const x = Math.random();
      const y = Math.random();

      // Simulate distortion (example: small random offset)
      const distortedX = x + Math.sin(x * Math.PI * 2) * 0.1;
      const distortedY = y + Math.sin(y * Math.PI * 2) * 0.1;

      inputs.push([distortedX, distortedY]); // Distorted coordinates
      outputs.push([x, y]); // Original (corrected) coordinates
    }

    return { inputs: tf.tensor2d(inputs), outputs: tf.tensor2d(outputs) };
  }

  // Train the model
  async trainModel() {
    if (!this.model) {
      console.error('Model is not initialized.');
      return;
    }

    const { inputs, outputs } = this.generateCalibrationData(1000);

    console.log('Training started...');
    await this.model.fit(inputs, outputs, {
      epochs: 50,
      batchSize: 32,
      validationSplit: 0.2,
      callbacks: tfvis.show.fitCallbacks(
        { name: 'Training Performance' },
        ['loss', 'val_loss'],
        { callbacks: ['onEpochEnd'] }
      )
    });
    console.log('Training complete.');
  }

  // Predict corrected coordinates
  async predict(distortedX: number, distortedY: number) {
    if (!this.model) {
      console.error('Model is not initialized.');
      return;
    }

    const inputTensor = tf.tensor2d([[distortedX, distortedY]]);
    const prediction = this.model.predict(inputTensor) as tf.Tensor;
    const predictionArray = await prediction.array() as number[][]; // Cast to a 2D array
    const correctedCoords = predictionArray[0]; // Extract prediction value
    
    console.log(`Distorted: (${distortedX}, ${distortedY})`);
    console.log(`Corrected: (${correctedCoords[0]}, ${correctedCoords[1]})`);
    return correctedCoords;
  }
}