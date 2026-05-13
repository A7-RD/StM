import Masthead from "./masthead"

type HeaderProps = {
  data?: Record<string, unknown>
  footerData?: Record<string, unknown>
}

export default function Header({ data, footerData }: HeaderProps) {
  return <Masthead headerData={data} footerData={footerData} />
}
