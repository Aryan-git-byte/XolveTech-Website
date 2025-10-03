import DOMPurify from 'dompurify'

/**
 * Sanitizes HTML content to prevent XSS attacks
 * @param dirty - The potentially unsafe HTML string
 * @returns Sanitized HTML string safe for rendering
 */
export const sanitizeHtml = (dirty: string): string => {
  return DOMPurify.sanitize(dirty, {
    ALLOWED_TAGS: ['b', 'i', 'em', 'strong', 'br', 'p'],
    ALLOWED_ATTR: [],
    KEEP_CONTENT: true
  })
}

/**
 * Sanitizes plain text content by escaping HTML entities
 * @param text - The text to sanitize
 * @returns Escaped text safe for display
 */
export const sanitizeText = (text: string): string => {
  const div = document.createElement('div')
  div.textContent = text
  return div.innerHTML
}

/**
 * Sanitizes user input for safe display in React components
 * Use this for any user-generated content that might contain HTML
 */
export const createSafeHtml = (content: string) => {
  return { __html: sanitizeHtml(content) }
}