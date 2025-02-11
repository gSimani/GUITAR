"use client"

import { useState, useEffect } from "react"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { generateScale, isNoteInScale, type ScaleType } from "../utils/music-theory"
import { generateChords } from "../utils/chord-utils"

const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]
const STRINGS = ["E", "B", "G", "D", "A", "E"]
const FRETS = 22
const FRET_MARKERS = [3, 5, 7, 9, 12, 15, 17, 19, 21]
const MAX_FRET_SPAN = 4

export function GuitarFretboard() {
  const [selectedKey, setSelectedKey] = useState("C")
  const [selectedScale, setSelectedScale] = useState<ScaleType>("major")
  const [selectedChord, setSelectedChord] = useState<string | null>(null)
  const [chordPosition, setChordPosition] = useState(0)
  const [fretWidth, setFretWidth] = useState(50)
  const scale = generateScale(selectedKey, selectedScale)
  const chords = generateChords(selectedKey)

  useEffect(() => {
    const updateFretWidth = () => {
      const containerWidth = window.innerWidth - 32
      const newFretWidth = Math.floor(containerWidth / (FRETS + 1))
      setFretWidth(Math.max(newFretWidth, 30))
    }

    updateFretWidth()
    window.addEventListener("resize", updateFretWidth)
    return () => window.removeEventListener("resize", updateFretWidth)
  }, [])

  useEffect(() => {
    setChordPosition(0)
  }, [selectedChord]) //This hook specifies more dependencies than necessary: selectedChord

  const getChordNotesInSpan = (chord: string[], position: number) => {
    const chordNotes = chord
      .map((fret, index) => ({
        string: STRINGS[index],
        fret: fret !== "x" ? Number.parseInt(fret) + position : null,
      }))
      .filter((note) => note.fret !== null)

    const lowestFret = Math.min(...chordNotes.map((note) => note.fret as number))
    const highestFret = Math.max(...chordNotes.map((note) => note.fret as number))

    if (highestFret - lowestFret <= MAX_FRET_SPAN) {
      return chordNotes
    }

    return chordNotes.filter((note) => (note.fret as number) - lowestFret <= MAX_FRET_SPAN)
  }

  const renderFretMarkers = () => {
    return (
      <div className="flex mb-2">
        {[...Array(FRETS + 1)].map((_, fretIndex) => (
          <div
            key={fretIndex}
            className="flex items-center justify-center"
            style={{ width: `${fretWidth}px`, height: `${fretWidth * 0.5}px` }}
          >
            {FRET_MARKERS.includes(fretIndex) && (
              <div className={`w-2 h-2 rounded-full bg-gray-400 ${fretIndex === 12 ? "relative" : ""}`}>
                {fretIndex === 12 && <div className="absolute w-2 h-2 rounded-full bg-gray-400 -top-3"></div>}
              </div>
            )}
          </div>
        ))}
      </div>
    )
  }

  const renderFretboard = () => {
    const chord = chords.find((c) => c.name === selectedChord)
    const selectedChordNotes = chord ? getChordNotesInSpan(chord.notation, chordPosition) : []

    return STRINGS.map((string, stringIndex) => (
      <div key={stringIndex} className="flex">
        {[...Array(FRETS + 1)].map((_, fretIndex) => {
          const noteIndex = (NOTES.indexOf(string) + fretIndex) % 12
          const note = NOTES[noteIndex]
          const isInScale = isNoteInScale(note, scale)
          const isInChord = selectedChordNotes.some((n) => n.string === string && n.fret === fretIndex)

          return (
            <div
              key={fretIndex}
              className={`border border-gray-300 flex items-center justify-center ${
                isInScale ? "bg-blue-500" : "bg-white"
              }`}
              style={{ width: `${fretWidth}px`, height: `${fretWidth * 0.75}px` }}
            >
              {isInScale && (
                <span className={`text-xs ${isInChord ? "text-red-500 font-bold" : "text-white"}`}>{note}</span>
              )}
            </div>
          )
        })}
      </div>
    ))
  }

  const renderChordDiagram = () => {
    if (!selectedChord) return null

    const chord = chords.find((c) => c.name === selectedChord)
    if (!chord) return null

    const chordNotes = getChordNotesInSpan(chord.notation, chordPosition)
    const lowestFret = Math.min(...chordNotes.map((note) => note.fret as number))

    return (
      <div className="mt-4 p-4 border rounded-lg">
        <h3 className="text-lg font-semibold mb-2">
          {selectedChord} Chord - Position {chordPosition}
        </h3>
        <div className="flex justify-center space-x-2">
          {STRINGS.map((string, index) => {
            const note = chordNotes.find((n) => n.string === string)
            const fret = note ? (note.fret as number) - lowestFret : "x"
            return (
              <div key={index} className="flex flex-col items-center">
                <div className="w-6 h-8 border-l border-t border-b flex items-center justify-center">
                  {fret === "x" ? "X" : fret}
                </div>
                <div className="text-xs">{string}</div>
              </div>
            )
          })}
        </div>
        <div className="flex justify-center space-x-4 mt-4">
          <Button
            onClick={() => {
              const prevPosition = (chordPosition - 1 + FRETS) % FRETS
              setChordPosition(prevPosition)
            }}
          >
            <ChevronLeft className="mr-2 h-4 w-4" /> Back
          </Button>
          <Button
            onClick={() => {
              const nextPosition = (chordPosition + 1) % FRETS
              setChordPosition(nextPosition)
            }}
          >
            Next <ChevronRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="w-full max-w-full overflow-x-auto">
      <div className="mb-4 flex flex-wrap gap-4">
        <Select onValueChange={(value) => setSelectedKey(value)}>
          <SelectTrigger className="w-[120px]">
            <SelectValue placeholder="Select a key" />
          </SelectTrigger>
          <SelectContent>
            {NOTES.map((note) => (
              <SelectItem key={note} value={note}>
                {note}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select onValueChange={(value) => setSelectedScale(value as ScaleType)}>
          <SelectTrigger className="w-[180px]">
            <SelectValue placeholder="Select a scale" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="major">Major</SelectItem>
            <SelectItem value="minor">Minor</SelectItem>
            <SelectItem value="harmonicMinor">Harmonic Minor</SelectItem>
            <SelectItem value="melodicMinor">Melodic Minor</SelectItem>
            <SelectItem value="dorian">Dorian</SelectItem>
            <SelectItem value="phrygian">Phrygian</SelectItem>
            <SelectItem value="lydian">Lydian</SelectItem>
            <SelectItem value="mixolydian">Mixolydian</SelectItem>
            <SelectItem value="locrian">Locrian</SelectItem>
          </SelectContent>
        </Select>
        <Select onValueChange={(value) => setSelectedChord(value)}>
          <SelectTrigger className="w-[220px]">
            <SelectValue placeholder="Select a chord" />
          </SelectTrigger>
          <SelectContent>
            {chords.map((chord) => (
              <SelectItem key={chord.name} value={chord.name}>
                {chord.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      <div className="inline-block">
        {renderFretMarkers()}
        {renderFretboard()}
      </div>
      {renderChordDiagram()}
    </div>
  )
}

