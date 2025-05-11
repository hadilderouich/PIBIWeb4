import { Injectable } from '@angular/core';
import * as tf from '@tensorflow/tfjs';

@Injectable({
  providedIn: 'root'
})
export class EmotionDetectionService {
  private model: tf.LayersModel | null = null;
  private initialized = false;

  constructor() {}

  async initializeModel(): Promise<boolean> {
    try {
      this.model = await tf.loadLayersModel('assets/model/model.json');
      this.initialized = true;
      return true;
    } catch (error) {
      console.error('Error loading model:', error);
      return false;
    }
  }

  async detectEmotion(input: ImageData | tf.Tensor): Promise<{ emotion: string } | null> {
    if (!this.model || !this.initialized) {
      console.error('Model not initialized');
      return null;
    }

    try {
      let tensor: tf.Tensor4D;
      
      if (input instanceof tf.Tensor) {
        tensor = input as tf.Tensor4D;
      } else {
        // Convert ImageData to tensor
        const imgTensor = tf.browser.fromPixels(input);
        
        // Resize and preprocess
        const resized = tf.image.resizeBilinear(imgTensor, [48, 48]);
        const grayscale = tf.image.rgbToGrayscale(resized);
        const normalized = grayscale.div(tf.scalar(255));
        tensor = normalized.expandDims(0);
      }

      console.log('Tensor shape:', tensor.shape);
      
      // Make prediction
      const prediction = this.model.predict(tensor) as tf.Tensor;
      console.log('Prediction:', prediction.dataSync());
      const predictedClass = prediction.argMax(1).dataSync()[0];
      console.log('Predicted class:', predictedClass);

      const emotions = ['angry', 'disgust', 'fear', 'happy', 'sad', 'surprise', 'neutral'];
      const result = { emotion: emotions[predictedClass] };
      console.log('Detected emotion:', result);
      return result;
    } catch (error) {
      console.error('Error during emotion detection:', error);
      return null;
    }
  }
}
