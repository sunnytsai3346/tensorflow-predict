import { Component, OnInit } from '@angular/core';
import * as tf from '@tensorflow/tfjs';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { CommonModule } from '@angular/common';



@Component({
  selector: 'app-tensorflow-predict',
  imports: [FormsModule,CommonModule],
  templateUrl: './tensorflow-predict.component.html',
  styleUrl: './tensorflow-predict.component.css'
})

export class TensorflowPredictComponent implements OnInit {

  model!: tf.Sequential; // The model for prediction
  useSimpleModel: boolean = true; // Toggle between simple and complex model
  predictionResult: number | null = null;
  input1:number  = 0;
  input2:number  = 0 ;
  

  constructor() {
  
  }

  ngOnInit(): void {
    this.initializeModel();
  }
  /** Toggle model type */
  toggleModel() {
    this.useSimpleModel = !this.useSimpleModel;
    this.initializeModel(); // Reinitialize model
  }

  // Initialize a simple model
  async initializeModel() {
    this.model = tf.sequential();

    if (this.useSimpleModel) {
      // Simple model: One dense layer
      this.model.add(tf.layers.dense({ inputShape: [2], units: 1 }));
    } else {
      // Complex model: Three dense layers
      this.model.add(tf.layers.dense({ inputShape: [2], units: 16, activation: 'relu' }));
      this.model.add(tf.layers.dense({ units: 16, activation: 'relu' }));
      this.model.add(tf.layers.dense({ units: 1 })); // Output layer
    }

    // Compile the model
    //tf.train.sgd(0.01) // 0.01 is the learning rate
    this.model.compile({
      optimizer: this.useSimpleModel ? tf.train.sgd(0.01) : tf.train.adam(),  
      loss: 'meanSquaredError',
      metrics: ['mae']
    });

    console.log(`Initialized ${this.useSimpleModel ? 'Simple' : 'Complex'} Model.`);
  }

  // Train the model with dummy 2D data
  async trainModel() {
    const input = tf.tensor2d([[1, 2], [2, 3], [3, 4], [4, 5], [5, 6]]);
    const output = tf.tensor2d([[3], [5], [7], [9], [11]]); // y = x1 + x2

    console.log('Training started...');
    await this.model.fit(input, output, {
      epochs: 100,
      callbacks: {
        onEpochEnd: (epoch, logs) => {
          console.log(`Epoch ${epoch + 1}: loss = ${logs?.['loss']}`);
        }
      }
    });
    console.log('Training complete.');
  }

  // Make a prediction
  async predict(inputData: [number, number]) {
    const inputTensor = tf.tensor2d([inputData]);
    const prediction = this.model.predict(inputTensor) as tf.Tensor;
    const predictionArray = await prediction.array() as number[][]; // Cast to a 2D array
    this.predictionResult = predictionArray[0][0]; // Extract prediction value
    console.log('Prediction:', this.predictionResult);
  }
}

