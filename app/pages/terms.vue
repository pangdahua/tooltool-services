<template>
  <div class="terms-page">
    <div class="container">
      <div class="content-narrow">
        <div class="page-header">
          <h1 class="page-title">
            {{ $t('terms.title') }}
          </h1>
          <p class="page-meta">
            {{ $t('terms.lastUpdated', { date: '2025-01-01' }) }}
          </p>
        </div>

        <div class="terms-content">
          <section
            v-for="(section, index) in sections"
            :key="index"
            class="terms-section"
          >
            <h2 class="section-title">
              {{ $t(`terms.sections.${section}.title`) }}
            </h2>
            <div class="section-content">
              <p
                v-for="(paragraph, pIndex) in getParagraphs($t(`terms.sections.${section}.content`))"
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
  'acceptance',
  'serviceDescription',
  'userResponsibilities',
  'prohibitedUses',
  'intellectualProperty',
  'userContent',
  'serviceAvailability',
  'disclaimer',
  'limitation',
  'indemnification',
  'changes',
  'termination',
  'governingLaw',
  'contact'
]

function getParagraphs(text: string): string[] {
  return text.split('\n').filter(p => p.trim())
}

useSeoMeta({
  title: () => `${t('terms.title')} | ToolSpace`,
  ogTitle: () => `${t('terms.title')} | ToolSpace`,
  description: () => t('terms.seo.description') || t('site.description'),
  ogDescription: () => t('terms.seo.description') || t('site.description'),
  ogUrl: canonicalUrl.value,
  ogType: 'article',
  ogSiteName: 'ToolSpace',
  twitterCard: 'summary',
  twitterTitle: () => `${t('terms.title')} | ToolSpace`,
  twitterDescription: () => t('terms.seo.description') || t('site.description')
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
        '@type': 'LegalService',
        'name': t('terms.title'),
        'description': t('terms.seo.description') || t('site.description'),
        'url': canonicalUrl.value,
        'provider': {
          '@type': 'Organization',
          'name': 'ToolSpace'
        }
      })
    }
  ],
  htmlAttrs: {
    lang: locale.value
  }
})
</script>

<style scoped>
.terms-page {
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

.terms-section {
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
  .terms-page {
    padding: var(--space-2xl) 0 var(--space-xl);
  }

  .page-title {
    font-size: 2rem;
  }
}
</style>
