import { initialsOf } from '../mock/names'

const tints = ['#D2A679', '#8B9279', '#BFAE9F', '#6B4226', '#D9BE82', '#7C8FA6']
/** Patient picture. Shows the photo when there is one, otherwise initials on a tint taken from the name. */
export function Avatar({ name, size = 36, photo }: { name: string; size?: number; photo?: string }) {
  const tint = tints[[...name].reduce((n, c) => n + c.charCodeAt(0), 0) % tints.length]
  if (photo) return <img src={photo} alt={name} className="shrink-0 rounded-full object-cover" style={{ width: size, height: size }} />
  return <span aria-hidden className="flex shrink-0 items-center justify-center rounded-full font-semibold text-white" style={{ width: size, height: size, background: tint, fontSize: size * 0.38 }}>{initialsOf(name)}</span>
}
