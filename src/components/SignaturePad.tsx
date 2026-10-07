import { useRef, useState } from 'react'
import { Eraser } from 'lucide-react'

/** Mockup signature pad: supports typed and drawn signatures. */
export function SignaturePad({ onChange }: { onChange: (sig: { method: 'Typed' | 'Drawn'; value: string } | null) => void }) {
  const [mode, setMode] = useState<'Typed' | 'Drawn'>('Typed')
  const [typed, setTyped] = useState('')
  const [hasInk, setHasInk] = useState(false)
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const drawing = useRef(false)

  const pos = (e: React.PointerEvent<HTMLCanvasElement>) => {
    const c = canvasRef.current!
    const r = c.getBoundingClientRect()
    return { x: ((e.clientX - r.left) / r.width) * c.width, y: ((e.clientY - r.top) / r.height) * c.height }
  }
  const start = (e: React.PointerEvent<HTMLCanvasElement>) => {
    drawing.current = true
    const ctx = canvasRef.current!.getContext('2d')!
    const p = pos(e)
    ctx.beginPath(); ctx.moveTo(p.x, p.y)
  }
  const move = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!drawing.current) return
    const ctx = canvasRef.current!.getContext('2d')!
    ctx.lineWidth = 2.2; ctx.lineCap = 'round'; ctx.strokeStyle = '#0a4543'
    const p = pos(e); ctx.lineTo(p.x, p.y); ctx.stroke()
    if (!hasInk) { setHasInk(true); onChange({ method: 'Drawn', value: 'drawn' }) }
  }
  const end = () => { drawing.current = false }
  const clear = () => {
    const c = canvasRef.current!; c.getContext('2d')!.clearRect(0, 0, c.width, c.height)
    setHasInk(false); onChange(null)
  }

  return (
    <div>
      <div className="mb-2 flex gap-1 rounded-xl bg-sand-100 p-1 text-sm font-medium">
        {(['Typed', 'Drawn'] as const).map((m) => (
          <button key={m} type="button" onClick={() => { setMode(m); onChange(m === 'Typed' ? (typed ? { method: 'Typed', value: typed } : null) : (hasInk ? { method: 'Drawn', value: 'drawn' } : null)) }}
            className={`flex-1 rounded-lg py-1.5 ${mode === m ? 'bg-white shadow text-teal-800' : 'text-sand-600'}`}>{m === 'Typed' ? 'Type my name' : 'Draw my signature'}</button>
        ))}
      </div>
      {mode === 'Typed' ? (
        <div className="rounded-xl border border-sand-300 bg-white px-4 py-3">
          <input value={typed} onChange={(e) => { setTyped(e.target.value); onChange(e.target.value ? { method: 'Typed', value: e.target.value } : null) }}
            placeholder="Type your full legal name" className="w-full bg-transparent font-display text-2xl italic text-teal-900 placeholder:not-italic placeholder:font-sans placeholder:text-base placeholder:text-sand-400 focus:outline-none" />
          <div className="mt-1 border-t border-sand-200 pt-1 text-[11px] text-sand-500">By typing my name I agree this is my electronic signature.</div>
        </div>
      ) : (
        <div className="relative rounded-xl border border-sand-300 bg-white">
          <canvas ref={canvasRef} width={600} height={180} className="h-40 w-full touch-none rounded-xl"
            onPointerDown={start} onPointerMove={move} onPointerUp={end} onPointerLeave={end} />
          {!hasInk && <div className="pointer-events-none absolute inset-0 flex items-center justify-center text-sm text-sand-400">Sign here with your finger or mouse</div>}
          <button type="button" onClick={clear} className="absolute right-2 top-2 btn-ghost px-2 py-1 text-xs"><Eraser size={14} /> Clear</button>
        </div>
      )}
    </div>
  )
}
