/**
 * Utility to generate canonical URL for current page
 */
export function getCanonicalUrl(path: string, locale: string = 'en'): string {
  const baseUrl = 'https://tooltool.services'
  const cleanPath = (path || '').split('?')[0].replace(/\/$/, '')

  // If locale is default (en), don't prefix
  if (locale === 'en') {
    return `${baseUrl}${cleanPath || '/'}`
  }

  // Handle localed paths (prefixing except default)
  return `${baseUrl}/${locale}${cleanPath || '/'}`
}

/**
 * Common SEO Meta tags generator
 */
export function generateCommonSeo(title: string, description: string, url: string) {
  return {
    title,
    ogTitle: title,
    twitterTitle: title,
    description,
    ogDescription: description,
    twitterDescription: description,
    ogUrl: url,
    canonical: url
  }
}
