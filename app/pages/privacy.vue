<template>
  <div class="privacy-page">
    <div class="container">
      <div class="content-narrow">
        <div class="page-header">
          <h1 class="page-title">
            {{ $t('privacy.title') }}
          </h1>
          <p class="page-meta">
            {{ $t('privacy.lastUpdated', { date: '2025-01-01' }) }}
          </p>
        </div>

        <div class="privacy-content">
          <section
            v-for="(section, index) in sections"
            :key="index"
            class="privacy-section"
          >
            <h2 class="section-title">
              {{ $t(`privacy.sections.${section}.title`) }}
            </h2>
            <div class="section-content">
              <p
                v-for="(paragraph, pIndex) in getParagraphs($t(`privacy.sections.${section}.content`))"
                :key="pIndex"
                class="paragraph"
              >
                {{ paragraph }}
              </p>
            </div>
          </section>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getCanonicalUrl } from '~/utils/seo'

const { t, locale } = useI18n()
const route = useRoute()

const canonicalUrl = computed(() => getCanonicalUrl(route.path, locale.value))
const sections = [
  'collection',
  'usage',
  'security',
  'cookies',
  'thirdParty',
  'changes',
  'contact'
]

function getParagraphs(text: string): string[] {
  return text.split('\n').filter(p => p.trim())
}

useSeoMeta({
  title: () => `${t('privacy.title')} | ToolSpace`,
  ogTitle: () => `${t('privacy.title')} | ToolSpace`,
  description: () => t('privacy.seo.description') || t('site.description'),
  ogDescription: () => t('privacy.seo.description') || t('site.description'),
  ogUrl: canonicalUrl.value,
  ogType: 'article',
  ogSiteName: 'ToolSpace',
  twitterCard: 'summary',
  twitterTitle: () => `${t('privacy.title')} | ToolSpace`,
  twitterDescription: () => t('privacy.seo.description') || t('site.description')
})

useHead({
  link: [
    {
      rel: 'canonical',
      href: canonicalUrl.value
    },
    {
      rel: 'alternate',
      hreflang: 'en',
      href: getCanonicalUrl(route.path, 'en')
    },
    {
      rel: 'alternate',
      hreflang: 'zh-CN',
      href: getCanonicalUrl(route.path, 'zh-CN')
    },
    {
      rel: 'alternate',
      hreflang: 'zh-TW',
      href: getCanonicalUrl(route.path, 'zh-TW')
    },
    {
      rel: 'alternate',
      hreflang: 'ja',
      href: getCanonicalUrl(route.path, 'ja')
    },
    {
      rel: 'alternate',
      hreflang: 'ko',
      href: getCanonicalUrl(route.path, 'ko')
    },
    {
      rel: 'alternate',
      hreflang: 'x-default',
      href: canonicalUrl.value
    }
  ],
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify({
        '@context': 'https://schema.org',
        '@type': 'WebPage',
        'name': t('privacy.title'),
        'description': t('privacy.seo.description') || t('site.description'),
        'url': canonicalUrl.value
      })
    }
  ],
  htmlAttrs: {
    lang: locale.value
  }
})
</script>

<style scoped>
.privacy-page {
  padding: var(--space-3xl) 0 var(--space-2xl);
}

.page-header {
  margin-bottom: var(--space-2xl);
  padding-bottom: var(--space-lg);
  border-bottom: 1px solid var(--color-border);
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: var(--space-sm);
  line-height: 1.2;
}

.page-meta {
  font-size: 0.875rem;
  color: var(--color-text-2);
}

.privacy-section {
  margin-bottom: var(--space-xl);
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: var(--space-md);
}

.paragraph {
  color: var(--color-text);
  line-height: 1.6;
  margin-bottom: var(--space-md);
}

.paragraph:last-child {
  margin-bottom: 0;
}

@media (max-width: 640px) {
  .privacy-page {
    padding: var(--space-2xl) 0 var(--space-xl);
  }

  .page-title {
    font-size: 2rem;
  }
}
</style>
