import React, { useRef, useState, useEffect } from 'react';
import { 
  Play, Pause, Volume2, VolumeX, Maximize2, 
  SkipBack, SkipForward, Settings 
} from 'lucide-react';
import { motion } from 'framer-motion';

import { useCoursePlayer } from '@/contexts/CoursePlayerContext';
import { Button } from '@/components/ui/button';
import { Slider } from '@/components/ui/slider';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

interface VideoRendererProps {
  src: string;
  title: string;
  lessonId: string;
  transcript?: string;
  thumbnailUrl?: string;
  showCaptions?: boolean;
  onTimeUpdate?: (time: number) => void;
}

export function VideoRenderer({
  src,
  title,
  lessonId,
  transcript,
  thumbnailUrl,
  showCaptions = false,
  onTimeUpdate
}: VideoRendererProps) {
  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const controlsTimeout = useRef<NodeJS.Timeout | null>(null);
  
  // Context
  const { updateProgress, lessonProgress, markComplete, contentPreferences, updateContentPreferences } = useCoursePlayer();
  
  // State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(contentPreferences.volume);
  const [isMuted, setIsMuted] = useState(contentPreferences.volume === 0);
  const [showControls, setShowControls] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(contentPreferences.playbackSpeed);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [showCaption, setShowCaption] = useState(contentPreferences.captions || showCaptions);
  
  // Load video details on mount
  useEffect(() => {
    if (!videoRef.current) return;
    
    const savedProgress = lessonProgress[lessonId];
    if (savedProgress?.lastPosition) {
      videoRef.current.currentTime = savedProgress.lastPosition;
      setCurrentTime(savedProgress.lastPosition);
    }
    
    // Apply content preferences
    videoRef.current.volume = contentPreferences.volume;
    videoRef.current.playbackRate = contentPreferences.playbackSpeed;
    setPlaybackRate(contentPreferences.playbackSpeed);
    
    // Auto-play if configured
    if (contentPreferences.autoplay) {
      videoRef.current.play().catch(e => console.error('Auto-play failed:', e));
    }
  }, [lessonId, lessonProgress, contentPreferences]);
  
  // Handle keyboard shortcuts
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Check if this player has focus before handling shortcuts
      const isVideoOrPlayerFocused = document.activeElement === videoRef.current ||
                                    playerRef.current?.contains(document.activeElement);
      
      // Only process if no input/textarea is focused
      const activeElement = document.activeElement as HTMLElement;
      const isInputFocused = activeElement?.tagName === 'INPUT' || 
                            activeElement?.tagName === 'TEXTAREA';
      
      if (isInputFocused || !isVideoOrPlayerFocused) return;
      
      switch (e.key) {
        case ' ': // Space
        case 'k': // YouTube-style play/pause
          e.preventDefault();
          togglePlay();
          break;
        case 'ArrowLeft': // Left arrow to rewind
          e.preventDefault();
          skipBackward();
          break;
        case 'ArrowRight': // Right arrow to fast forward
          e.preventDefault();
          skipForward();
          break;
        case 'ArrowUp': // Up arrow to increase volume
          e.preventDefault();
          if (volume < 1) {
            const newVolume = Math.min(1, volume + 0.1);
            handleVolumeChange([newVolume]);
          }
          break;
        case 'ArrowDown': // Down arrow to decrease volume
          e.preventDefault();
          if (volume > 0) {
            const newVolume = Math.max(0, volume - 0.1);
            handleVolumeChange([newVolume]);
          }
          break;
        case 'm': // Mute
          e.preventDefault();
          toggleMute();
          break;
        case 'f': // Fullscreen
          e.preventDefault();
          toggleFullscreen();
          break;
        case '0':
        case '1':
        case '2':
        case '3':
        case '4':
        case '5':
        case '6':
        case '7':
        case '8':
        case '9':
          // Number keys to jump to percentage of video
          e.preventDefault();
          const percent = parseInt(e.key) * 10;
          if (videoRef.current) {
            const newTime = (percent / 100) * duration;
            seekTo(newTime);
          }
          break;
      }
    };
    
    // Add keyboard event listener
    window.addEventListener('keydown', handleKeyDown);
    
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [volume, duration]);
  
  // Handle video events
  const handleMetadataLoaded = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
  };
  
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    
    const newTime = videoRef.current.currentTime;
    setCurrentTime(newTime);
    
    // Call onTimeUpdate callback if provided
    if (onTimeUpdate) {
      onTimeUpdate(newTime);
    }
    
    // Calculate progress percentage
    const progressPercent = (newTime / duration) * 100;
    
    // Update progress in context
    updateProgress(lessonId, {
      progress: Math.round(progressPercent),
      lastPosition: newTime
    });
    
    // Mark as complete if 95% watched
    if (progressPercent >= 95 && !lessonProgress[lessonId]?.completed) {
      markComplete(lessonId);
    }
  };
  
  const handlePlay = () => {
    setIsPlaying(true);
  };
  
  const handlePause = () => {
    setIsPlaying(false);
  };
  
  const handleEnded = () => {
    setIsPlaying(false);
    markComplete(lessonId);
  };
  
  // Player controls
  const togglePlay = () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(e => console.error("Play failed:", e));
    }
  };
  
  const seekTo = (time: number) => {
    if (!videoRef.current) return;
    
    videoRef.current.currentTime = time;
    setCurrentTime(time);
  };
  
  const handleSeek = (newValue: number[]) => {
    seekTo(newValue[0]);
  };
  
  const skipForward = () => {
    if (!videoRef.current) return;
    seekTo(Math.min(videoRef.current.currentTime + 10, duration));
  };
  
  const skipBackward = () => {
    if (!videoRef.current) return;
    seekTo(Math.max(videoRef.current.currentTime - 10, 0));
  };
  
  const toggleMute = () => {
    if (!videoRef.current) return;
    
    const newMuted = !isMuted;
    setIsMuted(newMuted);
    videoRef.current.muted = newMuted;
    
    // Also set volume to 0 when muted
    if (newMuted) {
      videoRef.current.volume = 0;
      setVolume(0);
      // Update global preferences
      updateContentPreferences({ volume: 0 });
    } else {
      // Restore previous volume or set to 1
      const previousVolume = volume === 0 ? 1 : volume;
      videoRef.current.volume = previousVolume;
      setVolume(previousVolume);
      // Update global preferences
      updateContentPreferences({ volume: previousVolume });
    }
  };
  
  const handleVolumeChange = (newValue: number[]) => {
    if (!videoRef.current) return;
    
    const volumeValue = newValue[0];
    setVolume(volumeValue);
    videoRef.current.volume = volumeValue;
    setIsMuted(volumeValue === 0);
    
    // Update global preferences
    updateContentPreferences({ volume: volumeValue });
  };
  
  const changePlaybackRate = (rate: number) => {
    if (!videoRef.current) return;
    
    videoRef.current.playbackRate = rate;
    setPlaybackRate(rate);
    
    // Update global preferences
    updateContentPreferences({ playbackSpeed: rate });
  };
  
  const toggleFullscreen = () => {
    if (!playerRef.current) return;
    
    if (!document.fullscreenElement) {
      playerRef.current.requestFullscreen().then(() => {
        setIsFullscreen(true);
      }).catch(err => {
        console.error(`Error attempting to enable fullscreen: ${err.message}`);
      });
    } else {
      document.exitFullscreen().then(() => {
        setIsFullscreen(false);
      }).catch(err => {
        console.error(`Error attempting to exit fullscreen: ${err.message}`);
      });
    }
  };
  
  // Toggle captions
  const toggleCaptions = () => {
    setShowCaption(!showCaption);
    updateContentPreferences({ captions: !showCaption });
  };
  
  // Hide controls after inactivity
  const handlePlayerMouseMove = () => {
    setShowControls(true);
    
    if (controlsTimeout.current) {
      clearTimeout(controlsTimeout.current);
    }
    
    controlsTimeout.current = setTimeout(() => {
      if (isPlaying) {
        setShowControls(false);
      }
    }, 3000);
  };
  
  // Format time (seconds to MM:SS)
  const formatTime = (seconds: number): string => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  
  // Generate playback rate options with current selection
  const playbackRateOptions = [0.5, 0.75, 1, 1.25, 1.5, 1.75, 2].map(rate => ({
    value: rate,
    label: `${rate}x`,
    active: rate === playbackRate
  }));
  
  return (
    <div className="flex flex-col">
      <div 
        ref={playerRef}
        className={cn(
          "relative bg-black rounded-lg overflow-hidden",
          isFullscreen ? "w-screen h-screen" : "aspect-video"
        )}
        onMouseMove={handlePlayerMouseMove}
        onMouseLeave={() => isPlaying && setShowControls(false)}
        tabIndex={0}
        aria-label={`Video player: ${title}`}
        role="application"
      >
        {/* Video element */}
        <video
          ref={videoRef}
          src={src}
          className="w-full h-full"
          poster={thumbnailUrl}
          onLoadedMetadata={handleMetadataLoaded}
          onTimeUpdate={handleTimeUpdate}
          onPlay={handlePlay}
          onPause={handlePause}
          onEnded={handleEnded}
          onClick={togglePlay}
          aria-label={title}
          playsInline
        >
          {/* Captions support */}
          {transcript && (
            <track 
              kind="captions" 
              src={transcript} 
              label="English" 
              srcLang="en"
              default={showCaption}
            />
          )}
        </video>
        
        {/* Play/pause overlay button */}
        <div 
          className={cn(
            "absolute inset-0 flex items-center justify-center transition-opacity",
            (isPlaying && !showControls) ? "opacity-0" : "opacity-100",
            "cursor-pointer"
          )}
          onClick={togglePlay}
          aria-hidden="true"
        >
          {!isPlaying && (
            <motion.div
              initial={{ scale: 0.5, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.5, opacity: 0 }}
              className="bg-black/30 rounded-full p-4 backdrop-blur-sm"
            >
              <Play className="h-12 w-12 text-white" fill="white" />
            </motion.div>
          )}
        </div>
        
        {/* Controls overlay */}
        <div 
          className={cn(
            "absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent p-4 transition-opacity",
            (!showControls && isPlaying) ? "opacity-0" : "opacity-100"
          )}
        >
          {/* Progress bar */}
          <div className="mb-2 px-1">
            <Slider 
              value={[currentTime]} 
              min={0} 
              max={duration || 100}
              step={0.01}
              onValueChange={handleSeek}
              aria-label="Video progress"
              aria-valuetext={`${formatTime(currentTime)} of ${formatTime(duration)}`}
              aria-valuemin={0}
              aria-valuemax={duration}
              aria-valuenow={currentTime}
            />
          </div>
          
          {/* Controls */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              {/* Play/Pause */}
              <Button
                variant="ghost"
                size="icon"
                onClick={togglePlay}
                className="text-white hover:bg-white/20"
                aria-label={isPlaying ? "Pause" : "Play"}
              >
                {isPlaying ? 
                  <Pause className="h-5 w-5" /> : 
                  <Play className="h-5 w-5" />
                }
              </Button>
              
              {/* Skip backward */}
              <Button
                variant="ghost"
                size="icon"
                onClick={skipBackward}
                className="text-white hover:bg-white/20"
                aria-label="Skip backward 10 seconds"
              >
                <SkipBack className="h-5 w-5" />
                <span className="sr-only">Skip backward 10 seconds</span>
              </Button>
              
              {/* Skip forward */}
              <Button
                variant="ghost"
                size="icon"
                onClick={skipForward}
                className="text-white hover:bg-white/20"
                aria-label="Skip forward 10 seconds"
              >
                <SkipForward className="h-5 w-5" />
                <span className="sr-only">Skip forward 10 seconds</span>
              </Button>
              
              {/* Volume */}
              <div className="relative flex items-center"
                onMouseEnter={() => setShowVolumeSlider(true)}
                onMouseLeave={() => setShowVolumeSlider(false)}
              >
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={toggleMute}
                  className="text-white hover:bg-white/20"
                  aria-label={isMuted ? "Unmute" : "Mute"}
                >
                  {isMuted ? 
                    <VolumeX className="h-5 w-5" /> : 
                    <Volume2 className="h-5 w-5" />
                  }
                </Button>
                
                {showVolumeSlider && (
                  <div className="absolute left-full ml-2 bg-black/80 rounded p-2 w-24 z-50">
                    <Slider
                      value={[volume]}
                      min={0}
                      max={1}
                      step={0.01}
                      onValueChange={handleVolumeChange}
                      aria-label="Volume"
                      aria-valuetext={`Volume ${Math.round(volume * 100)}%`}
                    />
                  </div>
                )}
              </div>
              
              {/* Time display */}
              <div className="text-sm text-white">
                <span>{formatTime(currentTime)}</span>
                <span className="mx-1">/</span>
                <span>{formatTime(duration)}</span>
              </div>
            </div>
            
            <div className="flex items-center space-x-2">
              {/* Captions toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={toggleCaptions}
                className={cn(
                  "text-white hover:bg-white/20 text-xs h-8",
                  showCaption && "bg-white/20"
                )}
                aria-label={showCaption ? "Hide captions" : "Show captions"}
                aria-pressed={showCaption}
              >
                CC
              </Button>
              
              {/* Playback speed */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:bg-white/20 text-xs h-8"
                    aria-label="Playback speed"
                  >
                    {playbackRate}x
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-32">
                  <DropdownMenuLabel>Playback Speed</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  {playbackRateOptions.map(option => (
                    <DropdownMenuItem
                      key={option.value}
                      onClick={() => changePlaybackRate(option.value)}
                      className={option.active ? "bg-muted" : ""}
                    >
                      {option.label}
                      {option.active && <span className="ml-auto">✓</span>}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              
              {/* Fullscreen */}
              <Button
                variant="ghost"
                size="icon"
                onClick={toggleFullscreen}
                className="text-white hover:bg-white/20"
                aria-label={isFullscreen ? "Exit fullscreen" : "Fullscreen"}
              >
                <Maximize2 className="h-5 w-5" />
              </Button>
            </div>
          </div>
        </div>
      </div>
      
      {/* Video transcript section (toggle on demand) */}
      {transcript && showTranscript && (
        <div className="mt-4 p-4 border rounded-lg bg-muted/20">
          <h3 className="font-medium mb-2">Transcript</h3>
          <div className="max-h-40 overflow-y-auto">
            <p>{transcript}</p>
          </div>
        </div>
      )}
      
      {/* Video info (optional) */}
      <div className="mt-4">
        <Button 
          variant="outline" 
          size="sm" 
          onClick={() => setShowTranscript(!showTranscript)}
          disabled={!transcript}
          className="text-xs"
          aria-pressed={showTranscript}
          aria-disabled={!transcript}
        >
          {showTranscript ? "Hide Transcript" : "Show Transcript"}
        </Button>
      </div>
      
      {/* Keyboard shortcuts help */}
      <div className="mt-4 grid grid-cols-2 gap-2 text-xs text-muted-foreground">
        <div>
          <kbd className="px-1 border rounded">Space</kbd> or <kbd className="px-1 border rounded">k</kbd>: Play/Pause
        </div>
        <div>
          <kbd className="px-1 border rounded">←</kbd> / <kbd className="px-1 border rounded">→</kbd>: -10s / +10s
        </div>
        <div>
          <kbd className="px-1 border rounded">m</kbd>: Mute/Unmute
        </div>
        <div>
          <kbd className="px-1 border rounded">f</kbd>: Fullscreen
        </div>
      </div>
    </div>
  );
} 