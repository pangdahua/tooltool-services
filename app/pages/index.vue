<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title">
            {{ $t('home.hero.title') }}
          </h1>
          <p class="hero-subtitle">
            {{ $t('home.hero.subtitle') }}
          </p>
        </div>
      </div>
    </section>

    <!-- Tools Grid -->
    <section class="tools-section">
      <div class="container">
        <h2 class="section-title">
          {{ $t('home.tools.title') }}
        </h2>
        <div class="tools-grid">
          <!-- Douyin Downloader Card -->
          <NuxtLink
            :to="localePath('/douyin-downloader')"
            class="tool-card platform-douyin"
          >
            <div class="tool-icon">
              <svg
                width="32"
                height="32"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                stroke-width="2"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line
                  x1="12"
                  y1="15"
                  x2="12"
                  y2="3"
                />
              </svg>
            </div>
            <div class="tool-info">
              <h3 class="tool-name">{{ $t('tools.douyinDownloader.name') }}</h3>
              <p class="tool-desc">{{ $t('tools.douyinDownloader.shortDesc') }}</p>
            </div>
            <div class="tool-badge">{{ $t('common.free') }}</div>
          </NuxtLink>

          <!-- TikTok Downloader Card -->
          <NuxtLink
            :to="localePath('/tools/tiktok-downloader')"
            class="tool-card platform-tiktok"
          >
            <div class="tool-icon">
              <span class="platform-icon">Tk</span>
            </div>
            <div class="tool-info">
              <h3 class="tool-name">{{ $t('tools.tiktokDownloader.name') }}</h3>
              <p class="tool-desc">{{ $t('tools.tiktokDownloader.description') }}</p>
            </div>
            <div class="tool-badge">{{ $t('common.free') }}</div>
          </NuxtLink>

          <!-- YouTube Downloader Card -->
          <NuxtLink
            :to="localePath('/tools/youtube-downloader')"
            class="tool-card platform-youtube"
          >
            <div class="tool-icon">
              <span class="platform-icon">YT</span>
            </div>
            <div class="tool-info">
              <h3 class="tool-name">{{ $t('tools.youtubeDownloader.name') }}</h3>
              <p class="tool-desc">{{ $t('tools.youtubeDownloader.description') }}</p>
            </div>
            <div class="tool-badge">{{ $t('common.free') }}</div>
          </NuxtLink>

          <!-- Bilibili Downloader Card -->
          <NuxtLink
            :to="localePath('/tools/bilibili-downloader')"
            class="tool-card platform-bilibili"
          >
            <div class="tool-icon">
              <span class="platform-icon">B</span>
            </div>
            <div class="tool-info">
              <h3 class="tool-name">{{ $t('tools.bilibiliDownloader.name') }}</h3>
              <p class="tool-desc">{{ $t('tools.bilibiliDownloader.description') }}</p>
            </div>
            <div class="tool-badge">{{ $t('common.free') }}</div>
          </NuxtLink>

          <!-- Red Downloader Card -->
          <NuxtLink
            :to="localePath('/tools/red-downloader')"
            class="tool-card platform-red"
          >
            <div class="tool-icon">
              <span class="platform-icon">红</span>
            </div>
            <div class="tool-info">
              <h3 class="tool-name">{{ $t('tools.redDownloader.name') }}</h3>
              <p class="tool-desc">{{ $t('tools.redDownloader.description') }}</p>
            </div>
            <div class="tool-badge">{{ $t('common.free') }}</div>
          </NuxtLink>
        </div>
      </div>
    </section>

    <!-- How It Works Section -->
    <section class="how-it-works-section">
      <div class="container">
        <h2 class="section-title">
          {{ $t('home.howItWorks.title') }}
        </h2>
        <div class="steps-grid">
          <div class="step-card">
            <div class="step-number">
              1
            </div>
            <h3 class="step-title">
              {{ $t('home.howItWorks.step1.title') }}
            </h3>
            <p class="step-description">
              {{ $t('home.howItWorks.step1.description') }}
            </p>
          </div>

          <div class="step-card">
            <div class="step-number">
              2
            </div>
            <h3 class="step-title">
              {{ $t('home.howItWorks.step2.title') }}
            </h3>
            <p class="step-description">
              {{ $t('home.howItWorks.step2.description') }}
            </p>
          </div>

          <div class="step-card">
            <div class="step-number">
              3
            </div>
            <h3 class="step-title">
              {{ $t('home.howItWorks.step3.title') }}
            </h3>
            <p class="step-description">
              {{ $t('home.howItWorks.step3.description') }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- Features Section -->
    <section class="features-section">
      <div class="container">
        <h2 class="section-title">
          {{ $t('home.features.title') }}
        </h2>
        <div class="features-grid">
          <div class="feature-card">
            <div class="feature-icon">
              <UIcon name="i-heroicons-bolt-solid" />
            </div>
            <h3 class="feature-title">
              {{ $t('home.features.feature1.title') }}
            </h3>
            <p class="feature-description">
              {{ $t('home.features.feature1.description') }}
            </p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <UIcon name="i-heroicons-shield-check-solid" />
            </div>
            <h3 class="feature-title">
              {{ $t('home.features.feature2.title') }}
            </h3>
            <p class="feature-description">
              {{ $t('home.features.feature2.description') }}
            </p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <UIcon name="i-heroicons-lock-closed-solid" />
            </div>
            <h3 class="feature-title">
              {{ $t('home.features.feature3.title') }}
            </h3>
            <p class="feature-description">
              {{ $t('home.features.feature3.description') }}
            </p>
          </div>
          <div class="feature-card">
            <div class="feature-icon">
              <UIcon name="i-heroicons-device-phone-mobile-solid" />
            </div>
            <h3 class="feature-title">
              {{ $t('home.features.feature4.title') }}
            </h3>
            <p class="feature-description">
              {{ $t('home.features.feature4.description') }}
            </p>
          </div>
        </div>
      </div>
    </section>

    <!-- FAQ Section -->
    <section class="faq-section">
      <div class="container">
        <h2 class="section-title">
          {{ $t('home.faq.title') }}
        </h2>
        <div class="faq-container">
          <UAccordion
            :items="faqItems"
            variant="soft"
          />
        </div>
      </div>
    </section>

    <!-- Ad Placement -->
    <div class="container">
      <AdBanner
        ad-slot="homepage-bottom"
        variant="responsive"
      />
    </div>
  </div>
</template>

<script setup lang="ts">
import { getCanonicalUrl } from '~/utils/seo'
import { generateWebSiteSchema } from '~/utils/schema'

const { t, locale } = useI18n()
const localePath = useLocalePath()
const route = useRoute()

const canonicalUrl = computed(() => getCanonicalUrl(route.path, locale.value))
const title = computed(() => t('home.seo.title') || 'ToolSpace - Free Online Tools & Video Downloader')
const description = computed(() => t('home.seo.description') || t('site.description'))

useSeoMeta({
  title: title.value,
  ogTitle: title.value,
  description: description.value,
  ogDescription: description.value,
  ogImage: '/images/home-og-image.jpg', // Placeholder - should be replaced with actual image
  ogUrl: canonicalUrl.value,
  ogType: 'website',
  ogSiteName: 'ToolSpace',
  twitterCard: 'summary_large_image',
  twitterTitle: title.value,
  twitterDescription: description.value,
  twitterImage: '/images/home-twitter-image.jpg', // Placeholder - should be replaced with actual image
  twitterSite: '@toolspacesite' // Placeholder - should be replaced with actual Twitter handle
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
      innerHTML: JSON.stringify(generateWebSiteSchema())
    }
  ],
  htmlAttrs: {
    lang: locale.value
  }
})

