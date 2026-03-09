<template>
  <div class="home-page">
    <!-- Hero Section -->
    <section class="hero">
      <div class="container">
        <div class="hero-content">
          <h1 class="hero-title">{{ $t('home.hero.title') }}</h1>
          <p class="hero-subtitle">{{ $t('home.hero.subtitle') }}</p>
        </div>
      </div>
    </section>

    <!-- Tools Grid -->
    <section class="tools-section">
      <div class="container">
        <h2 class="section-title">{{ $t('home.tools.title') }}</h2>
        <div class="tools-grid">
          <!-- Douyin Downloader Card -->
          <NuxtLink :to="localePath('/douyin-downloader')" class="tool-card">
            <div class="tool-icon">
              <svg width="32" height="32" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
            </div>
            <div class="tool-info">
              <h3 class="tool-name">{{ $t('tools.douyinDownloader.name') }}</h3>
              <p class="tool-desc">{{ $t('tools.douyinDownloader.shortDesc') }}</p>
            </div>
            <div class="tool-badge">{{ $t('common.free') }}</div>
          </NuxtLink>

          <!-- More tool cards will be added here -->
        </div>
      </div>
    </section>

    <!-- Ad Placement -->
    <div class="container">
      <AdBanner slot="homepage-bottom" variant="responsive" />
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const localePath = useLocalePath()

useSeoMeta({
  title: 'ToolSpace - Free Online Tools',
  ogTitle: 'ToolSpace - Free Online Tools',
  description: () => t('site.description'),
  ogDescription: () => t('site.description')
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
  font-size: 3rem;
  font-weight: 700;
  line-height: 1.15;
  color: var(--color-text);
  white-space: pre-line;
  letter-spacing: -0.02em;
}

.hero-subtitle {
  margin-top: var(--space-md);
  font-size: 1.125rem;
  color: var(--color-text-2);
  line-height: 1.6;
}

/* Tools Section */
.tools-section {
  padding-bottom: var(--space-2xl);
}

.section-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: var(--space-lg);
}

.tools-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(280px, 1fr));
  gap: var(--space-lg);
}

/* Tool Card */
.tool-card {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  padding: var(--space-lg);
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  text-decoration: none;
  color: inherit;
  transition: all var(--transition-base);
  position: relative;
}

.tool-card:hover {
  border-color: var(--color-primary);
  box-shadow: var(--shadow-md);
  transform: translateY(-2px);
}

.tool-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 52px;
  height: 52px;
  border-radius: var(--radius-md);
  background: var(--color-primary-light);
  color: var(--color-primary);
}

.tool-info {
  flex: 1;
}

.tool-name {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: var(--space-xs);
}

.tool-desc {
  font-size: 0.875rem;
  color: var(--color-text-2);
  line-height: 1.5;
}

.tool-badge {
  position: absolute;
  top: var(--space-md);
  right: var(--space-md);
  padding: 2px 10px;
  border-radius: var(--radius-full);
  background: var(--color-success);
  color: white;
  font-size: 0.7rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
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
