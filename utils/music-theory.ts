const NOTES = ["C", "C#", "D", "D#", "E", "F", "F#", "G", "G#", "A", "A#", "B"]

const SCALE_PATTERNS = {
  major: [2, 2, 1, 2, 2, 2, 1],
  minor: [2, 1, 2, 2, 1, 2, 2],
  harmonicMinor: [2, 1, 2, 2, 1, 3, 1],
  melodicMinor: [2, 1, 2, 2, 2, 2, 1],
  dorian: [2, 1, 2, 2, 2, 1, 2],
  phrygian: [1, 2, 2, 2, 1, 2, 2],
  lydian: [2, 2, 2, 1, 2, 2, 1],
  mixolydian: [2, 2, 1, 2, 2, 1, 2],
  locrian: [1, 2, 2, 1, 2, 2, 2],
}

export type ScaleType = keyof typeof SCALE_PATTERNS

export function generateScale(root: string, scaleType: ScaleType): string[] {
  const scale = [root]
  let currentIndex = NOTES.indexOf(root)

  SCALE_PATTERNS[scaleType].forEach((interval) => {
    currentIndex = (currentIndex + interval) % 12
    scale.push(NOTES[currentIndex])
  })

  return scale
}

export function isNoteInScale(note: string, scale: string[]): boolean {
  return scale.includes(note)
}