const faqItems = computed(() => [
  {
    label: t('home.faq.q1.question'),
    content: t('home.faq.q1.answer')
  },
  {
    label: t('home.faq.q2.question'),
    content: t('home.faq.q2.answer')
  },
  {
    label: t('home.faq.q3.question'),
    content: t('home.faq.q3.answer')
  },
  {
    label: t('home.faq.q4.question'),
    content: t('home.faq.q4.answer')
  },
  {
    label: t('home.faq.q5.question'),
    content: t('home.faq.q5.answer')
  }
])
</script>

<style scoped>
/* Hero */
.hero {
  padding: var(--space-3xl) 0 var(--space-2xl);
  text-align: center;
}

.hero-content {
  max-width: 600px;
  margin: 0 auto;
}

.hero-title {
  font-size: 3.5rem;
  font-weight: 800;
  line-height: 1.1;
  color: var(--color-text);
  letter-spacing: -0.04em;
  background: linear-gradient(135deg, var(--color-primary), #a855f7);
  -webkit-background-clip: text;
  background-clip: text;
  -webkit-text-fill-color: transparent;
}

.hero-subtitle {
  margin-top: var(--space-md);
  font-size: 1.25rem;
  color: var(--color-text-2);
  line-height: 1.6;
}

/* Tools Section */
.tools-section {
  padding-bottom: var(--space-3xl);
}

.section-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: var(--space-xl);
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: var(--space-xl);
}

/* Tool Card */
.tool-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  padding: var(--space-xl);
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-xl);
  text-decoration: none;
  color: inherit;
  transition: all var(--transition-base);
  position: relative;
  box-shadow: var(--shadow-sm);
}

.tool-card:hover {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-lg);
  transform: translateY(-6px);
}

/* Platform-specific hover states */
.platform-douyin:hover { border-color: var(--color-douyin); }
.platform-tiktok:hover { border-color: var(--color-tiktok); }
.platform-youtube:hover { border-color: var(--color-youtube); }
.platform-bilibili:hover { border-color: var(--color-bilibili); }
.platform-red:hover { border-color: var(--color-red-note); }

