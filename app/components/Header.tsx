'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  useCallback,
  useEffect,
  useRef,
  useState,
  type KeyboardEvent as ReactKeyboardEvent,
  type ReactNode,
} from 'react'
import { NAV_CONFIG, isNavHrefActive, isNavSectionActive, type NavSection } from './navConfig'

type HeaderProps = {
  installLabel?: string
  installHref?: string
  onInstallClick?: () => void
  mobileExtraAction?: (closeMenu: () => void) => ReactNode
}

const MOBILE_MENU_ID = 'site-mobile-menu'

export default function Header({
  installLabel = 'Install',
  installHref = '/install',
  onInstallClick,
  mobileExtraAction,
}: HeaderProps) {
  const pathname = usePathname()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null)
  const closeTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const desktopNavRef = useRef<HTMLElement>(null)
  const mobileToggleRef = useRef<HTMLButtonElement>(null)
  const mobilePanelRef = useRef<HTMLDivElement>(null)
  const lastFocusedElementRef = useRef<HTMLElement | null>(null)
  const shouldRestoreMobileFocusRef = useRef(true)
  const dropdownButtonRefs = useRef<Record<string, HTMLButtonElement | null>>({})

  const cancelClose = useCallback(() => {
    if (closeTimerRef.current) {
      clearTimeout(closeTimerRef.current)
      closeTimerRef.current = null
    }
  }, [])

  const focusDropdownItem = useCallback((label: string, index: number) => {
    const items = getDropdownLinkElements(label)
    items[index]?.focus()
  }, [])

  const openDropdown = useCallback((label: string, focusIndex?: number) => {
    cancelClose()
    setActiveDropdown(label)

    if (focusIndex !== undefined) {
      window.requestAnimationFrame(() => focusDropdownItem(label, focusIndex))
    }
  }, [cancelClose, focusDropdownItem])

  const scheduleClose = useCallback(() => {
    cancelClose()
    closeTimerRef.current = setTimeout(() => {
      setActiveDropdown(null)
      closeTimerRef.current = null
    }, 120)
  }, [cancelClose])

  const toggleDropdown = useCallback((label: string) => {
    cancelClose()
    setActiveDropdown((current) => (current === label ? null : label))
  }, [cancelClose])

  const closeDropdowns = useCallback((labelToFocus?: string | null) => {
    cancelClose()
    setActiveDropdown(null)

    if (labelToFocus) {
      window.requestAnimationFrame(() => {
        dropdownButtonRefs.current[labelToFocus]?.focus()
      })
    }
  }, [cancelClose])

  const closeMobile = useCallback((restoreFocus = true) => {
    shouldRestoreMobileFocusRef.current = restoreFocus
    setMobileOpen(false)
  }, [])

  const closeMobileNoRestore = useCallback(() => {
    shouldRestoreMobileFocusRef.current = false
    setMobileOpen(false)
  }, [])

  useEffect(() => {
    if (!activeDropdown) return

    const onOutside = (event: MouseEvent) => {
      if (!desktopNavRef.current?.contains(event.target as Node)) {
        closeDropdowns()
      }
    }

    document.addEventListener('mousedown', onOutside)
    return () => document.removeEventListener('mousedown', onOutside)
  }, [activeDropdown, closeDropdowns])

  useEffect(() => {
    if (!activeDropdown || mobileOpen) return

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        closeDropdowns(activeDropdown)
      }
    }

    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [activeDropdown, closeDropdowns, mobileOpen])

  useEffect(() => {
    if (!mobileOpen) return

    const previousBodyOverflow = document.body.style.overflow
    const previousHtmlOverflow = document.documentElement.style.overflow
    const mobileToggle = mobileToggleRef.current
    lastFocusedElementRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    shouldRestoreMobileFocusRef.current = true

    document.body.style.overflow = 'hidden'
    document.documentElement.style.overflow = 'hidden'

    const panel = mobilePanelRef.current
    const focusable = getFocusableElements(panel)
    ;(focusable[0] ?? panel)?.focus()

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault()
        closeMobile()
        return
      }

      if (event.key !== 'Tab') return

      const focusTargets = getFocusableElements(panel)
      if (focusTargets.length === 0) return

      const first = focusTargets[0]
      const last = focusTargets[focusTargets.length - 1]
      const active = document.activeElement

      if (event.shiftKey && active === first) {
        event.preventDefault()
        last.focus()
      } else if (!event.shiftKey && active === last) {
        event.preventDefault()
        first.focus()
      }
    }

    document.addEventListener('keydown', onKeyDown)

    return () => {
      document.body.style.overflow = previousBodyOverflow
      document.documentElement.style.overflow = previousHtmlOverflow
      document.removeEventListener('keydown', onKeyDown)

      if (!shouldRestoreMobileFocusRef.current) return

      const restoreTarget = lastFocusedElementRef.current ?? mobileToggle
      if (restoreTarget && document.contains(restoreTarget)) {
        restoreTarget.focus()
      }
    }
  }, [closeMobile, mobileOpen])

  return (
    <>
      <header className="relative z-50 flex items-center justify-between w-full gap-4 border-b border-[var(--border-primary)] bg-[var(--bg-primary)] px-4 py-4 sm:px-6 lg:px-[80px]">
        <Link
          href="/"
          className="shrink-0 font-jetbrains text-xl font-bold tracking-[1px] text-[var(--text-primary)] sm:text-[22px]"
        >
          MUSASHI
        </Link>

        <nav
          ref={desktopNavRef}
          className="hidden md:flex items-center"
          aria-label="Main navigation"
        >
          {NAV_CONFIG.map((section) => {
            const sectionActive = isNavSectionActive(section, pathname)

            return section.children ? (
              <DropdownItem
                key={section.label}
                pathname={pathname}
                section={section}
                active={activeDropdown === section.label}
                current={sectionActive}
                buttonRef={(node) => {
                  dropdownButtonRefs.current[section.label] = node
                }}
                onOpen={() => openDropdown(section.label)}
                onOpenWithFocus={(index) => openDropdown(section.label, index)}
                onScheduleClose={scheduleClose}
                onToggle={() => toggleDropdown(section.label)}
                onClose={(restoreFocus = true) => closeDropdowns(restoreFocus ? section.label : null)}
              />
            ) : (
              <Link
                key={section.label}
                href={section.href ?? '/'}
                aria-current={sectionActive ? 'page' : undefined}
                className={`px-3 py-2 font-jetbrains text-[11px] font-medium uppercase tracking-[0.08em] transition-colors ${
                  sectionActive
                    ? 'text-[var(--text-primary)]'
                    : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
                }`}
              >
                {section.label}
              </Link>
            )
          })}
        </nav>

        <div className="flex shrink-0 items-center gap-2 sm:gap-3">
          {onInstallClick ? (
            <button
              type="button"
              onClick={onInstallClick}
              className="border border-[#FFFFFF40] bg-transparent px-4 py-[10px] sm:px-5 transition-colors hover:bg-[var(--overlay-light)]"
            >
              <span className="font-jetbrains text-xs font-bold text-[var(--text-primary)]">
                {installLabel}
              </span>
            </button>
          ) : (
            <Link
              href={installHref}
              className="border border-[#FFFFFF40] bg-transparent px-4 py-[10px] sm:px-5 transition-colors hover:bg-[var(--overlay-light)]"
            >
              <span className="font-jetbrains text-xs font-bold text-[var(--text-primary)]">
                Install
              </span>
            </Link>
          )}

          <button
            ref={mobileToggleRef}
            type="button"
            onClick={() => setMobileOpen((current) => !current)}
            className="flex h-10 w-10 items-center justify-center border border-[#FFFFFF24] bg-[#FFFFFF08] md:hidden"
            aria-label={mobileOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={mobileOpen}
            aria-controls={MOBILE_MENU_ID}
            aria-haspopup="dialog"
          >
            <span className="flex flex-col gap-[4px]">
              <span className={`block h-[1.5px] w-4 bg-white transition-transform ${mobileOpen ? 'translate-y-[5.5px] rotate-45' : ''}`} />
              <span className={`block h-[1.5px] w-4 bg-white transition-opacity ${mobileOpen ? 'opacity-0' : 'opacity-100'}`} />
              <span className={`block h-[1.5px] w-4 bg-white transition-transform ${mobileOpen ? '-translate-y-[5.5px] -rotate-45' : ''}`} />
            </span>
          </button>
        </div>
      </header>

      {mobileOpen && (
        <div
          className="fixed inset-0 z-40 bg-[#05070D]/88 backdrop-blur-md md:hidden"
          onClick={() => closeMobile()}
        >
          <div
            id={MOBILE_MENU_ID}
            ref={mobilePanelRef}
            role="dialog"
            aria-modal="true"
            aria-label="Site navigation"
            tabIndex={-1}
            className="absolute inset-x-4 top-[76px] max-h-[calc(100vh-100px)] overflow-y-auto rounded-[28px] border border-[#FFFFFF14] bg-[linear-gradient(180deg,#0B1018_0%,#080C12_100%)] p-5 shadow-[0_30px_120px_rgba(0,0,0,0.45)]"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="mb-5 flex items-center justify-between border-b border-[#FFFFFF10] pb-4">
              <div>
                <div className="font-jetbrains text-[10px] uppercase tracking-[0.22em] text-[#8C99AD]">
                  Navigation
                </div>
                <div className="mt-2 font-grotesk text-[28px] leading-none text-white">
                  Navigate fast.
                </div>
              </div>
              <span className="rounded-full border border-[#00FF88]/20 bg-[#00FF88]/10 px-3 py-1 font-jetbrains text-[10px] uppercase tracking-[0.16em] text-[#A7F3D0]">
                responsive
              </span>
            </div>

            <nav className="flex flex-col gap-5" aria-label="Mobile navigation">
              {NAV_CONFIG.map((section) => {
                const sectionActive = isNavSectionActive(section, pathname)

                return (
                  <div key={section.label}>
                    {section.children ? (
                      <>
                        <div className={`mb-2 font-jetbrains text-[9px] uppercase tracking-[0.2em] ${sectionActive ? 'text-[#A7F3D0]' : 'text-[#8C99AD]'}`}>
                          {section.label}
                        </div>
                        <div className="flex flex-col gap-[6px]">
                          {section.children.map((child) => {
                            const childActive = isNavHrefActive(pathname, child.href, child.matchMode)

                            return (
                              <Link
                                key={child.href}
                                href={child.href}
                                onClick={() => closeMobile(false)}
                                aria-current={childActive ? 'page' : undefined}
                                className={`block border px-4 py-3 font-jetbrains text-[11px] font-medium tracking-[0.06em] transition-colors ${
                                  childActive
                                    ? 'border-[#00FF88]/30 bg-[#00FF88]/10 text-white'
                                    : 'border-[#FFFFFF12] bg-[#FFFFFF06] text-white hover:bg-[#FFFFFF10]'
                                }`}
                              >
                                {child.label}
                              </Link>
                            )
                          })}
                        </div>
                      </>
                    ) : (
                      <Link
                        href={section.href ?? '/'}
                        onClick={() => closeMobile(false)}
                        aria-current={sectionActive ? 'page' : undefined}
                        className={`block border px-4 py-3 font-jetbrains text-[11px] font-medium uppercase tracking-[0.08em] transition-colors ${
                          sectionActive
                            ? 'border-[#00FF88]/30 bg-[#00FF88]/10 text-white'
                            : 'border-[#FFFFFF12] bg-[#FFFFFF06] text-white hover:bg-[#FFFFFF10]'
                        }`}
                      >
                        {section.label}
                      </Link>
                    )}
                  </div>
                )
              })}
            </nav>

            <div className={`mt-5 grid gap-3 ${mobileExtraAction ? 'grid-cols-2' : 'grid-cols-1'}`}>
              {onInstallClick ? (
                <button
                  type="button"
                  onClick={() => {
                    closeMobile()
                    onInstallClick()
                  }}
                  className="bg-white px-4 py-4 text-center"
                >
                  <span className="font-jetbrains text-[11px] font-bold text-[#0A0A0F]">SETUP</span>
                </button>
              ) : (
                <Link
                  href={installHref}
                  onClick={() => closeMobile(false)}
                  className="block bg-white px-4 py-4 text-center"
                >
                  <span className="font-jetbrains text-[11px] font-bold text-[#0A0A0F]">SETUP</span>
                </Link>
              )}
              {/* eslint-disable-next-line react-hooks/refs -- closeMobileNoRestore only accesses the ref inside a click handler, not during render */}
              {mobileExtraAction?.(closeMobileNoRestore)}
            </div>
          </div>
        </div>
      )}
    </>
  )
}

