// Return visual pixels consistently, including older WebKit's unzoomed DOMRect.
export function getVisualRect(element) {
  const rect = element.getBoundingClientRect()
  const factor = parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--client-rect-factor')) || 1
  return Object.fromEntries(
    ['x', 'y', 'width', 'height', 'top', 'right', 'bottom', 'left'].map(key => [key, rect[key] * factor])
  )
}
