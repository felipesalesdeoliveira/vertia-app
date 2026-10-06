import { forwardRef, type SVGProps } from 'react'

type IconProps = SVGProps<SVGSVGElement> & { size?: string | number }

function createIcon(paths: string[]) {
  return forwardRef<SVGSVGElement, IconProps>(function Icon({ size = 24, ...props }, ref) {
    return (
      <svg ref={ref} width={size} height={size} viewBox="0 0 24 24" fill="none"
        stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"
        aria-hidden="true" {...props}>
        {paths.map((d, index) => <path key={index} d={d} />)}
      </svg>
    )
  })
}

export const ArrowLeftRight = createIcon(['M8 3 4 7l4 4', 'M4 7h16', 'm16 21 4-4-4-4', 'M20 17H4'])
export const Bell = createIcon(['M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9', 'M10 21h4'])
export const Building2 = createIcon(['M3 21h18', 'M6 21V3h9v18', 'M15 9h3v12', 'M9 7h2M9 11h2M9 15h2'])
export const Camera = createIcon(['M14.5 4 16 7h4a2 2 0 0 1 2 2v9a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2h4l1.5-3z', 'M16 13a4 4 0 1 1-8 0 4 4 0 0 1 8 0'])
export const CalendarDays = createIcon(['M8 2v4M16 2v4M3 10h18', 'M5 4h14a2 2 0 0 1 2 2v14H3V6a2 2 0 0 1 2-2z', 'M8 14h.01M12 14h.01M16 14h.01M8 18h.01M12 18h.01'])
export const Check = createIcon(['m5 12 4 4L19 6'])
export const CheckCircle2 = createIcon(['M22 11.1V12a10 10 0 1 1-5.9-9.1', 'm9 11 3 3L22 4'])
export const ChevronDown = createIcon(['m6 9 6 6 6-6'])
export const ChevronLeft = createIcon(['m15 18-6-6 6-6'])
export const ChevronRight = createIcon(['m9 18 6-6-6-6'])
export const ClipboardCheck = createIcon(['M9 5H6a2 2 0 0 0-2 2v13h16V7a2 2 0 0 0-2-2h-3', 'M9 3h6v4H9z', 'm9 14 2 2 4-4'])
export const Clock3 = createIcon(['M22 12a10 10 0 1 1-10-10 10 10 0 0 1 10 10', 'M12 6v6l4 2'])
export const FileText = createIcon(['M6 2h8l4 4v16H6z', 'M14 2v5h5', 'M9 13h6M9 17h6'])
export const Filter = createIcon(['M3 4h18l-7 8v6l-4 2v-8z'])
export const FolderOpen = createIcon(['M3 19V5h7l2 2h9v4', 'M3 19h16l3-8H6z'])
export const HardHat = createIcon(['M3 18h18', 'M5 18v-3a7 7 0 0 1 14 0v3', 'M9 14V7h6v7'])
export const Home = createIcon(['m3 11 9-8 9 8', 'M5 10v11h14V10', 'M9 21v-7h6v7'])
export const Image = createIcon(['M3 4h18v16H3z', 'M8.5 10a1.5 1.5 0 1 0 0-3 1.5 1.5 0 0 0 0 3', 'm3 17 5-5 4 4 3-3 6 6'])
export const LayoutDashboard = createIcon(['M3 3h7v7H3zM14 3h7v4h-7zM14 11h7v10h-7zM3 14h7v7H3z'])
export const LockKeyhole = createIcon(['M6 10V7a6 6 0 0 1 12 0v3', 'M4 10h16v11H4z', 'M12 14v3'])
export const LogOut = createIcon(['M10 17l5-5-5-5M15 12H3', 'M14 3h7v18h-7'])
export const Mail = createIcon(['M3 5h18v14H3z', 'm3 6 9 7 9-7'])
export const Menu = createIcon(['M4 6h16M4 12h16M4 18h16'])
export const Mic = createIcon(['M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3z', 'M19 10v2a7 7 0 0 1-14 0v-2', 'M12 19v3'])
export const MessageCircle = createIcon(['M21 11.5a8.5 8.5 0 0 1-12.8 7.3L3 21l2.2-5.2A8.5 8.5 0 1 1 21 11.5'])
export const MoreHorizontal = createIcon(['M5 12h.01M12 12h.01M19 12h.01'])
export const Package = createIcon(['M21 8 12 3 3 8v8l9 5 9-5z', 'M3 8l9 5 9-5', 'M12 13v8'])
export const Pause = createIcon(['M8 5v14M16 5v14'])
export const Play = createIcon(['M7 4l13 8-13 8z'])
export const Plus = createIcon(['M12 5v14M5 12h14'])
export const Search = createIcon(['M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16', 'm21 21-4.4-4.4'])
export const Send = createIcon(['m22 2-7 20-4-9-9-4z', 'M22 2 11 13'])
export const Settings = createIcon(['M12 15.5a3.5 3.5 0 1 0 0-7 3.5 3.5 0 0 0 0 7', 'M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4v-.2a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1a1.7 1.7 0 0 0 1.9.3 1.7 1.7 0 0 0 1-1.6v-.2h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1z'])
export const ShieldCheck = createIcon(['M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10', 'm9 12 2 2 4-4'])
export const Smartphone = createIcon(['M7 2h10v20H7z', 'M11 18h2'])
export const Sparkles = createIcon(['m12 3 1.4 3.6L17 8l-3.6 1.4L12 13l-1.4-3.6L7 8l3.6-1.4z', 'm19 14 .8 2.2L22 17l-2.2.8L19 20l-.8-2.2L16 17l2.2-.8z', 'm5 14 .8 2.2L8 17l-2.2.8L5 20l-.8-2.2L2 17l2.2-.8z'])
export const Trash2 = createIcon(['M3 6h18', 'M8 6V4h8v2', 'M6 6l1 15h10l1-15', 'M10 11v6M14 11v6'])
export const TrendingUp = createIcon(['m3 17 6-6 4 4 8-8', 'M14 7h7v7'])
export const Upload = createIcon(['M12 16V4M7 9l5-5 5 5', 'M4 15v5h16v-5'])
export const UserRound = createIcon(['M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8', 'M4 21a8 8 0 0 1 16 0'])
export const Users = createIcon(['M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8', 'M2 21a7 7 0 0 1 14 0', 'M16 4a4 4 0 0 1 0 7', 'M17 14a7 7 0 0 1 5 7'])
export const X = createIcon(['M18 6 6 18M6 6l12 12'])
export const Sun = createIcon(['M12 17a5 5 0 1 0 0-10 5 5 0 0 0 0 10z', 'M12 1v2', 'M12 21v2', 'M4.2 4.2l1.4 1.4', 'M18.4 18.4l1.4 1.4', 'M1 12h2', 'M21 12h2', 'M4.2 19.8l1.4-1.4', 'M18.4 5.6l1.4-1.4'])
export const Cloud = createIcon(['M17.5 19a4.5 4.5 0 0 0 .5-8.97A6 6 0 0 0 6.3 11.2 3.5 3.5 0 0 0 7 19z'])
export const CloudRain = createIcon(['M17.5 15a4.5 4.5 0 0 0 .5-8.97A6 6 0 0 0 6.3 7.2 3.5 3.5 0 0 0 7 15', 'M8 18l-1 3', 'M12 18l-1 3', 'M16 18l-1 3'])
