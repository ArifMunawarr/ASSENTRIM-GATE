import React, { useLayoutEffect, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import { getVisualRect } from '../utils/viewport'

// Keep the original inline composition whenever it fits. Use a portal only
// when the viewport or an ancestor would cut off the dropdown's content.
export default function AnchoredPopover({ anchorRef, onClose, gap = 4, matchAnchorWidth = false, className, children }) {
  const popoverRef = useRef(null)
  const [isPortaled, setIsPortaled] = useState(false)

  useLayoutEffect(() => {
    const anchor = anchorRef.current
    const popover = popoverRef.current
    if (!anchor || !popover) return

    let frame = 0

    function positionPopover() {
      // Normalize browser geometry before converting to local design pixels.
      const zoom = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--z')) || 1
      const anchorRect = getVisualRect(anchor)
      const anchorStyle = getComputedStyle(anchor)
      const viewport = window.visualViewport
      const viewportLeft = viewport?.offsetLeft || 0
      const viewportTop = viewport?.offsetTop || 0
      const viewportWidth = viewport?.width || document.documentElement.clientWidth
      const viewportHeight = viewport?.height || window.innerHeight
      const edge = 8 * zoom
      const spacing = gap * zoom
      const scrollTop = popover.scrollTop

      function fitsInline(rect) {
        if (rect.left < viewportLeft + edge || rect.right > viewportLeft + viewportWidth - edge ||
            rect.top < viewportTop + edge || rect.bottom > viewportTop + viewportHeight - edge) return false

        for (let parent = anchor.parentElement; parent && parent !== document.body; parent = parent.parentElement) {
          const style = getComputedStyle(parent)
          const clipsX = /^(auto|scroll|hidden|clip)$/.test(style.overflowX)
          const clipsY = /^(auto|scroll|hidden|clip)$/.test(style.overflowY)
          if (!clipsX && !clipsY) continue
          const bounds = getVisualRect(parent)
          const left = bounds.left + parent.clientLeft * zoom
          const top = bounds.top + parent.clientTop * zoom
          const right = left + parent.clientWidth * zoom
          const bottom = top + parent.clientHeight * zoom
          if (clipsX && (rect.left < left - 0.5 || rect.right > right + 0.5)) return false
          if (clipsY && (rect.top < top - 0.5 || rect.bottom > bottom + 0.5)) return false
        }
        return true
      }

      if (!isPortaled) {
        if (!fitsInline(getVisualRect(popover))) {
          setIsPortaled(true)
          return
        }
        popover.style.visibility = 'visible'
        popover.dataset.placement = 'bottom'
        return
      }

      popover.style.fontFamily = anchorStyle.fontFamily
      popover.style.color = anchorStyle.color
      popover.style.width = matchAnchorWidth ? `${anchorRect.width / zoom}px` : ''
      popover.style.maxWidth = 'none'
      popover.style.maxHeight = 'none'

      const naturalRect = getVisualRect(popover)
      if (fitsInline({
        left: anchorRect.left,
        top: anchorRect.bottom + spacing,
        right: anchorRect.left + naturalRect.width,
        bottom: anchorRect.bottom + spacing + naturalRect.height,
      })) {
        setIsPortaled(false)
        return
      }
      popover.style.maxWidth = `${Math.max(0, viewportWidth - edge * 2) / zoom}px`
      const popupRect = getVisualRect(popover)
      const below = Math.max(0, viewportTop + viewportHeight - edge - anchorRect.bottom - spacing)
      const above = Math.max(0, anchorRect.top - spacing - viewportTop - edge)
      const opensAbove = popupRect.height > below && above > below
      const availableHeight = Math.min(opensAbove ? above : below, Math.max(0, viewportHeight - edge * 2))
      const height = Math.min(popupRect.height, availableHeight)
      const left = Math.max(viewportLeft + edge, Math.min(anchorRect.left, viewportLeft + viewportWidth - edge - popupRect.width))
      const desiredTop = opensAbove ? anchorRect.top - spacing - height : anchorRect.bottom + spacing
      const top = Math.max(viewportTop + edge, Math.min(desiredTop, viewportTop + viewportHeight - edge - height))

      popover.style.left = `${left / zoom}px`
      popover.style.top = `${top / zoom}px`
      popover.style.maxHeight = `${availableHeight / zoom}px`
      popover.scrollTop = scrollTop
      popover.style.visibility = 'visible'
      popover.dataset.placement = opensAbove ? 'top' : 'bottom'
    }

    function schedulePosition(event) {
      if (event?.type === 'scroll' && popover.contains(event.target)) return
      cancelAnimationFrame(frame)
      frame = requestAnimationFrame(positionPopover)
    }

    function handleOutside(event) {
      if (!anchor.contains(event.target) && !popover.contains(event.target)) onClose()
    }

    function handleKeyDown(event) {
      if (event.key === 'Escape') {
        event.preventDefault()
        onClose()
      }
    }

    positionPopover()
    const observer = new ResizeObserver(schedulePosition)
    observer.observe(anchor)
    observer.observe(popover)
    window.addEventListener('resize', schedulePosition)
    document.addEventListener('scroll', schedulePosition, true)
    window.visualViewport?.addEventListener('resize', schedulePosition)
    window.visualViewport?.addEventListener('scroll', schedulePosition)
    document.addEventListener('pointerdown', handleOutside)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('resize', schedulePosition)
      document.removeEventListener('scroll', schedulePosition, true)
      window.visualViewport?.removeEventListener('resize', schedulePosition)
      window.visualViewport?.removeEventListener('scroll', schedulePosition)
      document.removeEventListener('pointerdown', handleOutside)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [anchorRef, onClose, gap, matchAnchorWidth, children, isPortaled])

  const popover = (
    <div
      ref={popoverRef}
      data-anchored-popover=""
      data-portaled={isPortaled}
      className={className}
      style={isPortaled
        ? { position: 'fixed', visibility: 'hidden', overflowY: 'auto', overscrollBehavior: 'contain' }
        : { position: 'absolute', top: '100%', left: 0, marginTop: gap, width: matchAnchorWidth ? '100%' : undefined, visibility: 'hidden' }}
    >
      {children}
    </div>
  )

  return isPortaled ? createPortal(popover, document.body) : popover
}
