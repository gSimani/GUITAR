type ChordType = {
  name: string
  intervals: number[]
  notation: string[]
}

const CHORD_TYPES: ChordType[] = [
  { name: "Major", intervals: [0, 4, 7], notation: ["x", "3", "2", "0", "1", "0"] },
  { name: "Minor", intervals: [0, 3, 7], notation: ["x", "3", "5", "5", "4", "3"] },
  { name: "Dominant 7th", intervals: [0, 4, 7, 10], notation: ["x", "3", "2", "3", "2", "0"] },
  { name: "Major 7th", intervals: [0, 4, 7, 11], notation: ["x", "3", "2", "4", "1", "0"] },
  { name: "Minor 7th", intervals: [0, 3, 7, 10], notation: ["x", "3", "5", "3", "4", "3"] },
  { name: "Diminished", intervals: [0, 3, 6], notation: ["x", "3", "4", "5", "4", "x"] },
  { name: "Augmented", intervals: [0, 4, 8], notation: ["x", "3", "2", "1", "1", "0"] },
  { name: "Sus2", intervals: [0, 2, 7], notation: ["x", "3", "0", "0", "3", "3"] },
  { name: "Sus4", intervals: [0, 5, 7], notation: ["x", "3", "3", "0", "1", "1"] },
  { name: "6th", intervals: [0, 4, 7, 9], notation: ["x", "3", "2", "2", "1", "0"] },
  { name: "Minor 6th", intervals: [0, 3, 7, 9], notation: ["x", "3", "5", "2", "4", "3"] },
  { name: "9th", intervals: [0, 4, 7, 10, 14], notation: ["x", "3", "2", "3", "3", "x"] },
  { name: "Minor 9th", intervals: [0, 3, 7, 10, 14], notation: ["x", "3", "5", "3", "4", "x"] },
  { name: "11th", intervals: [0, 4, 7, 10, 14, 17], notation: ["x", "3", "3", "3", "4", "3"] },
  { name: "13th", intervals: [0, 4, 7, 10, 14, 21], notation: ["x", "3", "2", "3", "5", "5"] },
  { name: "7#9", intervals: [0, 4, 7, 10, 15], notation: ["x", "3", "2", "3", "4", "x"] },
  { name: "7b9", intervals: [0, 4, 7, 10, 13], notation: ["x", "3", "2", "3", "2", "x"] },
  { name: "7#5", intervals: [0, 4, 8, 10], notation: ["x", "3", "2", "3", "1", "4"] },
  { name: "7b5", intervals: [0, 4, 6, 10], notation: ["x", "3", "2", "3", "1", "2"] },
  { name: "Maj7#11", intervals: [0, 4, 7, 11, 18], notation: ["x", "3", "2", "4", "5", "2"] },
]

const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]

export function generateChords(root: string): { name: string; notation: string[] }[] {
  const rootIndex = NOTES.indexOf(root)
  return CHORD_TYPES.map((chordType) => {
    const chordName = `${root} ${chordType.name}`
    const notation = chordType.notation.map((fret) =>
      fret === "x" ? "x" : ((Number.parseInt(fret) + rootIndex) % 12).toString(),
    )
    return { name: chordName, notation }
  })
}

