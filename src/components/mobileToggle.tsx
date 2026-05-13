import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type MobileToggleProps = {
  isOpen: boolean
  onToggle: () => void
}

export default function MobileToggle({ isOpen, onToggle }: MobileToggleProps) {
  return (
    <Button
      type="button"
      variant="ghost"
      size="icon"
      aria-label="Menu"
      aria-expanded={isOpen}
      onClick={onToggle}
      className={cn(
        "absolute top-6 right-6 z-[160] size-6 shrink-0 rounded-full border-0 bg-paper shadow-[inset_1px_1px_2px_1px_rgba(0,0,0,0.25)] md:hidden",
        isOpen && "bg-ink shadow-none",
      )}
    />
  )
}
