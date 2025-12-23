import React, { useState, useRef, useEffect } from 'react';
import { Project } from '@/types/project';
import { cn } from '@/lib/utils';
import { Play, Eye, MapPin, Calendar } from 'lucide-react';
import { useTilt } from '@/hooks/useTilt';
import { useScrollReveal } from '@/hooks/useScrollReveal';

interface ProjectCardProps {
  project: Project;
  index: number;
  onClick: () => void;
}

const ProjectCard: React.FC<ProjectCardProps> = ({
  project,
  index,
  onClick,
}) => {
  const [isImageLoaded, setIsImageLoaded] = useState(false);
  const [isHovering, setIsHovering] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const tiltRef = useTilt<HTMLDivElement>({ maxTilt: 8, scale: 1.02 });
  const { ref: revealRef, isVisible } = useScrollReveal({ threshold: 0.15 });

  const thumbnail = project.media[0];
  const isVideo = thumbnail?.type === 'video';
  const aspectRatio = thumbnail?.aspectRatio || (Math.random() > 0.5 ? 1.2 : 0.8);

  // Handle video preview on hover
  useEffect(() => {
    if (!videoRef.current || !isVideo) return;

    if (isHovering) {
      videoRef.current.play().catch(() => {});
    } else {
      videoRef.current.pause();
      videoRef.current.currentTime = 0;
    }
  }, [isHovering, isVideo]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' || e.key === ' ') {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <div
      ref={revealRef}
      className="masonry-item"
      style={{
        animationDelay: `${index * 80}ms`,
      }}
    >
      <article
        ref={tiltRef}
        className={cn(
          'project-card group cursor-pointer',
          'transition-all duration-500',
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        )}
        style={{
          transitionDelay: `${index * 80}ms`,
        }}
        onClick={onClick}
        onKeyDown={handleKeyDown}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
        role="button"
        tabIndex={0}
        aria-label={`View ${project.title} project details`}
      >
        {/* Media Container */}
        <figure
          className="relative overflow-hidden rounded-t-xl"
          style={{ aspectRatio }}
        >
          {/* Loading skeleton */}
          {!isImageLoaded && (
            <div className="absolute inset-0 skeleton animate-pulse" />
          )}

          {/* Image or Video Thumbnail */}
          {isVideo ? (
            <>
              {/* Poster image shown by default */}
              <img
                src={thumbnail.thumbnail || thumbnail.src}
                alt={thumbnail.alt || project.title}
                loading="lazy"
                className={cn(
                  'absolute inset-0 w-full h-full object-cover transition-all duration-700',
                  isHovering ? 'opacity-0' : 'opacity-100',
                  isImageLoaded ? 'visible' : 'invisible'
                )}
                onLoad={() => setIsImageLoaded(true)}
              />
              {/* Video plays on hover */}
              <video
                ref={videoRef}
                src={thumbnail.src}
                poster={thumbnail.thumbnail}
                muted
                loop
                playsInline
                className={cn(
                  'w-full h-full object-cover transition-all duration-700',
                  isHovering ? 'opacity-100 scale-110' : 'opacity-0 scale-100'
                )}
                onLoadedData={() => setIsImageLoaded(true)}
                aria-hidden="true"
              />
              {/* Play icon overlay - always visible for video cards */}
              <div className={cn(
                "absolute inset-0 flex items-center justify-center pointer-events-none transition-opacity duration-300",
                isHovering ? "opacity-0" : "opacity-100"
              )}>
                <div className="w-16 h-16 rounded-full bg-background/80 backdrop-blur-sm flex items-center justify-center border border-primary/30 shadow-lg">
                  <Play className="w-7 h-7 text-primary ml-1" fill="currentColor" />
                </div>
              </div>
            </>
          ) : (
            <img
              src={thumbnail?.src}
              alt={thumbnail?.alt || project.title}
              loading="lazy"
              className={cn(
                'w-full h-full object-cover transition-all duration-700',
                isHovering ? 'scale-110' : 'scale-100',
                isImageLoaded ? 'opacity-100' : 'opacity-0'
              )}
              onLoad={() => setIsImageLoaded(true)}
            />
          )}

          {/* Hover overlay with View Details */}
          <div
            className={cn(
              'absolute inset-0 bg-gradient-to-t from-background/90 via-background/40 to-transparent',
              'flex items-end justify-center pb-6',
              'opacity-0 group-hover:opacity-100 transition-opacity duration-300'
            )}
          >
            <span className="ripple-btn flex items-center gap-2 px-5 py-2.5 rounded-full bg-primary text-primary-foreground font-semibold text-sm glow-primary">
              <Eye className="w-4 h-4" />
              View Details
            </span>
          </div>

          {/* Category badge */}
          <div className="absolute top-3 left-3">
            <span className="px-3 py-1 text-xs font-medium rounded-full glass-card text-primary">
              {project.categoryLabel}
            </span>
          </div>
        </figure>

        {/* Card Content */}
        <figcaption className="p-4 space-y-2">
          <h3 className="font-display font-semibold text-lg text-foreground group-hover:text-primary transition-colors line-clamp-2">
            {project.title}
          </h3>

          <div className="flex items-center justify-between text-sm text-muted-foreground">
            <span className="flex items-center gap-1.5">
              <MapPin className="w-3.5 h-3.5 text-primary/70" />
              {project.location}
            </span>
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-primary/70" />
              {project.year}
            </span>
          </div>
        </figcaption>
      </article>
    </div>
  );
};

export default ProjectCard;
