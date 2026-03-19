<template>
  <div class="downloader-page platform-tiktok">
    <div class="container">
      <div class="page-layout">
        <div class="page-main">
          <div class="page-header">
            <h1 class="page-title">
              {{ $t('tools.tiktokDownloader.name') }}
            </h1>
            <p class="page-desc">
              {{ $t('tools.tiktokDownloader.description') }}
            </p>
            <div class="page-intro">
              <p>{{ $t('tools.tiktokDownloader.intro') }}</p>
              <ul class="features-list">
                <li>{{ $t('tools.tiktokDownloader.features.noWaterMark') }}</li>
                <li>{{ $t('tools.tiktokDownloader.features.highQuality') }}</li>
                <li>{{ $t('tools.tiktokDownloader.features.fastDownload') }}</li>
              </ul>
            </div>
          </div>

          <div class="download-card">
            <div class="input-group">
              <input
                v-model="url"
                type="url"
                class="url-input"
                :placeholder="$t('tools.tiktokDownloader.inputPlaceholder')"
                :disabled="isLoading"
                @keydown.enter="handleDownload"
              >
              <button
                class="download-btn"
                :disabled="isLoading || !url.trim()"
                @click="handleDownload"
              >
                <span
                  v-if="isLoading"
                  class="btn-spinner"
                />
                <span
                  v-else
                  class="btn-icon"
                >↓</span>
                {{ isLoading ? $t('tools.tiktokDownloader.downloading') : $t('tools.tiktokDownloader.downloadBtn') }}
              </button>
            </div>

            <div class="turnstile-wrapper">
              <NuxtTurnstile
                ref="turnstile"
                v-model="turnstileToken"
              />
              <ServiceAgreement />
            </div>

            <Transition name="fade">
              <div
                v-if="errorMsg"
                class="error-message"
              >
                <span class="error-icon">⚠</span>
                {{ errorMsg }}
              </div>
            </Transition>
          </div>

          <Transition name="slide">
            <div
              v-if="result"
              class="result-card"
            >
              <h3 class="result-title">
                {{ $t('tools.douyinDownloader.result.title') }}
              </h3>
              <div class="result-info-header">
                <div class="result-video-title">
                  {{ result.title }}
                </div>
              </div>
              <div class="result-items">
                <div
                  v-for="(videoUrl, index) in result.downloadUrls"
                  :key="index"
                  class="result-item"
                >
                  <div class="item-main">
                    <div class="item-type-info">
                      <span class="type-badge type-video">Video</span>
                      <span class="quality-badge">HD</span>
                    </div>
                    <div class="url-copy-wrapper">
                      <textarea
                        readonly
                        class="url-textarea"
                        :value="videoUrl"
                        @click="($event.target as HTMLTextAreaElement).select()"
                      />
                      <button
                        class="copy-btn"
                        @click="handleCopy(videoUrl)"
                      >
                        {{ copyStatus[videoUrl] ? $t('common.copied') : $t('common.copy') }}
                      </button>
                    </div>
                  </div>
                  <a
                    :href="videoUrl"
                    target="_blank"
                    rel="noopener"
                    class="item-download-btn"
                  >
                    <svg
                      width="20"
                      height="20"
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
                    {{ $t('common.download') }}
                  </a>
                </div>
              </div>
            </div>
          </Transition>

          <AdBanner
            ad-slot="tiktok-result"
            variant="responsive"
          />

          <div class="instructions-card">
            <h2 class="instructions-title">
              {{ $t('tools.tiktokDownloader.instructions.title') }}
            </h2>
            <ol class="steps-list">
              <li class="step-item">
                <span class="step-num">1</span>
                <span>{{ $t('tools.tiktokDownloader.instructions.step1') }}</span>
              </li>
              <li class="step-item">
                <span class="step-num">2</span>
                <span>{{ $t('tools.tiktokDownloader.instructions.step2') }}</span>
              </li>
              <li class="step-item">
                <span class="step-num">3</span>
                <span>{{ $t('tools.tiktokDownloader.instructions.step3') }}</span>
              </li>
            </ol>
          </div>
        </div>

        <aside class="page-sidebar">
          <SupportedPlatforms />
          <div class="sidebar-ad">
            <AdBanner
              ad-slot="tiktok-sidebar"
              variant="rectangle"
            />
          </div>
        </aside>

        <!-- Detailed Guide Section -->
        <div class="guide-section">
          <div class="guide-tabs">
            <button 
              :class="['guide-tab', { active: activeTab === 'how-it-works' }]"
              @click="activeTab = 'how-it-works'"
            >
              {{ $t('tools.tiktokDownloader.guide.howItWorks') }}
            </button>
            <button 
              :class="['guide-tab', { active: activeTab === 'features' }]"
              @click="activeTab = 'features'"
            >
              {{ $t('tools.tiktokDownloader.guide.features') }}
            </button>
            <button 
              :class="['guide-tab', { active: activeTab === 'faq' }]"
              @click="activeTab = 'faq'"
            >
              {{ $t('tools.tiktokDownloader.guide.faq') }}
            </button>
          </div>

          <div class="guide-content">
            <!-- How it Works -->
            <div v-if="activeTab === 'how-it-works'" class="guide-content-panel">
              <h3>
                {{ $t('tools.tiktokDownloader.guide.howItWorks') }}
              </h3>
              <p>
                {{ $t('tools.tiktokDownloader.guide.howItWorksIntro') }}
              </p>
              
              <div class="guide-steps">
                <div class="guide-step">
                  <div class="step-number">1</div>
                  <div class="step-content">
                    <h4>
                      {{ $t('tools.tiktokDownloader.guide.step1.title') }}
                    </h4>
                    <p>
                      {{ $t('tools.tiktokDownloader.guide.step1.desc') }}
                    </p>
                  </div>
                </div>
                <div class="guide-step">
                  <div class="step-number">2</div>
                  <div class="step-content">
                    <h4>
                      {{ $t('tools.tiktokDownloader.guide.step2.title') }}
                    </h4>
                    <p>
                      {{ $t('tools.tiktokDownloader.guide.step2.desc') }}
                    </p>
                  </div>
                </div>
                <div class="guide-step">
                  <div class="step-number">3</div>
                  <div class="step-content">
                    <h4>
                      {{ $t('tools.tiktokDownloader.guide.step3.title') }}
                    </h4>
                    <p>
                      {{ $t('tools.tiktokDownloader.guide.step3.desc') }}
                    </p>
                  </div>
                </div>
                <div class="guide-step">
                  <div class="step-number">4</div>
                  <div class="step-content">
                    <h4>
                      {{ $t('tools.tiktokDownloader.guide.step4.title') }}
                    </h4>
                    <p>
                      {{ $t('tools.tiktokDownloader.guide.step4.desc') }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Features -->
            <div v-if="activeTab === 'features'" class="guide-content-panel">
              <h3>
                {{ $t('tools.tiktokDownloader.guide.features') }}
              </h3>
              
              <div class="feature-section">
                <h4>
                  {{ $t('tools.tiktokDownloader.guide.feature1.title') }}
                </h4>
                <p>
                  {{ $t('tools.tiktokDownloader.guide.feature1.desc') }}
                </p>
              </div>
              
              <div class="feature-section">
                <h4>
                  {{ $t('tools.tiktokDownloader.guide.feature2.title') }}
                </h4>
                <p>
                  {{ $t('tools.tiktokDownloader.guide.feature2.desc') }}
                </p>
              </div>
              
              <div class="feature-section">
                <h4>
                  {{ $t('tools.tiktokDownloader.guide.feature3.title') }}
                </h4>
                <p>
                  {{ $t('tools.tiktokDownloader.guide.feature3.desc') }}
                </p>
              </div>
              
              <div class="feature-section">
                <h4>
                  {{ $t('tools.tiktokDownloader.guide.feature4.title') }}
                </h4>
                <p>
                  {{ $t('tools.tiktokDownloader.guide.feature4.desc') }}
                </p>
              </div>
            </div>

            <!-- FAQ -->
            <div v-if="activeTab === 'faq'" class="guide-content-panel">
              <h3>
                {{ $t('tools.tiktokDownloader.guide.faq') }}
              </h3>
              
              <div class="faq-item">
                <h4>
                  {{ $t('tools.tiktokDownloader.guide.faq1.question') }}
                </h4>
                <p>
                  {{ $t('tools.tiktokDownloader.guide.faq1.answer') }}
                </p>
              </div>
              
              <div class="faq-item">
                <h4>
                  {{ $t('tools.tiktokDownloader.guide.faq2.question') }}
                </h4>
                <p>
                  {{ $t('tools.tiktokDownloader.guide.faq2.answer') }}
                </p>
              </div>
              
              <div class="faq-item">
                <h4>
                  {{ $t('tools.tiktokDownloader.guide.faq3.question') }}
                </h4>
                <p>
                  {{ $t('tools.tiktokDownloader.guide.faq3.answer') }}
                </p>
              </div>
              
              <div class="faq-item">
                <h4>
                  {{ $t('tools.tiktokDownloader.guide.faq4.question') }}
                </h4>
                <p>
                  {{ $t('tools.tiktokDownloader.guide.faq4.answer') }}
                </p>
              </div>
              
              <div class="faq-item">
                <h4>
                  {{ $t('tools.tiktokDownloader.guide.faq5.question') }}
                </h4>
                <p>
                  {{ $t('tools.tiktokDownloader.guide.faq5.answer') }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getCanonicalUrl } from '~/utils/seo'
import { generateDownloaderSchema } from '~/utils/schema'

const { t, locale } = useI18n()
const { showError } = useGlobalError()
const route = useRoute()

const canonicalUrl = computed(() => getCanonicalUrl(route.path, locale.value))
const title = computed(() => t('tools.tiktokDownloader.seo.title'))
const description = computed(() => t('tools.tiktokDownloader.seo.description'))

useSeoMeta({
  title: title.value,
  ogTitle: title.value,
  description: description.value,
  ogDescription: description.value,
  ogImage: '/images/tiktok-downloader-og.jpg', // Placeholder - should be replaced with actual image
  ogUrl: canonicalUrl.value,
  ogType: 'website',
  ogSiteName: 'ToolSpace',
  twitterCard: 'summary_large_image',
  twitterTitle: title.value,
  twitterDescription: description.value,
  twitterImage: '/images/tiktok-downloader-twitter.jpg', // Placeholder - should be replaced with actual image
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
      innerHTML: JSON.stringify(generateDownloaderSchema(
        t('tools.tiktokDownloader.name'),
        description.value,
        canonicalUrl.value
      ))
    }
  ],
  htmlAttrs: {
    lang: locale.value
  }
})

