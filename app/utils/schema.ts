/**
 * Generate SoftwareApplication JSON-LD for downloader tools
 */
export function generateDownloaderSchema(name: string, description: string, url: string) {
  return {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    'name': name,
    'description': description,
    'applicationCategory': 'MultimediaApplication',
    'operatingSystem': 'Windows, macOS, Linux, Android, iOS',
    'url': url,
    'offers': {
      '@type': 'Offer',
      'price': '0',
      'priceCurrency': 'USD'
    }
  }
}

/**
 * Generate WebSite Schema for home page
 */
export function generateWebSiteSchema() {
  return {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    'name': 'ToolSpace',
    'url': 'https://tooltool.services',
    'potentialAction': {
      '@type': 'SearchAction',
      'target': {
        '@type': 'EntryPoint',
        'urlTemplate': 'https://tooltool.services/search?q={search_term_string}'
      },
      'query-input': 'required name=search_term_string'
    }
  }
}
