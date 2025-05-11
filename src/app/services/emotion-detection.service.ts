import { Injectable } from '@angular/core';
import * as tf from '@tensorflow/tfjs';
import '@tensorflow/tfjs-backend-webgl';

export type Emotion = 'Angry' | 'Disgust' | 'Fear' | 'Happy' | 'Sad' | 'Surprise' | 'Neutral';

@Injectable({
  providedIn: 'root'
})
export class EmotionDetectionService {
  private model: tf.LayersModel | null = null;
  private readonly emotions: Emotion[] = ['Angry', 'Disgust', 'Fear', 'Happy', 'Sad', 'Surprise', 'Neutral'];
  private isInitialized = false;

  constructor() {}

  async initializeModel(): Promise<boolean> {
    if (this.isInitialized) return true;
    
    try {
      console.log('Initializing emotion detection model...');
      
      // Load the model
      this.model = await tf.loadLayersModel('assets/fer.json');
      
      // Warm up the model with a dummy input
      const warmUpResult = this.model.predict(tf.zeros([1, 48, 48, 1])) as tf.Tensor;
      await warmUpResult.data();
      warmUpResult.dispose();
      
      this.isInitialized = true;
      console.log('Emotion detection model initialized');
      return true;
      
    } catch (error) {
      console.error('Error initializing emotion detection model:', error);
      this.isInitialized = false;
      return false;
    }
  }

  async detectEmotion(imageData: ImageData): Promise<{emotion: Emotion, confidence: number} | null> {
    if (!this.model || !this.isInitialized) {
      const initialized = await this.initializeModel();
      if (!initialized) return null;
    }

    try {
      // Preprocess the image
      const inputTensor = this.preprocessImage(imageData);
      
      // Make prediction
      const prediction = this.model!.predict(inputTensor) as tf.Tensor;
      const scores = Array.from(prediction.dataSync() as Float32Array);
      
      // Get the emotion with highest confidence
      const maxIndex = scores.indexOf(Math.max(...scores));
      const confidence = scores[maxIndex];
      const emotion = this.emotions[maxIndex];
      
      // Clean up
      tf.dispose([prediction, inputTensor]);
      
      return { emotion, confidence };
      
    } catch (error) {
      console.error('Error during emotion detection:', error);
      return null;
    }
  }

  private preprocessImage(imageData: ImageData): tf.Tensor {
    return tf.tidy(() => {
      // Convert image to tensor
      const tensor = tf.browser.fromPixels(
        { data: new Uint8Array(imageData.data.buffer), width: imageData.width, height: imageData.height },
        1 // 1 channel for grayscale
      );
      
      // Resize to model's expected input
      const resized = tf.image.resizeBilinear(tensor, [48, 48]);
      
      // Normalize pixel values to [0, 1] and add batch dimension
      return resized.toFloat().div(255.0).expandDims(0);
    });
  }

  cleanup() {
    if (this.model) {
      this.model.dispose();
      this.model = null;
    }
    this.isInitialized = false;
  }
}
