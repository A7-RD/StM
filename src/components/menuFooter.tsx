type MenuFooterProps = {
  warning?: string
}

export default function MenuFooter({ warning }: MenuFooterProps) {
  return (
    <div className="flex w-full justify-center">
      <div className="max-w-[440px] px-6 pt-6 text-center text-sm normal-case opacity-40 max-md:max-w-[360px]">
        {warning}
      </div>
    </div>
  )
}
