import React, { useState, useEffect, useRef } from 'react';
import { Save, Bookmark, Clock, Tag, Info, X, Plus, Trash2 } from 'lucide-react';
import { motion } from 'framer-motion';

import { useCoursePlayer } from '@/contexts/CoursePlayerContext';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Separator } from '@/components/ui/separator';
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

interface NoteTakingPanelProps {
  lessonId: string;
  contentType: 'video' | 'reading' | 'quiz' | 'project' | 'discussion';
  currentTime?: number; // For video notes
}

interface TimeStampedNote {
  id: string;
  timestamp: number;
  text: string;
  tag?: string;
}

interface Note {
  id: string;
  text: string;
  tag?: string;
  timeStamps?: TimeStampedNote[];
  createdAt: string;
  updatedAt: string;
}

export function NoteTakingPanel({
  lessonId,
  contentType,
  currentTime
}: NoteTakingPanelProps) {
  // State
  const [currentNote, setCurrentNote] = useState<string>('');
  const [notes, setNotes] = useState<Note[]>([]);
  const [selectedTag, setSelectedTag] = useState<string | null>(null);
  const [currentTab, setCurrentTab] = useState('notes');
  
  // Refs
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  
  // Context
  const { saveNote, getNotes } = useCoursePlayer();
  
  // Load saved notes on mount
  useEffect(() => {
    try {
      const savedNotesString = getNotes(lessonId);
      if (savedNotesString) {
        const savedNotes = JSON.parse(savedNotesString);
        if (Array.isArray(savedNotes)) {
          setNotes(savedNotes);
        }
      }
    } catch (error) {
      console.error('Error loading notes:', error);
    }
  }, [lessonId, getNotes]);
  
  // Generate tags from notes
  const getTags = () => {
    const tags = new Set<string>();
    notes.forEach(note => {
      if (note.tag) tags.add(note.tag);
      if (note.timeStamps) {
        note.timeStamps.forEach(ts => {
          if (ts.tag) tags.add(ts.tag);
        });
      }
    });
    return Array.from(tags);
  };
  
  // Save all notes to context
  const saveAllNotes = () => {
    saveNote(lessonId, JSON.stringify(notes));
  };
  
  // Watch for changes and save
  useEffect(() => {
    if (notes.length > 0) {
      saveAllNotes();
    }
  }, [notes]);
  
  // Format timestamp (seconds to MM:SS)
  const formatTimestamp = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };
  
  // Add new note
  const addNote = () => {
    if (!currentNote.trim()) return;
    
    const newNote: Note = {
      id: Date.now().toString(),
      text: currentNote,
      tag: selectedTag || undefined,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };
    
    // For video content, add timestamp if available
    if (contentType === 'video' && currentTime !== undefined) {
      newNote.timeStamps = [{
        id: `${newNote.id}-ts-0`,
        timestamp: currentTime,
        text: currentNote
      }];
    }
    
    setNotes(prev => [newNote, ...prev]);
    setCurrentNote('');
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
  };
  
  // Add timestamp to existing note (for videos)
  const addTimestamp = (noteId: string) => {
    if (currentTime === undefined) return;
    
    setNotes(prev => prev.map(note => {
      if (note.id === noteId) {
        const timeStamps = note.timeStamps || [];
        const newTimestamp: TimeStampedNote = {
          id: `${note.id}-ts-${timeStamps.length}`,
          timestamp: currentTime,
          text: `Timestamp at ${formatTimestamp(currentTime)}`
        };
        
        return {
          ...note,
          timeStamps: [...timeStamps, newTimestamp],
          updatedAt: new Date().toISOString()
        };
      }
      return note;
    }));
  };
  
  // Delete a note
  const deleteNote = (noteId: string) => {
    setNotes(prev => prev.filter(note => note.id !== noteId));
  };
  
  // Delete a timestamp from a note
  const deleteTimestamp = (noteId: string, timestampId: string) => {
    setNotes(prev => prev.map(note => {
      if (note.id === noteId && note.timeStamps) {
        return {
          ...note,
          timeStamps: note.timeStamps.filter(ts => ts.id !== timestampId),
          updatedAt: new Date().toISOString()
        };
      }
      return note;
    }));
  };
  
  // Update note text
  const updateNoteText = (noteId: string, newText: string) => {
    setNotes(prev => prev.map(note => {
      if (note.id === noteId) {
        return {
          ...note,
          text: newText,
          updatedAt: new Date().toISOString()
        };
      }
      return note;
    }));
  };
  
  // Set note tag
  const setNoteTag = (noteId: string, tag: string) => {
    setNotes(prev => prev.map(note => {
      if (note.id === noteId) {
        return {
          ...note,
          tag,
          updatedAt: new Date().toISOString()
        };
      }
      return note;
    }));
  };
  
  // Filter notes by tag
  const filteredNotes = selectedTag 
    ? notes.filter(note => note.tag === selectedTag)
    : notes;
  
  return (
    <div className="flex flex-col h-full">
      <div className="border-b p-3">
        <h3 className="font-medium mb-2">My Notes</h3>
        <textarea
          ref={textareaRef}
          value={currentNote}
          onChange={(e) => setCurrentNote(e.target.value)}
          placeholder="Take notes here..."
          className="w-full p-2 border rounded-md text-sm resize-none focus:outline-none focus:ring-1 focus:ring-primary"
          rows={3}
        />
        <div className="flex justify-between items-center mt-2">
          <div className="flex gap-1">
            {contentType === 'video' && currentTime !== undefined && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setCurrentNote(prev => 
                    `${prev}${prev ? '\n' : ''}[${formatTimestamp(currentTime)}] `
                  );
                  if (textareaRef.current) {
                    textareaRef.current.focus();
                  }
                }}
                className="flex items-center gap-1 text-xs h-8"
              >
                <Clock className="h-3 w-3" />
                {formatTimestamp(currentTime)}
              </Button>
            )}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1 text-xs h-8"
                >
                  <Tag className="h-3 w-3" />
                  {selectedTag || 'Add Tag'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuGroup>
                  {getTags().map(tag => (
                    <DropdownMenuItem
                      key={tag}
                      onClick={() => setSelectedTag(tag)}
                    >
                      <Badge variant="outline" className="mr-2">{tag}</Badge>
                      {tag}
                    </DropdownMenuItem>
                  ))}
                  <DropdownMenuItem onClick={() => setSelectedTag('important')}>
                    <Badge variant="outline" className="mr-2 bg-red-50 text-red-800 border-red-200">important</Badge>
                    Important
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedTag('question')}>
                    <Badge variant="outline" className="mr-2 bg-blue-50 text-blue-800 border-blue-200">question</Badge>
                    Question
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedTag('review')}>
                    <Badge variant="outline" className="mr-2 bg-amber-50 text-amber-800 border-amber-200">review</Badge>
                    Review Later
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={() => setSelectedTag(null)}>
                    <X className="h-4 w-4 mr-2" />
                    Clear Tag
                  </DropdownMenuItem>
                </DropdownMenuGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <Button
            onClick={addNote}
            size="sm"
            disabled={!currentNote.trim()}
            className="h-8"
          >
            <Save className="h-4 w-4 mr-1" />
            Save
          </Button>
        </div>
      </div>
      
      <Tabs value={currentTab} onValueChange={setCurrentTab} className="flex-1 flex flex-col">
        <div className="p-3 border-b">
          <TabsList className="grid grid-cols-2">
            <TabsTrigger value="notes">All Notes</TabsTrigger>
            <TabsTrigger value="bookmarks">Bookmarks</TabsTrigger>
          </TabsList>
        </div>
        
        <TabsContent value="notes" className="flex-1 overflow-y-auto p-0 m-0">
          <div className="p-3">
            {selectedTag && (
              <div className="flex justify-between items-center mb-3">
                <Badge className="py-1">
                  Filtered by: {selectedTag}
                </Badge>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setSelectedTag(null)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            )}
            
            <div className="space-y-4">
              {filteredNotes.length === 0 ? (
                <div className="text-center py-6">
                  <Info className="h-8 w-8 mx-auto text-muted-foreground/60 mb-2" />
                  <p className="text-sm text-muted-foreground">
                    {selectedTag 
                      ? `No notes with tag "${selectedTag}"` 
                      : 'No notes yet. Start taking notes!'}
                  </p>
                </div>
              ) : (
                filteredNotes.map(note => (
                  <motion.div
                    key={note.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border rounded-md p-3"
                  >
                    <div className="flex justify-between items-start">
                      <textarea
                        value={note.text}
                        onChange={(e) => updateNoteText(note.id, e.target.value)}
                        className="flex-1 text-sm bg-transparent resize-none focus:outline-none"
                        rows={2}
                      />
                      <div className="flex items-center ml-2">
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8"
                            >
                              <Tag className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => setNoteTag(note.id, 'important')}>
                              <Badge variant="outline" className="mr-2 bg-red-50 text-red-800 border-red-200">important</Badge>
                              Important
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setNoteTag(note.id, 'question')}>
                              <Badge variant="outline" className="mr-2 bg-blue-50 text-blue-800 border-blue-200">question</Badge>
                              Question
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setNoteTag(note.id, 'review')}>
                              <Badge variant="outline" className="mr-2 bg-amber-50 text-amber-800 border-amber-200">review</Badge>
                              Review Later
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => setNoteTag(note.id, '')}>
                              <X className="h-4 w-4 mr-2" />
                              Clear Tag
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                        
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 text-destructive"
                          onClick={() => deleteNote(note.id)}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {note.tag && (
                      <Badge 
                        variant="outline" 
                        className={cn(
                          "mt-1",
                          note.tag === 'important' && "bg-red-50 text-red-800 border-red-200",
                          note.tag === 'question' && "bg-blue-50 text-blue-800 border-blue-200",
                          note.tag === 'review' && "bg-amber-50 text-amber-800 border-amber-200"
                        )}
                      >
                        {note.tag}
                      </Badge>
                    )}
                    
                    {contentType === 'video' && (
                      <div className="mt-2">
                        {note.timeStamps && note.timeStamps.length > 0 && (
                          <div className="mt-2 space-y-1">
                            <div className="text-xs text-muted-foreground">Timestamps:</div>
                            <div className="space-y-1">
                              {note.timeStamps.map(ts => (
                                <div 
                                  key={ts.id} 
                                  className="flex items-center justify-between bg-muted/40 rounded px-2 py-1 text-xs"
                                >
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    className="h-6 text-xs"
                                  >
                                    <Clock className="h-3 w-3 mr-1" />
                                    {formatTimestamp(ts.timestamp)}
                                  </Button>
                                  <Button
                                    variant="ghost"
                                    size="icon"
                                    className="h-6 w-6 text-destructive/70"
                                    onClick={() => deleteTimestamp(note.id, ts.id)}
                                  >
                                    <X className="h-3 w-3" />
                                  </Button>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        
                        {currentTime !== undefined && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => addTimestamp(note.id)}
                            className="mt-2 h-7 text-xs"
                          >
                            <Plus className="h-3 w-3 mr-1" />
                            Add Current Timestamp
                          </Button>
                        )}
                      </div>
                    )}
                    
                    <div className="mt-2 text-xs text-muted-foreground">
                      Last updated: {new Date(note.updatedAt).toLocaleString()}
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </div>
        </TabsContent>
        
        <TabsContent value="bookmarks" className="flex-1 overflow-y-auto p-0 m-0">
          <div className="p-4 text-center">
            <Bookmark className="h-6 w-6 mx-auto text-muted-foreground/60 mb-2" />
            <p className="text-sm text-muted-foreground">
              Bookmarks will appear here
            </p>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
} 