type DropdownItemProps = {
  pathname: string
  section: NavSection
  active: boolean
  current: boolean
  buttonRef: (node: HTMLButtonElement | null) => void
  onOpen: () => void
  onOpenWithFocus: (index: number) => void
  onScheduleClose: () => void
  onToggle: () => void
  onClose: (restoreFocus?: boolean) => void
}

function DropdownItem({
  pathname,
  section,
  active,
  current,
  buttonRef,
  onOpen,
  onOpenWithFocus,
  onScheduleClose,
  onToggle,
  onClose,
}: DropdownItemProps) {
  const triggerId = getDesktopTriggerId(section.label)
  const menuId = getDesktopMenuId(section.label)
  const itemCount = section.children?.length ?? 0

  const handleTriggerKeyDown = (event: ReactKeyboardEvent<HTMLButtonElement>) => {
    if (itemCount === 0) return

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        onOpenWithFocus(0)
        break
      case 'ArrowUp':
        event.preventDefault()
        onOpenWithFocus(itemCount - 1)
        break
      case 'Enter':
      case ' ':
        if (!active) {
          event.preventDefault()
          onOpenWithFocus(0)
        }
        break
      case 'Escape':
        if (active) {
          event.preventDefault()
          onClose()
        }
        break
      default:
        break
    }
  }

  const handleMenuKeyDown = (event: ReactKeyboardEvent<HTMLDivElement>) => {
    const items = getDropdownLinkElements(section.label)
    if (items.length === 0) return

    const currentIndex = items.findIndex((item) => item === document.activeElement)

    switch (event.key) {
      case 'ArrowDown':
        event.preventDefault()
        items[(currentIndex + 1 + items.length) % items.length]?.focus()
        break
      case 'ArrowUp':
        event.preventDefault()
        items[(currentIndex - 1 + items.length) % items.length]?.focus()
        break
      case 'Home':
        event.preventDefault()
        items[0]?.focus()
        break
      case 'End':
        event.preventDefault()
        items[items.length - 1]?.focus()
        break
      case 'Escape':
        event.preventDefault()
        onClose()
        break
      case 'Tab':
        onClose(false)
        break
      default:
        break
    }
  }

  return (
    <div
      className="relative"
      onMouseEnter={onOpen}
      onMouseLeave={onScheduleClose}
    >
      <button
        id={triggerId}
        ref={buttonRef}
        type="button"
        onClick={onToggle}
        onKeyDown={handleTriggerKeyDown}
        aria-haspopup="menu"
        aria-expanded={active}
        aria-controls={menuId}
        className={`flex items-center gap-[5px] px-3 py-2 font-jetbrains text-[11px] font-medium uppercase tracking-[0.08em] transition-colors ${
          active || current
            ? 'text-[var(--text-primary)]'
            : 'text-[var(--text-secondary)] hover:text-[var(--text-primary)]'
        }`}
      >
        {section.label}
        <svg
          className={`h-[9px] w-[9px] opacity-50 transition-transform duration-200 ${active ? 'rotate-180' : ''}`}
          viewBox="0 0 10 10"
          fill="none"
          aria-hidden
        >
          <path
            d="M1.5 3.5L5 7L8.5 3.5"
            stroke="currentColor"
            strokeWidth="1.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
        </svg>
      </button>

      {active && (
        <div className="absolute left-0 top-full z-50 pt-[6px]">
          <div
            id={menuId}
            role="menu"
            aria-labelledby={triggerId}
            data-nav-dropdown={getSectionSlug(section.label)}
            className="w-max min-w-[180px] max-w-[260px] border border-[var(--border-primary)] bg-[var(--bg-secondary)] shadow-[0_8px_40px_rgba(0,0,0,0.5)]"
            onKeyDown={handleMenuKeyDown}
          >
            <div className="border-b border-[var(--border-primary)] px-3 pb-2 pt-3">
              <span className="font-jetbrains text-[9px] uppercase tracking-[0.2em] text-[var(--text-tertiary)]">
                {section.label}
              </span>
            </div>
            <div className="py-1">
              {section.children?.map((child) => {
                const childActive = isNavHrefActive(pathname, child.href, child.matchMode)

                return (
                  <Link
                    key={child.href}
                    href={child.href}
                    role="menuitem"
                    data-nav-menuitem="true"
                    aria-current={childActive ? 'page' : undefined}
                    onClick={() => onClose(false)}
                    className={`group/link flex items-center justify-between px-3 py-[10px] font-jetbrains text-[11px] transition-colors ${
                      childActive
                        ? 'bg-[var(--overlay-light)] text-white'
                        : 'text-[var(--text-secondary)] hover:bg-[var(--overlay-light)] hover:text-white'
                    }`}
                  >
                    <span>{child.label}</span>
                    <span className={`ml-4 text-[#00FF88] transition-opacity ${childActive ? 'opacity-100' : 'opacity-0 group-hover/link:opacity-100'}`}>
                      →
                    </span>
                  </Link>
                )
              })}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function getSectionSlug(label: string) {
  return label.toLowerCase().replace(/\s+/g, '-')
}

function getDesktopTriggerId(label: string) {
  return `desktop-nav-trigger-${getSectionSlug(label)}`
}

function getDesktopMenuId(label: string) {
  return `desktop-nav-menu-${getSectionSlug(label)}`
}

function getDropdownLinkElements(label: string) {
  return Array.from(
    document.querySelectorAll<HTMLAnchorElement>(
      `[data-nav-dropdown="${getSectionSlug(label)}"] [data-nav-menuitem="true"]`,
    ),
  )
}

function getFocusableElements(container: HTMLElement | null) {
  if (!container) return []

  return Array.from(
    container.querySelectorAll<HTMLElement>(
      'a[href], button:not([disabled]), [tabindex]:not([tabindex="-1"])',
    ),
  )
}
