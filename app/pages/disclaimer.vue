<template>
  <div class="disclaimer-page">
    <div class="container">
      <article class="content">
        <header class="page-header">
          <h1>{{ $t('disclaimer.title') }}</h1>
          <p class="last-updated">{{ $t('disclaimer.lastUpdated', { date: formatDate(new Date()) }) }}</p>
        </header>

        <section class="disclaimer-section">
          <h2>{{ $t('disclaimer.sections.serviceNature.title') }}</h2>
          <p>{{ $t('disclaimer.sections.serviceNature.content') }}</p>
        </section>

        <section class="disclaimer-section">
          <h2>{{ $t('disclaimer.sections.userResponsibility.title') }}</h2>
          <p>{{ $t('disclaimer.sections.userResponsibility.content') }}</p>
        </section>

        <section class="disclaimer-section">
          <h2>{{ $t('disclaimer.sections.copyright.title') }}</h2>
          <p>{{ $t('disclaimer.sections.copyright.content') }}</p>
        </section>

        <section class="disclaimer-section">
          <h2>{{ $t('disclaimer.sections.limitation.title') }}</h2>
          <p>{{ $t('disclaimer.sections.limitation.content') }}</p>
        </section>

        <section class="disclaimer-section">
          <h2>{{ $t('disclaimer.sections.accuracy.title') }}</h2>
          <p>{{ $t('disclaimer.sections.accuracy.content') }}</p>
        </section>

        <section class="disclaimer-section">
          <h2>{{ $t('disclaimer.sections.governingLaw.title') }}</h2>
          <p>{{ $t('disclaimer.sections.governingLaw.content') }}</p>
        </section>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getCanonicalUrl } from '~/utils/seo'

const { t, locale } = useI18n()
const route = useRoute()

const canonicalUrl = computed(() => getCanonicalUrl(route.path, locale.value))

useSeoMeta({
  title: t('disclaimer.seo.title'),
  ogTitle: t('disclaimer.seo.title'),
  description: t('disclaimer.seo.description'),
  ogDescription: t('disclaimer.seo.description'),
  ogUrl: canonicalUrl.value,
  ogType: 'website',
  ogSiteName: 'ToolSpace'
})

const formatDate = (date: Date) => {
  return new Intl.DateTimeFormat(locale.value, {
    year: 'numeric',
    month: 'long',
    day: 'numeric'
  }).format(date)
}
</script>

<style scoped>
.disclaimer-page {
  padding: var(--space-2xl) 0;
}

.page-header {
  text-align: center;
  margin-bottom: var(--space-xl);
}

.page-header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: var(--space-sm);
}

.last-updated {
  color: var(--color-text-2);
  font-style: italic;
  margin-bottom: var(--space-xl);
}

.content {
  max-width: 800px;
  margin: 0 auto;
}

.disclaimer-section {
  margin-bottom: var(--space-xl);
}

.disclaimer-section h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: var(--space-md);
}

.disclaimer-section p {
  color: var(--color-text-2);
  line-height: 1.7;
  margin-bottom: var(--space-md);
}

.disclaimer-section ul {
  margin-left: var(--space-lg);
  margin-bottom: var(--space-md);
}

.disclaimer-section li {
  margin-bottom: var(--space-sm);
  line-height: 1.6;
  color: var(--color-text-2);
}
</style>