const url = ref('')
const isLoading = ref(false)
const errorMsg = ref('')
const turnstileToken = ref('')
const turnstile = ref()
const copyStatus = ref<Record<string, boolean>>({})
const activeTab = ref('how-it-works')

interface DownloadResult {
  title: string
  downloadUrls: string[]
}

const result = ref<DownloadResult | null>(null)

async function handleCopy(text: string) {
  try {
    await navigator.clipboard.writeText(text)
    copyStatus.value[text] = true
    setTimeout(() => {
      copyStatus.value[text] = false
    }, 2000)
  }
  catch (err) {
    console.error('Failed to copy:', err)
  }
}

function isValidTiktokUrl(input: string): boolean {
  return /tiktok\.com|vmtiktok\.com/i.test(input)
}

async function handleDownload() {
  errorMsg.value = ''
  result.value = null

  const trimmed = url.value.trim()
  if (!trimmed) return

  if (!isValidTiktokUrl(trimmed)) {
    errorMsg.value = t('tools.tiktokDownloader.errors.invalidUrl')
    return
  }

  if (!turnstileToken.value) {
    errorMsg.value = t('common.errors.turnstile')
    return
  }

  isLoading.value = true

  try {
    const response = await $fetch<{ error: boolean, errorKey?: string, message?: string, data?: DownloadResult }>('/api/tiktok/download', {
      method: 'POST',
      body: {
        url: trimmed,
        token: turnstileToken.value
      }
    })

    if (response.error) {
      showError(response.errorKey || 'common.error', response.message)
      return
    }

    result.value = response.data as DownloadResult
  }
  catch (err: unknown) {
    console.error('Download error:', err)
    showError('common.error')
  }
  finally {
    isLoading.value = false
    turnstile.value?.reset()
  }
}
</script>

