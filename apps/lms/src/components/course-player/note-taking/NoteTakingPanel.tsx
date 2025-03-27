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
  DropdownMenuSeparator
} from '@/components/ui/dropdown-menu';
import { Badge } from '@/components/ui/badge';
import { cn } from '@/lib/utils';

type NotePosition = 'right' | 'bottom';

interface NoteTakingPanelProps {
  lessonId: string;
  contentType: 'video' | 'reading' | 'quiz' | 'project' | 'discussion';
  currentTime?: number; // For video notes
  position?: NotePosition; // New prop for position
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
  currentTime,
  position = 'right'
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
  
  // Get position-specific styles
  const getPanelStyles = () => {
    return position === 'right'
      ? 'h-full' // Side panel (full height)
      : 'w-full'; // Bottom panel (full width)
  };
  
  return (
    <div className={cn(
      "flex flex-col",
      getPanelStyles()
    )}>
      <div className="border-b p-3">
        <div className="flex items-center justify-between mb-2">
          <h3 className="font-medium">My Notes</h3>
          {/* Position indicator */}
          <Badge variant="outline" className="text-xs">
            {position === 'right' ? 'Side Panel' : 'Bottom Panel'}
          </Badge>
        </div>
        <textarea
          ref={textareaRef}
          value={currentNote}
          onChange={(e) => setCurrentNote(e.target.value)}
          placeholder="Take notes here..."
          className="w-full p-2 border rounded-md text-sm resize-none focus:outline-none focus:ring-1 focus:ring-primary"
          rows={position === 'right' ? 4 : 2}
          aria-label="Note content"
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
                aria-label="Add timestamp to note"
              >
                <Clock className="h-3 w-3" aria-hidden="true" />
                {formatTimestamp(currentTime)}
              </Button>
            )}
            
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="outline"
                  size="sm"
                  className="flex items-center gap-1 text-xs h-8"
                  aria-label="Add tag to note"
                >
                  <Tag className="h-3 w-3" aria-hidden="true" />
                  {selectedTag || 'Add Tag'}
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="start">
                <DropdownMenuGroup>
                  {getTags().length > 0 ? (
                    getTags().map(tag => (
                      <DropdownMenuItem
                        key={tag}
                        onClick={() => setSelectedTag(tag)}
                      >
                        {tag}
                      </DropdownMenuItem>
                    ))
                  ) : (
                    <DropdownMenuItem disabled>
                      No tags yet
                    </DropdownMenuItem>
                  )}
                </DropdownMenuGroup>
                <Separator />
                <DropdownMenuItem onClick={() => {
                  const newTag = prompt('Enter a new tag:');
                  if (newTag && newTag.trim()) {
                    setSelectedTag(newTag.trim());
                  }
                }}>
                  <Plus className="h-3 w-3 mr-1" aria-hidden="true" />
                  Create new tag
                </DropdownMenuItem>
                {selectedTag && (
                  <DropdownMenuItem onClick={() => setSelectedTag(null)}>
                    <X className="h-3 w-3 mr-1" aria-hidden="true" />
                    Clear selected tag
                  </DropdownMenuItem>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
          
          <Button 
            size="sm" 
            onClick={addNote}
            disabled={!currentNote.trim()}
            aria-label="Save note"
          >
            Save Note
          </Button>
        </div>
      </div>
      
      <div className={cn(
        "flex-1 overflow-y-auto p-3",
        position === 'bottom' && 'max-h-[160px]'
      )}>
        <Tabs defaultValue="all" value={currentTab} onValueChange={setCurrentTab}>
          <TabsList className="mb-4">
            <TabsTrigger value="all">All Notes</TabsTrigger>
            <TabsTrigger value="timestamps">
              Timestamps
              {contentType !== 'video' && " (Video Only)"}
            </TabsTrigger>
            <TabsTrigger value="tags">Tags</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all" className="mt-0">
            {filteredNotes.length > 0 ? (
              <div className="space-y-3">
                {filteredNotes.map(note => (
                  <div 
                    key={note.id} 
                    className="border rounded-md p-3 bg-card"
                  >
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="whitespace-pre-wrap text-sm">
                          {note.text}
                        </div>
                        
                        {note.tag && (
                          <Badge variant="secondary" className="mt-2">
                            {note.tag}
                          </Badge>
                        )}
                        
                        {note.timeStamps && note.timeStamps.length > 0 && (
                          <div className="mt-2 space-y-1">
                            {note.timeStamps.map(ts => (
                              <div 
                                key={ts.id}
                                className="flex items-center text-xs text-muted-foreground bg-muted/50 px-2 py-1 rounded"
                              >
                                <button
                                  className="flex items-center hover:text-primary"
                                  aria-label={`Go to timestamp ${formatTimestamp(ts.timestamp)}`}
                                >
                                  <Clock className="h-3 w-3 mr-1" aria-hidden="true" />
                                  {formatTimestamp(ts.timestamp)}
                                </button>
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  className="h-5 w-5 ml-auto"
                                  onClick={() => deleteTimestamp(note.id, ts.id)}
                                  aria-label="Delete timestamp"
                                >
                                  <X className="h-3 w-3" aria-hidden="true" />
                                </Button>
                              </div>
                            ))}
                          </div>
                        )}
                        
                        <div className="mt-2 text-xs text-muted-foreground">
                          {new Date(note.createdAt).toLocaleString()}
                        </div>
                      </div>
                      
                      <div className="flex space-x-1 ml-2">
                        {contentType === 'video' && currentTime !== undefined && (
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-7 w-7"
                            onClick={() => addTimestamp(note.id)}
                            aria-label="Add timestamp to this note"
                          >
                            <Clock className="h-3.5 w-3.5" aria-hidden="true" />
                          </Button>
                        )}
                        
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-7 w-7"
                              aria-label="Note options"
                            >
                              <Tag className="h-3.5 w-3.5" aria-hidden="true" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end" className="w-36">
                            <DropdownMenuItem onClick={() => {
                              const newTag = prompt('Enter tag:', note.tag || '');
                              if (newTag !== null) {
                                setNoteTag(note.id, newTag);
                              }
                            }}>
                              Edit Tag
                            </DropdownMenuItem>
                            <DropdownMenuItem onClick={() => {
                              const newText = prompt('Edit note:', note.text);
                              if (newText !== null) {
                                updateNoteText(note.id, newText);
                              }
                            }}>
                              Edit Note
                            </DropdownMenuItem>
                            <DropdownMenuSeparator />
                            <DropdownMenuItem
                              className="text-destructive"
                              onClick={() => deleteNote(note.id)}
                            >
                              Delete Note
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Info className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>{selectedTag ? "No notes with this tag" : "No notes yet"}</p>
                <p className="text-sm mt-2">
                  Start taking notes to see them here
                </p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="timestamps" className="mt-0">
            {contentType === 'video' ? (
              notes.some(note => note.timeStamps && note.timeStamps.length > 0) ? (
                <div className="space-y-2">
                  {notes
                    .filter(note => note.timeStamps && note.timeStamps.length > 0)
                    .map(note => (
                      note.timeStamps?.map(ts => (
                        <div 
                          key={ts.id}
                          className="border rounded-md p-2 flex items-center"
                        >
                          <button
                            className="flex items-center bg-primary/10 text-primary rounded px-2 py-1 text-xs mr-2"
                            aria-label={`Jump to ${formatTimestamp(ts.timestamp)}`}
                          >
                            <Clock className="h-3 w-3 mr-1" aria-hidden="true" />
                            {formatTimestamp(ts.timestamp)}
                          </button>
                          <span className="text-sm flex-1 truncate">
                            {note.text}
                          </span>
                        </div>
                      ))
                    ))}
                </div>
              ) : (
                <div className="text-center py-8 text-muted-foreground">
                  <Clock className="h-8 w-8 mx-auto mb-2 opacity-50" />
                  <p>No timestamps yet</p>
                  <p className="text-sm mt-2">
                    Add timestamps to your notes to see them here
                  </p>
                </div>
              )
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Info className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>Timestamps are only available for video content</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="tags" className="mt-0">
            {getTags().length > 0 ? (
              <div className="space-y-2">
                {getTags().map(tag => (
                  <button
                    key={tag}
                    className={cn(
                      "w-full text-left border rounded-md p-3 hover:bg-muted/50 transition-colors",
                      selectedTag === tag && "border-primary/50 bg-primary/5"
                    )}
                    onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
                    aria-pressed={selectedTag === tag}
                  >
                    <div className="flex items-center">
                      <Tag className="h-4 w-4 mr-2 text-muted-foreground" aria-hidden="true" />
                      <span>{tag}</span>
                      <Badge variant="outline" className="ml-auto">
                        {notes.filter(note => note.tag === tag).length}
                      </Badge>
                    </div>
                  </button>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-muted-foreground">
                <Tag className="h-8 w-8 mx-auto mb-2 opacity-50" />
                <p>No tags yet</p>
                <p className="text-sm mt-2">
                  Add tags to your notes to organize them
                </p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
} 