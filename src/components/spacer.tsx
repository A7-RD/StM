import { cn } from "@/lib/utils"

type SpacerProps = {
  /** Height in px when no `className` height is provided */
  h?: number
  /** When set with `h`, `h` applies from `md` up and `hMobile` below `md` (inline heights). */
  hMobile?: number
  className?: string
}

export default function Spacer({ h, hMobile, className }: SpacerProps) {
  if (h != null && hMobile != null) {
    return (
      <>
        <div
          className={cn("max-md:hidden", className)}
          style={{ height: h }}
          aria-hidden
        />
        <div
          className={cn("md:hidden", className)}
          style={{ height: hMobile }}
          aria-hidden
        />
      </>
    )
  }
  if (h != null) {
    return (
      <div
        className={cn(className)}
        style={{ height: h }}
        aria-hidden
      />
    )
  }
  return <div className={cn(className)} aria-hidden />
}
