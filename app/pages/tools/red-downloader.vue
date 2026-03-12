<template>
  <div class="downloader-page platform-red">
    <div class="container">
      <div class="page-layout">
        <div class="page-main">
          <div class="page-header">
            <h1 class="page-title">
              {{ $t('tools.redDownloader.name') }}
            </h1>
            <p class="page-desc">
              {{ $t('tools.redDownloader.description') }}
            </p>
            <div class="page-intro">
              <p>{{ $t('tools.redDownloader.intro') }}</p>
              <ul class="features-list">
                <li>{{ $t('tools.redDownloader.features.noWaterMark') }}</li>
                <li>{{ $t('tools.redDownloader.features.highQuality') }}</li>
                <li>{{ $t('tools.redDownloader.features.fastDownload') }}</li>
              </ul>
            </div>
          </div>

          <div class="download-card">
            <div class="input-group">
              <input
                v-model="url"
                type="url"
                class="url-input"
                :placeholder="$t('tools.redDownloader.inputPlaceholder')"
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
                {{ isLoading ? $t('tools.redDownloader.downloading') : $t('tools.redDownloader.downloadBtn') }}
              </button>
            </div>

            <div class="turnstile-wrapper">
              <NuxtTurnstile
                ref="turnstile"
                v-model="turnstileToken"
              />
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
                  v-for="(itemUrl, index) in result.downloadUrls"
                  :key="index"
                  class="result-item"
                >
                  <div class="item-main">
                    <div class="item-type-info">
                      <span class="type-badge type-video">Media</span>
                    </div>
                    <div class="url-copy-wrapper">
                      <textarea
                        readonly
                        class="url-textarea"
                        :value="itemUrl"
                        @click="($event.target as HTMLTextAreaElement).select()"
                      />
                      <button
                        class="copy-btn"
                        @click="handleCopy(itemUrl)"
                      >
                        {{ copyStatus[itemUrl] ? $t('common.copied') : $t('common.copy') }}
                      </button>
                    </div>
                  </div>
                  <a
                    :href="itemUrl"
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
            ad-slot="red-result"
            variant="responsive"
          />

          <div class="instructions-card">
            <h2 class="instructions-title">
              {{ $t('tools.redDownloader.instructions.title') }}
            </h2>
            <ol class="steps-list">
              <li class="step-item">
                <span class="step-num">1</span>
                <span>{{ $t('tools.redDownloader.instructions.step1') }}</span>
              </li>
              <li class="step-item">
                <span class="step-num">2</span>
                <span>{{ $t('tools.redDownloader.instructions.step2') }}</span>
              </li>
              <li class="step-item">
                <span class="step-num">3</span>
                <span>{{ $t('tools.redDownloader.instructions.step3') }}</span>
              </li>
            </ol>
          </div>
        </div>

        <aside class="page-sidebar">
          <SupportedPlatforms />
          <div class="sidebar-ad">
            <AdBanner
              ad-slot="red-sidebar"
              variant="rectangle"
            />
          </div>
        </aside>
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
const title = computed(() => t('tools.redDownloader.seo.title'))
const description = computed(() => t('tools.redDownloader.seo.description'))

useSeoMeta({
  title: title.value,
  ogTitle: title.value,
  description: description.value,
  ogDescription: description.value,
  ogImage: '/images/red-downloader-og.jpg', // Placeholder - should be replaced with actual image
  ogUrl: canonicalUrl.value,
  ogType: 'website',
  ogSiteName: 'ToolSpace',
  twitterCard: 'summary_large_image',
  twitterTitle: title.value,
  twitterDescription: description.value,
  twitterImage: '/images/red-downloader-twitter.jpg', // Placeholder - should be replaced with actual image
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
        t('tools.redDownloader.name'),
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

function isValidRedUrl(input: string): boolean {
  return /xiaohongshu\.com|xhslink\.com/i.test(input)
}

async function handleDownload() {
  errorMsg.value = ''
  result.value = null

  const trimmed = url.value.trim()
  if (!trimmed) return

  if (!isValidRedUrl(trimmed)) {
    errorMsg.value = t('tools.redDownloader.errors.invalidUrl')
    return
  }

  if (!turnstileToken.value) {
    errorMsg.value = t('common.errors.turnstile')
    return
  }

  isLoading.value = true

  try {
    const response = await $fetch<{ error: boolean, errorKey?: string, message?: string, data?: DownloadResult }>('/api/red/download', {
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
</style>
