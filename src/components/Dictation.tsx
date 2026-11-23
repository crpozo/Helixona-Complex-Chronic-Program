import { useEffect, useRef, useState } from 'react'
import { Mic, Square } from 'lucide-react'

/** Speech to text for every free-text box. One layer for the whole app: when a text area or a free-text field
 *  has focus, a microphone button appears at its corner; what is said is typed into the field. */
type Field = HTMLTextAreaElement | HTMLInputElement
const eligible = (el: EventTarget | null): el is Field => {
  if (el instanceof HTMLTextAreaElement) return !el.readOnly && !el.disabled
  if (!(el instanceof HTMLInputElement) || el.readOnly || el.disabled) return false
  if (!['text', 'search', ''].includes(el.type) || el.inputMode === 'numeric' || el.inputMode === 'decimal' || el.maxLength === 5) return false
  return (el.placeholder ?? '').length >= 10 || el.dataset.mic === 'on'
}
const write = (el: Field, value: string) => {
  const proto = el instanceof HTMLTextAreaElement ? HTMLTextAreaElement.prototype : HTMLInputElement.prototype
  Object.getOwnPropertyDescriptor(proto, 'value')?.set?.call(el, value)
  el.dispatchEvent(new Event('input', { bubbles: true }))
}

export function DictationLayer() {
  const [field, setField] = useState<Field | null>(null)
  const [pos, setPos] = useState<{ top: number; left: number } | null>(null)
  const [listening, setListening] = useState(false)
  const [hint, setHint] = useState<string | null>(null)
  const rec = useRef<{ stop: () => void } | null>(null)

  useEffect(() => {
    const place = (el: Field) => { const r = el.getBoundingClientRect(); setPos({ top: (el instanceof HTMLTextAreaElement ? r.bottom - 40 : r.top + (r.height - 32) / 2), left: r.right - 40 }) }
    const onFocus = (e: FocusEvent) => { if (eligible(e.target)) { setField(e.target); place(e.target) } }
    const onBlur = () => setTimeout(() => { if (!eligible(document.activeElement)) { setField(null); rec.current?.stop() } }, 120)
    const onMove = () => { const el = document.activeElement; if (eligible(el)) place(el) }
    document.addEventListener('focusin', onFocus); document.addEventListener('focusout', onBlur)
    window.addEventListener('scroll', onMove, true); window.addEventListener('resize', onMove)
    return () => { document.removeEventListener('focusin', onFocus); document.removeEventListener('focusout', onBlur); window.removeEventListener('scroll', onMove, true); window.removeEventListener('resize', onMove) }
  }, [])

  const toggle = () => {
    if (!field) return
    if (listening) { rec.current?.stop(); return }
    const w = window as unknown as Record<string, unknown>
    const SR = (w.SpeechRecognition ?? w.webkitSpeechRecognition) as (new () => Record<string, unknown> & { start: () => void; stop: () => void }) | undefined
    if (!SR) { setHint('Voice typing is not available in this browser'); setTimeout(() => setHint(null), 2600); return }
    const r = new SR(); const base = field.value ? field.value.replace(/\s*$/, ' ') : ''
    r.lang = 'en-US'; r.interimResults = true; r.continuous = true
    r.onresult = (e: { results: ArrayLike<ArrayLike<{ transcript: string }>> }) => write(field, base + Array.from(e.results).map((x) => x[0].transcript).join(''))
    r.onend = () => { setListening(false); rec.current = null }
    r.onerror = () => { setListening(false); setHint('We could not hear you. Check that the microphone is allowed.'); setTimeout(() => setHint(null), 2600) }
    rec.current = r; setListening(true); r.start()
  }

  if (!field || !pos) return null
  return (
    <>
      <button type="button" aria-label={listening ? 'Stop voice typing' : 'Speak instead of typing'} title={listening ? 'Stop' : 'Speak instead of typing'} onMouseDown={(e) => e.preventDefault()} onClick={toggle} style={{ top: pos.top, left: pos.left }}
        className={`fixed z-[60] flex h-8 w-8 items-center justify-center rounded-full shadow ${listening ? 'animate-pulse bg-bad-600 text-white' : 'bg-sand-900 text-white'}`}>{listening ? <Square size={13} /> : <Mic size={15} />}</button>
      {(listening || hint) && <div role="status" style={{ top: pos.top + 38, left: Math.max(8, pos.left - 190) }} className="fixed z-[60] w-[230px] rounded-lg bg-sand-900 px-3 py-1.5 text-center text-xs text-white">{hint ?? 'Listening… tap the square to stop'}</div>}
    </>
  )
}
