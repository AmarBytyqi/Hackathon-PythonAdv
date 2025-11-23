"use client"
import { Label } from "@/components/ui/label"
import { cn } from "@/lib/utils"

const AVATARS = [
  {
    id: "shadow",
    name: "Shadow",
    url: "/images/shadow-walking-front.png",
  },
  {
    id: "engineer",
    name: "Engineer",
    url: "/images/engineer-walking-front.png",
  },
  {
    id: "hipster",
    name: "Hipster",
    url: "/images/hipster-walking-front.png",
  },
  {
    id: "speedster",
    name: "Speedster",
    url: "/images/speedster-walking-front.png",
  },
]

interface AvatarSelectorProps {
  selectedAvatar: string
  onSelect: (url: string) => void
}

export function AvatarSelector({ selectedAvatar, onSelect }: AvatarSelectorProps) {
  return (
    <div className="space-y-2">
      <Label>Choose Profile Picture</Label>
      <div className="grid grid-cols-4 gap-3">
        {AVATARS.map((avatar) => (
          <button
            key={avatar.id}
            type="button"
            onClick={() => onSelect(avatar.url)}
            className={cn(
              "relative aspect-square rounded-lg border-2 transition-all hover:scale-105 overflow-hidden bg-muted",
              selectedAvatar === avatar.url
                ? "border-primary ring-2 ring-primary ring-offset-2"
                : "border-muted-foreground/20 hover:border-primary/50",
            )}
          >
            <img src={avatar.url || "/placeholder.svg"} alt={avatar.name} className="w-full h-full object-cover" />
          </button>
        ))}
      </div>
      <p className="text-xs text-muted-foreground">Select an avatar for your profile</p>
    </div>
  )
}
