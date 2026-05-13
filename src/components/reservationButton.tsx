import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

type ReservationButtonProps = {
  data?: {
    reservation?: { link?: string; button?: string }
  }
}

export default function ReservationButton({ data }: ReservationButtonProps) {
  const href = data?.reservation?.link ?? "#"
  const label = data?.reservation?.button

  return (
    <Button
      variant="reservation"
      nativeButton={false}
      render={
        <a
          href={href}
          className={cn(
            "reservation-button--masthead relative z-[110] m-0 px-3 py-1 text-base transition-opacity duration-[250ms] ease-in-out",
          )}
        />
      }
    >
      {label}
    </Button>
  )
}
