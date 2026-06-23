'use client'
import React, { useContext } from 'react'
import { Context } from '../helper/Context'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { 
  BiHistory, 
  BiDollarCircle, 
  BiUserVoice, 
  BiSupport, 
  BiHome, 
  BiCog, 
  BiLogOut, 
  BiChevronRight 
} from 'react-icons/bi'

const Usersidebar = () => {
    const { userSidebar, logout } = useContext(Context)
    const pathname = usePathname()

    const isActive = (path) => pathname === path

    const links = [
      { name: 'History', path: '/user/history', icon: <BiHistory /> },
      { name: 'Payments', path: '/user/payments', icon: <BiDollarCircle /> },
      { name: 'Reviews', path: '/user/reviews', icon: <BiUserVoice /> },
      { name: 'Support', path: '/user/support', icon: <BiSupport /> },
    ]

    const secondaryLinks = [
      { name: 'Shop Home', path: '/', icon: <BiHome /> },
      { name: 'Settings', path: '/user/settings', icon: <BiCog /> },
    ]

    return (
        <div className={`${userSidebar ? 'translate-x-0' : '-translate-x-full'} transition-transform duration-300 ease-in-out w-56 h-[calc(100vh-3.5rem)] fixed top-14 left-0 bg-slate-900 border-r border-slate-800 text-slate-350 flex flex-col justify-between p-4 z-30`}>
            
            {/* Top Navigation Links */}
            <div className="w-full flex flex-col gap-1.5 overflow-y-auto">
                <div className="px-3 py-2 text-xxs font-bold text-slate-500 uppercase tracking-widest">
                    User Panel
                </div>

                {links.map((link) => {
                  const active = isActive(link.path)
                  return (
                    <Link 
                      key={link.path}
                      href={link.path} 
                      className={`flex items-center justify-between px-3 py-2.5 rounded-xl text-xs font-semibold transition-all ${
                        active 
                          ? 'bg-slate-800 text-white shadow-sm' 
                          : 'text-slate-400 hover:bg-slate-800/60 hover:text-white'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <span className="text-base">{link.icon}</span>
                        <span>{link.name}</span>
                      </div>
                      <BiChevronRight className="text-slate-550 opacity-60" />
                    </Link>
                  )
                })}
            </div>

            {/* Bottom Links & Logout */}
            <div className="w-full pt-4 border-t border-slate-800 flex flex-col gap-2 shrink-0">
                {secondaryLinks.map((link) => {
                  const active = isActive(link.path)
                  return (
                    <Link 
                      key={link.path}
                      href={link.path}
                      className={`flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium transition ${
                        active 
                          ? 'bg-slate-850 text-white' 
                          : 'text-slate-400 hover:bg-slate-800 hover:text-white'
                      }`}
                    >
                      <span className="text-base">{link.icon}</span>
                      <span>{link.name}</span>
                    </Link>
                  )
                })}

                <button 
                  onClick={() => logout()} 
                  className="flex items-center gap-3 px-3 py-2 rounded-lg text-xs font-medium text-left hover:bg-rose-950/20 hover:text-rose-450 text-slate-400 hover:text-rose-400 transition cursor-pointer"
                >
                    <BiLogOut className="text-base" />
                    <span>Logout</span>
                </button>
            </div>

        </div>
    )
}

export default Usersidebar