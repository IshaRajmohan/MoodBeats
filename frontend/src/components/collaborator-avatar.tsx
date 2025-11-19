'use client'

interface CollaboratorAvatarProps {
  name: string
  initials: string
  color: string
  isActive?: boolean
  cursorPosition?: { x: number; y: number }
}

export function CollaboratorAvatar({
  name,
  initials,
  color,
  isActive,
  cursorPosition,
}: CollaboratorAvatarProps) {
  return (
    <div className="relative">
      <div
        className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-bold text-white shadow-md transition-all ${
          isActive ? 'ring-2 ring-primary' : ''
        }`}
        style={{ backgroundColor: color }}
        title={name}
      >
        {initials}
      </div>
      {isActive && (
        <div className="absolute -bottom-1 -right-1 w-4 h-4 bg-green-500 rounded-full border-2 border-background" />
      )}
    </div>
  )
}
