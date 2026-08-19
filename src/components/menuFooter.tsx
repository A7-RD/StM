type MenuFooterProps = {
  warning?: string
}

export default function MenuFooter({ warning }: MenuFooterProps) {
  return (
    <div className="flex w-full justify-center">
      <div className="ds-caption py-15 max-w-[440px] text-center normal-case max-md:max-w-[360px]">
        {warning}
      </div>
    </div>
  )
}