.tool-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 56px;
  height: 56px;
  border-radius: 14px;
  background: var(--color-primary-light);
  color: var(--color-primary);
  font-weight: 800;
  font-size: 1.25rem;
  transition: all var(--transition-base);
}

.platform-douyin .tool-icon { color: var(--color-douyin); background: rgba(254, 44, 85, 0.1); }
.platform-tiktok .tool-icon { color: var(--color-tiktok); background: rgba(0, 242, 234, 0.1); }
.platform-youtube .tool-icon { color: var(--color-youtube); background: rgba(255, 0, 0, 0.1); }
.platform-bilibili .tool-icon { color: var(--color-bilibili); background: rgba(0, 174, 236, 0.1); }
.platform-red .tool-icon { color: var(--color-red-note); background: rgba(255, 36, 66, 0.1); }

.tool-card:hover .tool-icon {
  transform: scale(1.1) rotate(-5deg);
}

/* How It Works Section */
.how-it-works-section {
  padding: var(--space-3xl) 0;
  background: var(--color-surface-light);
}

.steps-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: var(--space-xl);
  margin-top: var(--space-xl);
}

.step-card {
  background: var(--color-white);
  padding: var(--space-xl);
  border-radius: var(--radius-lg);
  text-align: center;
  box-shadow: var(--shadow-sm);
  transition: transform var(--transition-base), box-shadow var(--transition-base);
}

.step-card:hover {
  transform: translateY(-8px);
  box-shadow: var(--shadow-lg);
}

.step-number {
  width: 48px;
  height: 48px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-primary);
  color: white;
  border-radius: 50%;
  font-size: 1.25rem;
  font-weight: 700;
  margin: 0 auto var(--space-lg);
}

.step-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: var(--space-md);
}

.step-description {
  color: var(--color-text-2);
  line-height: 1.6;
}

/* Features Section */
.features-section {
  padding: var(--space-3xl) 0;
}

.features-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
  gap: var(--space-xl);
  margin-top: var(--space-xl);
}

.feature-card {
  background: var(--color-surface);
  padding: var(--space-xl);
  border-radius: var(--radius-lg);
  text-align: center;
  transition: transform var(--transition-base), box-shadow var(--transition-base);
}

.feature-card:hover {
  transform: translateY(-4px);
  box-shadow: var(--shadow-md);
}

.feature-icon {
  width: 64px;
  height: 64px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-primary-light);
  color: var(--color-primary);
  border-radius: var(--radius-full);
  margin: 0 auto var(--space-md);
  font-size: 1.5rem;
}

.feature-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: var(--space-md);
}

.feature-description {
  color: var(--color-text-2);
  line-height: 1.6;
}

/* FAQ Section */
.faq-section {
  padding: var(--space-3xl) 0;
  background: var(--color-surface-light);
}

.faq-container {
  max-width: 800px;
  margin: var(--space-xl) auto 0;
}

.faq-container :deep(.u-accordion) {
  font-family: inherit;
  font-size: 1rem;
}

.faq-container :deep(.u-accordion-item) {
  margin-bottom: var(--space-sm);
  border-radius: var(--radius-md);
  overflow: hidden;
  background: var(--color-white);
  box-shadow: var(--shadow-sm);
  border: 1px solid var(--color-border);
}

.faq-container :deep(.u-accordion-item:last-child) {
  margin-bottom: 0;
}

.faq-container :deep(.u-accordion-item-content) {
  padding: var(--space-md) var(--space-lg);
  background: var(--color-surface);
  color: var(--color-text-2);
  line-height: 1.6;
  font-size: 0.95rem;
}

.faq-container :deep(.u-accordion-item-trigger) {
  padding: var(--space-md) var(--space-lg);
  font-weight: 600;
  color: var(--color-text);
  background: var(--color-white);
  width: 100%;
  text-align: left;
  transition: background-color var(--transition-base);
  font-size: 1rem;
  border: none;
  outline: none;
}

.faq-container :deep(.u-accordion-item-trigger:hover) {
  background: var(--color-surface);
}

.faq-container :deep(.u-accordion-item-body) {
  border-top: 1px solid var(--color-border);
}

.faq-container :deep(.u-accordion-item-label) {
  font-weight: 600;
  color: var(--color-text);
}

.tool-info {
  flex: 1;
}

.tool-name {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: var(--space-xs);
}

.tool-desc {
  font-size: 0.9375rem;
  color: var(--color-text-2);
  line-height: 1.5;
}

.tool-badge {
  position: absolute;
  top: var(--space-lg);
  right: var(--space-lg);
  padding: 4px 12px;
  border-radius: var(--radius-full);
  background: var(--color-success);
  color: white;
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  box-shadow: 0 2px 4px rgba(0,0,0,0.1);
}

@media (max-width: 640px) {
  .hero {
    padding: var(--space-2xl) 0 var(--space-xl);
  }

  .hero-title {
    font-size: 2rem;
  }

  .hero-subtitle {
    font-size: 1rem;
  }
}
</style>
