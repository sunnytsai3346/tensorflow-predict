import { Component, OnInit } from '@angular/core';
import * as tf from '@tensorflow/tfjs';
import * as tfvis from '@tensorflow/tfjs-vis';

class CharacterTable {
  chars: string;
  charIndices: { [key: string]: number };
  indicesChar: { [key: number]: string };
  size: number;

  constructor(chars: string) {
    this.chars = chars;
    this.charIndices = {};
    this.indicesChar = {};
    this.size = this.chars.length;
    for (let i = 0; i < this.size; ++i) {
      const char = this.chars[i];
      if (this.charIndices[char] != null) {
        throw new Error(`Duplicate character '${char}'`);
      }
      this.charIndices[char] = i;
      this.indicesChar[i] = char;
    }
  }

  // Encode a single string into a one-hot encoded tensor
  encode(str: string, numRows: number) {
    const buf = tf.buffer([numRows, this.size]);
    for (let i = 0; i < str.length; ++i) {
      const char = str[i];
      if (this.charIndices[char] == null) {
        throw new Error(`Unknown character: '${char}'`);
      }
      buf.set(1, i, this.charIndices[char]);
    }
    return buf.toTensor();
  }

  // Encode a batch of strings into a 3D one-hot encoded tensor
  encodeBatch(strings: string[], numRows: number) {
    const numExamples = strings.length;
    const buf = tf.buffer([numExamples, numRows, this.size]);
    for (let n = 0; n < numExamples; ++n) {
      const str = strings[n];
      for (let i = 0; i < str.length; ++i) {
        const char = str[i];
        if (this.charIndices[char] == null) {
          throw new Error(`Unknown character: '${char}'`);
        }
        buf.set(1, n, i, this.charIndices[char]);
      }
    }
    return buf.toTensor();
  }

  // Decode a 2D tensor into a string
  decode(x: tf.Tensor, calcArgmax = true): string {
    return tf.tidy(() => {
      if (calcArgmax) {
        x = x.argMax(1);
      }
      const xData = x.dataSync();
      let output = '';
      for (const index of Array.from(xData)) {
        output += this.indicesChar[index];
      }
      return output;
    });
  }
}


@Component({
  selector: 'app-addition-rnn',
  imports: [],
  templateUrl: './addition-rnn.component.html',
  styleUrl: './addition-rnn.component.css'
})
export class AdditionRnnComponent implements OnInit {
  model: tf.Sequential | null = null;
  charTable: CharacterTable | null = null;

  ngOnInit(): void {
    this.runAdditionRNNDemo();
  }

  async runAdditionRNNDemo() {
    this.charTable = new CharacterTable('0123456789+ ');
    const digits = 2;
    const trainingSize = 5000;
    const rnnType = 'LSTM';
    const layers = 2;
    const hiddenSize = 128;

    const data = this.generateData(digits, trainingSize);
    const [trainData, testData] = [data.slice(0, 4500), data.slice(4500)];
    const [trainXs, trainYs] = this.convertDataToTensors(trainData, digits);
    const [testXs, testYs] = this.convertDataToTensors(testData, digits);

    this.model = this.createAndCompileModel(layers, hiddenSize, rnnType, digits);
    await this.trainModel(trainXs, trainYs, testXs, testYs, 50, 64);
  }

  generateData(digits: number, numExamples: number) {
    const data = [];
    const maxLen = digits + 1 + digits;

    for (let i = 0; i < numExamples; i++) {
      const a = Math.floor(Math.random() * Math.pow(10, digits));
      const b = Math.floor(Math.random() * Math.pow(10, digits));
      const question = `${a}+${b}`.padEnd(maxLen, ' ');
      const answer = `${a + b}`.padEnd(digits + 1, ' ');
      data.push([question, answer]);
    }
    return data;
  }

  convertDataToTensors(data: string[][], digits: number) {
    const maxLen = digits + 1 + digits;
    const questions = data.map(d => d[0]);
    const answers = data.map(d => d[1]);
    return [
      this.charTable!.encodeBatch(questions, maxLen),
      this.charTable!.encodeBatch(answers, digits + 1)
    ];
  }

  createAndCompileModel(layers: number, hiddenSize: number, rnnType: string, digits: number) {
    const maxLen = digits + 1 + digits;
    const vocabularySize = this.charTable!.size;

    const model = tf.sequential();
    model.add(
      tf.layers.lstm({
        units: hiddenSize,
        inputShape: [maxLen, vocabularySize],
        returnSequences: true
      })
    );
    model.add(tf.layers.timeDistributed({ layer: tf.layers.dense({ units: vocabularySize }) }));
    model.add(tf.layers.activation({ activation: 'softmax' }));
    model.compile({ loss: 'categoricalCrossentropy', optimizer: 'adam', metrics: ['accuracy'] });

    return model;
  }

  async trainModel(trainXs: tf.Tensor, trainYs: tf.Tensor, testXs: tf.Tensor, testYs: tf.Tensor, epochs: number, batchSize: number) {
    await this.model!.fit(trainXs, trainYs, {
      epochs,
      batchSize,
      validationData: [testXs, testYs],
      callbacks: tfvis.show.fitCallbacks(
        { name: 'Training Performance' },
        ['loss', 'val_loss', 'accuracy', 'val_accuracy'],
        { callbacks: ['onEpochEnd'] }
      )
    });
  }
}
