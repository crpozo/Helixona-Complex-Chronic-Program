import { toastMessage, useStore } from '../mock/store'

/** One toast for the whole app; any screen calls notify('…'). */
export default function ToastHost() {
  useStore()
  const m = toastMessage()
  if (!m) return null
  return <div role="status" className="pointer-events-none fixed bottom-6 left-1/2 z-[60] -translate-x-1/2 rounded-full bg-sand-900 px-4 py-2 text-sm text-white shadow-lg">{m}</div>
}
