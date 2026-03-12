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
