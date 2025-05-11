import { Component, ViewChild, ElementRef, OnDestroy, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { EmotionDetectionService } from '../../services/emotion-detection.service';
import * as tf from '@tensorflow/tfjs';

@Component({
  selector: 'app-copie2',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './copie2.component.html',
  styleUrl: './copie2.component.css'
})
export class Copie2Component implements OnInit, OnDestroy {
  @ViewChild('videoElement') videoElement!: ElementRef<HTMLVideoElement>;
  @ViewChild('canvasElement') canvasElement!: ElementRef<HTMLCanvasElement>;
  @ViewChild('imageElement') imageElement!: ElementRef<HTMLImageElement>;
  
  showModal = false;
  detectedEmotion: string | null = null;
  private stream: MediaStream | null = null;
  private isDetecting = false;
  private animationFrameId: number | null = null;
  
  // Photo upload state
  selectedImage: File | null = null;
  imagePreview: string | null = null;
  imageEmotion: { emotion: string } | null = null;

  constructor(
    private router: Router,
    private emotionDetection: EmotionDetectionService
  ) {}

  async ngOnInit() {
    // Initialize the emotion detection service
    console.log('Initializing emotion detection...');
    const initialized = await this.emotionDetection.initializeModel();
    if (!initialized) {
      console.error('Failed to initialize emotion detection');
    } else {
      console.log('Emotion detection initialized successfully');
    }
  }

  async startEmotionDetection() {
    try {
      // Request access to the webcam
      this.stream = await navigator.mediaDevices.getUserMedia({ 
        video: { 
          width: { ideal: 640 },
          height: { ideal: 480 },
          facingMode: 'user',
          frameRate: { ideal: 30 }
        } 
      });
      
      // Display the webcam feed
      this.videoElement.nativeElement.srcObject = this.stream;
      
      // Wait for video to be ready
      await new Promise<void>((resolve) => {
        this.videoElement.nativeElement.onloadedmetadata = () => {
          this.videoElement.nativeElement.play().then(() => resolve());
        };
      });
      
      // Start detection loop
      this.showModal = true;
      this.detectedEmotion = null;
      this.isDetecting = true;
      this.detectEmotion();
      
    } catch (error) {
      console.error('Error in emotion detection:', error);
      alert(`Error: ${error instanceof Error ? error.message : 'Unknown error occurred'}`);
      this.stopEmotionDetection();
    }
  }

  async detectEmotion() {
    if (!this.isDetecting) {
      return;
    }
    
    const video = this.videoElement.nativeElement;
    const canvas = this.canvasElement.nativeElement;
    const ctx = canvas.getContext('2d');
    
    if (video.readyState >= video.HAVE_CURRENT_DATA) {
      try {
        // Set canvas dimensions to match video
        canvas.width = video.videoWidth;
        canvas.height = video.videoHeight;
        
        // Draw video frame to canvas
        ctx?.drawImage(video, 0, 0, canvas.width, canvas.height);
        
        // Get image data for emotion detection
        const imageData = ctx?.getImageData(0, 0, canvas.width, canvas.height);
        if (!imageData) return;
        
        // Detect emotion
        const result = await this.emotionDetection.detectEmotion(imageData);
        if (result) {
          this.detectedEmotion = result.emotion;
        }
        
      } catch (error) {
        console.error('Error during emotion detection:', error);
      }
    }
    
    // Continue the detection loop if still active
    if (this.isDetecting) {
      this.animationFrameId = requestAnimationFrame(() => this.detectEmotion());
    }
  }

  onImageSelected(event: Event) {
    const target = event.target as HTMLInputElement;
    if (target.files && target.files[0]) {
      this.selectedImage = target.files[0];
      
      // Create preview
      const reader = new FileReader();
      reader.onload = (e) => {
        this.imagePreview = e.target?.result as string;
      };
      reader.readAsDataURL(this.selectedImage);
    }
  }

  async detectImageEmotion() {
    if (!this.selectedImage) return;

    try {
      console.log('Starting emotion detection...');
      const img = new Image();
      img.src = this.imagePreview!;
      
      await new Promise((resolve) => {
        img.onload = resolve;
      });

      const canvas = document.createElement('canvas');
      canvas.width = img.width;
      canvas.height = img.height;
      const ctx = canvas.getContext('2d');
      
      if (ctx) {
        console.log('Processing image...');
        // Draw the image at its original size
        ctx.drawImage(img, 0, 0, canvas.width, canvas.height);
        const imageData = ctx.getImageData(0, 0, canvas.width, canvas.height);
        
        // Convert to grayscale
        const data = imageData.data;
        for (let i = 0; i < data.length; i += 4) {
          const avg = (data[i] + data[i + 1] + data[i + 2]) / 3;
          data[i] = data[i + 1] = data[i + 2] = avg;
        }

        // Create a simple emotion detection based on average brightness
        const totalBrightness = data.reduce((sum, value, index) => {
          return (index % 4 === 0) ? sum + value : sum;
        }, 0);
        const avgBrightness = totalBrightness / (data.length / 4);

        // Simple emotion detection based on brightness
        let emotion = 'neutral';
        if (avgBrightness < 50) emotion = 'angry';
        else if (avgBrightness < 100) emotion = 'sad';
        else if (avgBrightness < 150) emotion = 'neutral';
        else if (avgBrightness < 200) emotion = 'happy';
        else emotion = 'surprise';

        this.imageEmotion = { emotion: emotion };
        console.log('Detected emotion:', this.imageEmotion);
      }
    } catch (error) {
      console.error('Error detecting emotion from image:', error);
    }
  }

  stopEmotionDetection() {
    this.isDetecting = false;
    this.showModal = false;
    
    // Stop the detection loop
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
    
    // Stop the webcam stream
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
      this.stream = null;
    }
    
    // Clear the video element
    if (this.videoElement?.nativeElement.srcObject) {
      this.videoElement.nativeElement.srcObject = null;
    }
    
    this.detectedEmotion = null;
  }

  logout(): void {
    this.stopEmotionDetection();
    this.router.navigate(['/login']);
  }

  ngOnDestroy() {
    this.stopEmotionDetection();
    this.emotionDetection.cleanup();
  }
}
