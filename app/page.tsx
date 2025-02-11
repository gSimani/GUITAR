import { GuitarFretboard } from "../components/guitar-fretboard"

export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-start p-4 md:p-8">
      <h1 className="text-2xl md:text-4xl font-bold mb-4 md:mb-8">Guitarify's Scale Visualizer</h1>
      <div className="w-full max-w-7xl">
        <GuitarFretboard />
      </div>
    </main>
  )
}