<style scoped>
@import "@/assets/css/downloader-shared.css";

.page-intro {
  margin: var(--space-lg) 0;
  padding: var(--space-lg);
  background: var(--color-surface);
  border-radius: var(--radius-lg);
  border-left: 4px solid var(--color-primary);
}

.features-list {
  margin-top: var(--space-md);
  padding-left: var(--space-lg);
}

.features-list li {
  margin-bottom: var(--space-sm);
  color: var(--color-text);
  line-height: 1.6;
}

.features-list li:last-child {
   margin-bottom: 0;
 }

/* Guide Section */
.guide-section {
  background: var(--color-surface, #f8f9fa);
  border: 1px solid var(--color-border, #e5e7eb);
  border-radius: var(--radius-lg, 16px);
  margin: var(--space-xl) 0;
  overflow: hidden;
}

.guide-tabs {
  display: flex;
  border-bottom: 1px solid var(--color-border, #e5e7eb);
  background: var(--color-surface-light, #fafafa);
}

.guide-tab {
  padding: 16px 24px;
  border: none;
  background: transparent;
  font-size: 1rem;
  font-weight: 500;
  color: var(--color-text-2, #6b7280);
  cursor: pointer;
  transition: all 0.2s ease;
  border-bottom: 2px solid transparent;
  flex: 1;
  text-align: center;
}

.guide-tab.active {
  color: var(--color-primary, #2563eb);
  border-bottom-color: var(--color-primary, #2563eb);
  background: var(--color-white, #ffffff);
}

.guide-tab:hover:not(.active) {
  color: var(--color-text, #111827);
  background: rgba(37, 99, 235, 0.05);
}

.guide-content {
  padding: 24px;
}

.guide-content-panel h3 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-text, #111827);
  margin: 0 0 16px 0;
}

.guide-content-panel p {
  color: var(--color-text-2, #6b7280);
  line-height: 1.6;
  margin: 0 0 24px 0;
}

.guide-steps {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.guide-step {
  display: flex;
  gap: 16px;
}

.step-number {
  min-width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: var(--color-primary, #2563eb);
  color: white;
  border-radius: 50%;
  font-weight: 600;
  flex-shrink: 0;
  margin-top: 2px;
}

.step-content h4 {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-text, #111827);
  margin: 0 0 8px 0;
}

.step-content p {
  margin: 0;
  color: var(--color-text-2, #6b7280);
  line-height: 1.6;
}

.feature-section {
  margin-bottom: 24px;
}

.feature-section h4 {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-text, #111827);
  margin: 0 0 8px 0;
}

.feature-section p {
  margin: 0;
  color: var(--color-text-2, #6b7280);
  line-height: 1.6;
}

.faq-item {
  margin-bottom: 20px;
  padding-bottom: 20px;
  border-bottom: 1px solid var(--color-border, #e5e7eb);
}

.faq-item:last-child {
  margin-bottom: 0;
  padding-bottom: 0;
  border-bottom: none;
}

.faq-item h4 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text, #111827);
  margin: 0 0 8px 0;
}

.faq-item p {
  margin: 0;
  color: var(--color-text-2, #6b7280);
  line-height: 1.6;
}
</style>
