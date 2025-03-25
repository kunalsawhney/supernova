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
}

export function VideoRenderer({
  src,
  title,
  lessonId,
  transcript,
  thumbnailUrl,
  showCaptions = false
}: VideoRendererProps) {
  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerRef = useRef<HTMLDivElement>(null);
  const controlsTimeout = useRef<NodeJS.Timeout>();
  
  // Context
  const { updateProgress, lessonProgress, markComplete } = useCoursePlayer();
  
  // State
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [volume, setVolume] = useState(1);
  const [isMuted, setIsMuted] = useState(false);
  const [showControls, setShowControls] = useState(true);
  const [playbackRate, setPlaybackRate] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [showVolumeSlider, setShowVolumeSlider] = useState(false);
  const [showTranscript, setShowTranscript] = useState(false);
  const [showCaption, setShowCaption] = useState(showCaptions);
  
  // Load video details on mount
  useEffect(() => {
    if (!videoRef.current) return;
    
    const savedProgress = lessonProgress[lessonId];
    if (savedProgress?.lastPosition) {
      videoRef.current.currentTime = savedProgress.lastPosition;
      setCurrentTime(savedProgress.lastPosition);
    }
    
    // Set saved volume if available
    const savedVolume = localStorage.getItem('videoVolume');
    if (savedVolume) {
      const volumeValue = parseFloat(savedVolume);
      setVolume(volumeValue);
      setIsMuted(volumeValue === 0);
      if (videoRef.current) {
        videoRef.current.volume = volumeValue;
      }
    }
  }, [lessonId, lessonProgress]);
  
  // Handle video events
  const handleMetadataLoaded = () => {
    if (!videoRef.current) return;
    setDuration(videoRef.current.duration);
  };
  
  const handleTimeUpdate = () => {
    if (!videoRef.current) return;
    
    const newTime = videoRef.current.currentTime;
    setCurrentTime(newTime);
    
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
      videoRef.current.play();
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
      localStorage.setItem('videoVolume', '0');
    } else {
      // Restore previous volume or set to 1
      const previousVolume = localStorage.getItem('videoVolume') || '1';
      const volumeValue = previousVolume === '0' ? 1 : parseFloat(previousVolume);
      videoRef.current.volume = volumeValue;
      setVolume(volumeValue);
      localStorage.setItem('videoVolume', volumeValue.toString());
    }
  };
  
  const handleVolumeChange = (newValue: number[]) => {
    if (!videoRef.current) return;
    
    const volumeValue = newValue[0];
    setVolume(volumeValue);
    videoRef.current.volume = volumeValue;
    setIsMuted(volumeValue === 0);
    localStorage.setItem('videoVolume', volumeValue.toString());
  };
  
  const changePlaybackRate = (rate: number) => {
    if (!videoRef.current) return;
    
    videoRef.current.playbackRate = rate;
    setPlaybackRate(rate);
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
        />
        
        {/* Captions */}
        {showCaption && (
          <div className="absolute bottom-16 left-0 right-0 text-center">
            <div className="inline-block bg-black/70 px-3 py-1 rounded text-white text-sm">
              Captions will appear here
            </div>
          </div>
        )}
        
        {/* Controls overlay */}
        <motion.div 
          className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"
          initial={{ opacity: 1 }}
          animate={{ opacity: showControls ? 1 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Center play/pause button */}
          <button
            className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-16 h-16 flex items-center justify-center bg-primary/90 text-white rounded-full"
            onClick={togglePlay}
          >
            {isPlaying ? (
              <Pause className="h-8 w-8" />
            ) : (
              <Play className="h-8 w-8 ml-1" />
            )}
          </button>
          
          {/* Bottom controls */}
          <div className="absolute bottom-0 left-0 right-0 px-4 py-3">
            {/* Progress bar */}
            <div className="mb-2">
              <Slider
                value={[currentTime]}
                min={0}
                max={duration}
                step={0.1}
                onValueChange={handleSeek}
                className="h-1.5"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-3">
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-white"
                  onClick={togglePlay}
                >
                  {isPlaying ? (
                    <Pause className="h-5 w-5" />
                  ) : (
                    <Play className="h-5 w-5" />
                  )}
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-white"
                  onClick={skipBackward}
                >
                  <SkipBack className="h-5 w-5" />
                </Button>
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-white"
                  onClick={skipForward}
                >
                  <SkipForward className="h-5 w-5" />
                </Button>
                
                <div className="relative">
                  <Button 
                    variant="ghost" 
                    size="icon" 
                    className="text-white"
                    onClick={toggleMute}
                    onMouseEnter={() => setShowVolumeSlider(true)}
                    onMouseLeave={() => setShowVolumeSlider(false)}
                  >
                    {isMuted || volume === 0 ? (
                      <VolumeX className="h-5 w-5" />
                    ) : (
                      <Volume2 className="h-5 w-5" />
                    )}
                  </Button>
                  
                  {showVolumeSlider && (
                    <div 
                      className="absolute bottom-full left-0 mb-2 bg-black/90 p-3 rounded-md w-32"
                      onMouseEnter={() => setShowVolumeSlider(true)}
                      onMouseLeave={() => setShowVolumeSlider(false)}
                    >
                      <Slider
                        value={[volume]}
                        min={0}
                        max={1}
                        step={0.01}
                        onValueChange={handleVolumeChange}
                      />
                    </div>
                  )}
                </div>
                
                <span className="text-white text-sm">
                  {formatTime(currentTime)} / {formatTime(duration)}
                </span>
              </div>
              
              <div className="flex items-center space-x-2">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button 
                      variant="ghost" 
                      size="icon" 
                      className="text-white"
                    >
                      <Settings className="h-5 w-5" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuLabel>Playback Speed</DropdownMenuLabel>
                    <DropdownMenuSeparator />
                    {[0.5, 0.75, 1, 1.25, 1.5, 2].map(rate => (
                      <DropdownMenuItem
                        key={rate}
                        onClick={() => changePlaybackRate(rate)}
                        className={cn(playbackRate === rate && "bg-accent")}
                      >
                        {rate === 1 ? 'Normal' : `${rate}x`}
                      </DropdownMenuItem>
                    ))}
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={() => setShowCaption(!showCaption)}>
                      {showCaption ? 'Hide Captions' : 'Show Captions'}
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setShowTranscript(!showTranscript)}>
                      {showTranscript ? 'Hide Transcript' : 'Show Transcript'}
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
                
                <Button 
                  variant="ghost" 
                  size="icon" 
                  className="text-white"
                  onClick={toggleFullscreen}
                >
                  <Maximize2 className="h-5 w-5" />
                </Button>
              </div>
            </div>
          </div>
        </motion.div>
      </div>
      
      {/* Transcript section */}
      {showTranscript && transcript && (
        <div className="mt-4 p-4 border rounded-lg bg-muted/30">
          <h3 className="font-medium mb-2">Transcript</h3>
          <div className="max-h-48 overflow-y-auto text-sm">
            {transcript}
          </div>
        </div>
      )}
    </div>
  );
} 