import React, { useEffect, useCallback, useState, useRef } from 'react';
import { Project, ProjectMedia } from '@/types/project';
import { cn } from '@/lib/utils';
import {
  X,
  ChevronLeft,
  ChevronRight,
  Play,
  Pause,
  Volume2,
  VolumeX,
  Maximize2,
  MapPin,
  Calendar,
} from 'lucide-react';

interface LightboxProps {
  project: Project;
  isOpen: boolean;
  onClose: () => void;
}

const Lightbox: React.FC<LightboxProps> = ({ project, isOpen, onClose }) => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  const currentMedia = project.media[currentIndex];
  const isVideo = currentMedia?.type === 'video';
  const totalMedia = project.media.length;

  const goToNext = useCallback(() => {
    setIsLoaded(false);
    setCurrentIndex((prev) => (prev + 1) % totalMedia);
  }, [totalMedia]);

  const goToPrev = useCallback(() => {
    setIsLoaded(false);
    setCurrentIndex((prev) => (prev - 1 + totalMedia) % totalMedia);
  }, [totalMedia]);

  // Keyboard navigation
  useEffect(() => {
    if (!isOpen) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      switch (e.key) {
        case 'Escape':
          onClose();
          break;
        case 'ArrowRight':
          goToNext();
          break;
        case 'ArrowLeft':
          goToPrev();
          break;
        case ' ':
          e.preventDefault();
          if (isVideo && videoRef.current) {
            if (videoRef.current.paused) {
              videoRef.current.play();
              setIsPlaying(true);
            } else {
              videoRef.current.pause();
              setIsPlaying(false);
            }
          }
          break;
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose, goToNext, goToPrev, isVideo]);

  // Lock body scroll when open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = '';
    }
    return () => {
      document.body.style.overflow = '';
    };
  }, [isOpen]);

  // Reset state when project changes
  useEffect(() => {
    setCurrentIndex(0);
    setIsLoaded(false);
    setIsPlaying(false);
  }, [project.id]);

  // Auto-play video when it becomes current
  useEffect(() => {
    if (isVideo && videoRef.current && isOpen) {
      videoRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
  }, [currentIndex, isVideo, isOpen]);

  const togglePlay = () => {
    if (!videoRef.current) return;
    if (videoRef.current.paused) {
      videoRef.current.play();
      setIsPlaying(true);
    } else {
      videoRef.current.pause();
      setIsPlaying(false);
    }
  };

  const toggleMute = () => {
    if (!videoRef.current) return;
    videoRef.current.muted = !videoRef.current.muted;
    setIsMuted(!isMuted);
  };

  const toggleFullscreen = () => {
    if (!containerRef.current) return;
    if (document.fullscreenElement) {
      document.exitFullscreen();
    } else {
      containerRef.current.requestFullscreen();
    }
  };

  if (!isOpen) return null;

  return (
    <div
      ref={containerRef}
      className="lightbox-overlay"
      role="dialog"
      aria-modal="true"
      aria-label={`${project.title} gallery`}
    >
      {/* Background click to close */}
      <div
        className="absolute inset-0"
        onClick={onClose}
        aria-hidden="true"
      />

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-4 right-4 z-50 p-3 rounded-full glass-card hover:glow-primary transition-all"
        aria-label="Close gallery"
      >
        <X className="w-6 h-6 text-foreground" />
      </button>

      {/* Fullscreen button */}
      <button
        onClick={toggleFullscreen}
        className="absolute top-4 right-20 z-50 p-3 rounded-full glass-card hover:glow-primary transition-all"
        aria-label="Toggle fullscreen"
      >
        <Maximize2 className="w-5 h-5 text-foreground" />
      </button>

      {/* Main content */}
      <div className="relative z-10 w-full max-w-6xl mx-auto px-4 flex flex-col items-center">
        {/* Media display */}
        <div className="relative w-full aspect-video rounded-xl overflow-hidden glass-card">
          {/* Loading state */}
          {!isLoaded && (
            <div className="absolute inset-0 flex items-center justify-center bg-muted">
              <div className="w-12 h-12 border-4 border-primary/30 border-t-primary rounded-full animate-spin" />
            </div>
          )}

          {isVideo ? (
            <video
              ref={videoRef}
              src={currentMedia.src}
              poster={currentMedia.thumbnail}
              muted={isMuted}
              loop
              playsInline
              className={cn(
                'w-full h-full object-contain transition-opacity duration-300',
                isLoaded ? 'opacity-100' : 'opacity-0'
              )}
              onLoadedData={() => setIsLoaded(true)}
              onClick={togglePlay}
            />
          ) : (
            <img
              src={currentMedia?.src}
              alt={currentMedia?.alt}
              className={cn(
                'w-full h-full object-contain transition-opacity duration-300',
                isLoaded ? 'opacity-100' : 'opacity-0'
              )}
              onLoad={() => setIsLoaded(true)}
            />
          )}

          {/* Video controls */}
          {isVideo && isLoaded && (
            <div className="absolute bottom-4 left-4 right-4 flex items-center gap-3">
              <button
                onClick={togglePlay}
                className="p-2 rounded-full glass-card hover:glow-primary transition-all"
                aria-label={isPlaying ? 'Pause video' : 'Play video'}
              >
                {isPlaying ? (
                  <Pause className="w-5 h-5 text-foreground" />
                ) : (
                  <Play className="w-5 h-5 text-foreground" />
                )}
              </button>
              <button
                onClick={toggleMute}
                className="p-2 rounded-full glass-card hover:glow-primary transition-all"
                aria-label={isMuted ? 'Unmute video' : 'Mute video'}
              >
                {isMuted ? (
                  <VolumeX className="w-5 h-5 text-foreground" />
                ) : (
                  <Volume2 className="w-5 h-5 text-foreground" />
                )}
              </button>
            </div>
          )}
        </div>

        {/* Navigation arrows */}
        {totalMedia > 1 && (
          <>
            <button
              onClick={goToPrev}
              className="absolute left-4 top-1/2 -translate-y-1/2 p-3 rounded-full glass-card hover:glow-primary transition-all"
              aria-label="Previous media"
            >
              <ChevronLeft className="w-6 h-6 text-foreground" />
            </button>
            <button
              onClick={goToNext}
              className="absolute right-4 top-1/2 -translate-y-1/2 p-3 rounded-full glass-card hover:glow-primary transition-all"
              aria-label="Next media"
            >
              <ChevronRight className="w-6 h-6 text-foreground" />
            </button>
          </>
        )}

        {/* Project info */}
        <div className="mt-6 text-center">
          <h2 className="font-display text-2xl md:text-3xl font-bold text-foreground text-glow">
            {project.title}
          </h2>
          <div className="flex items-center justify-center gap-6 mt-3 text-muted-foreground">
            <span className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-primary" />
              {project.location}
            </span>
            <span className="flex items-center gap-2">
              <Calendar className="w-4 h-4 text-primary" />
              {project.year}
            </span>
          </div>
        </div>

        {/* Thumbnail strip */}
        {totalMedia > 1 && (
          <div className="flex gap-2 mt-6 overflow-x-auto scrollbar-thin py-2 px-1 max-w-full">
            {project.media.map((media, idx) => (
              <button
                key={media.id}
                onClick={() => {
                  setIsLoaded(false);
                  setCurrentIndex(idx);
                }}
                className={cn(
                  'relative flex-shrink-0 w-16 h-16 rounded-lg overflow-hidden transition-all duration-300',
                  idx === currentIndex
                    ? 'ring-2 ring-primary glow-primary'
                    : 'opacity-60 hover:opacity-100'
                )}
                aria-label={`Go to ${media.type === 'video' ? 'video' : 'image'} ${idx + 1}`}
                aria-current={idx === currentIndex ? 'true' : 'false'}
              >
                <img
                  src={media.thumbnail || media.src}
                  alt=""
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                {media.type === 'video' && (
                  <div className="absolute inset-0 flex items-center justify-center bg-background/40">
                    <Play className="w-4 h-4 text-primary" fill="currentColor" />
                  </div>
                )}
              </button>
            ))}
          </div>
        )}

        {/* Counter */}
        <div className="mt-4 text-sm text-muted-foreground">
          {currentIndex + 1} / {totalMedia}
        </div>
      </div>
    </div>
  );
};

export default Lightbox;
