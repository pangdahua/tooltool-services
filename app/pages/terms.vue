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
            v-for="(section, key) in sections"
            :key="key"
            class="terms-section"
          >
            <h2 class="section-title">
              {{ $t(`terms.sections.${key}.title`) }}
            </h2>
            <div class="section-content">
              <p
                v-for="(paragraph, index) in getParagraphs($t(`terms.sections.${key}.content`))"
                :key="index"
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
const { t, locale } = useI18n()

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
  description: () => t('site.description')
})

useHead({
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
  font-size: 2.5rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: var(--space-sm);
  line-height: 1.1;
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
  line-height: 1.75;
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
