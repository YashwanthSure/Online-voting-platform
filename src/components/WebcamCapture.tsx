
import React, { useRef, useState, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Camera } from "lucide-react";

interface WebcamCaptureProps {
  onCapture: (photoData: string) => void;
}

const WebcamCapture: React.FC<WebcamCaptureProps> = ({ onCapture }) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isStreamActive, setIsStreamActive] = useState(false);
  const [capturedImage, setCapturedImage] = useState<string | null>(null);

  const startCamera = useCallback(async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        video: true,
        audio: false,
      });
      
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        setIsStreamActive(true);
      }
    } catch (error) {
      console.error("Error accessing camera:", error);
    }
  }, []);

  const stopCamera = useCallback(() => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject as MediaStream;
      const tracks = stream.getTracks();
      
      tracks.forEach((track) => {
        track.stop();
      });
      
      videoRef.current.srcObject = null;
      setIsStreamActive(false);
    }
  }, []);

  const capturePhoto = useCallback(() => {
    if (videoRef.current && canvasRef.current) {
      const video = videoRef.current;
      const canvas = canvasRef.current;
      
      canvas.width = video.videoWidth;
      canvas.height = video.videoHeight;
      
      const context = canvas.getContext("2d");
      if (context) {
        context.drawImage(video, 0, 0, canvas.width, canvas.height);
        const photoData = canvas.toDataURL("image/png");
        setCapturedImage(photoData);
        onCapture(photoData);
        stopCamera();
      }
    }
  }, [onCapture, stopCamera]);

  const retakePhoto = useCallback(() => {
    setCapturedImage(null);
    startCamera();
  }, [startCamera]);

  React.useEffect(() => {
    startCamera();
    return () => {
      stopCamera();
    };
  }, [startCamera, stopCamera]);

  return (
    <div className="space-y-4">
      <div className="webcam-container">
        {!capturedImage ? (
          <>
            <video
              ref={videoRef}
              autoPlay
              playsInline
              className="webcam-video"
            />
            {isStreamActive && (
              <>
                <div className="webcam-overlay"></div>
                <div className="capture-button">
                  <Button 
                    size="icon" 
                    onClick={capturePhoto} 
                    variant="outline"
                    className="rounded-full h-12 w-12"
                  >
                    <Camera className="h-6 w-6" />
                  </Button>
                </div>
              </>
            )}
          </>
        ) : (
          <div className="relative">
            <img 
              src={capturedImage} 
              alt="Captured" 
              className="photo-preview"
            />
            <div className="mt-2 flex justify-center">
              <Button onClick={retakePhoto} variant="outline">
                Retake Photo
              </Button>
            </div>
          </div>
        )}
      </div>
      <canvas ref={canvasRef} style={{ display: "none" }} />
    </div>
  );
};

export default WebcamCapture;
