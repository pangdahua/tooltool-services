<template>
  <div class="downloader-page platform-youtube">
    <div class="container">
      <div class="page-layout">
        <div class="page-main">
          <div class="page-header">
            <h1 class="page-title">
              {{ $t('tools.youtubeDownloader.name') }}
            </h1>
            <p class="page-desc">
              {{ $t('tools.youtubeDownloader.description') }}
            </p>
            <div class="page-intro">
              <p>{{ $t('tools.youtubeDownloader.intro') }}</p>
              <ul class="features-list">
                <li>{{ $t('tools.youtubeDownloader.features.noWatermark') }}</li>
                <li>{{ $t('tools.youtubeDownloader.features.highQuality') }}</li>
                <li>{{ $t('tools.youtubeDownloader.features.fastDownload') }}</li>
              </ul>
            </div>
          </div>

          <div class="download-card">
            <div class="input-group">
              <input
                v-model="url"
                type="url"
                class="url-input"
                :placeholder="$t('tools.youtubeDownloader.inputPlaceholder')"
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
                {{ isLoading ? $t('tools.youtubeDownloader.downloading') : $t('tools.youtubeDownloader.downloadBtn') }}
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
                <div class="video-preview-container">
                  <div v-if="result.thumbnail" class="result-thumbnail">
                    <img :src="result.thumbnail.url" :alt="$t('tools.douyinDownloader.result.videoTitle')" class="thumbnail-img">
                  </div>
                  <div class="video-details">
                    <div class="result-video-title">
                      {{ result.title }}
                    </div>
                    <div v-if="result.duration" class="result-duration">
                      Duration: {{ result.duration }}
                    </div>
                  </div>
                </div>
              </div>
              <div class="formats-list">
                <div
                  v-for="(videoFormat, index) in result.downloadUrls"
                  :key="index"
                  class="format-card"
                >
                  <div class="format-info">
                    <div class="format-title">
                      {{ videoFormat.qualityLabel || 'Video/Direct' }}
                    </div>
                    <div class="format-details">
                      {{ videoFormat.width }}×{{ videoFormat.height }} • video/mp4
                    </div>
                  </div>
                  <a
                    :href="videoFormat.url"
                    target="_blank"
                    rel="noopener"
                    class="download-button"
                  >
                    Download
                  </a>
                </div>
              </div>
            </div>
          </Transition>

          <AdBanner
            ad-slot="youtube-result"
            variant="responsive"
          />

          <div class="instructions-card">
            <h2 class="instructions-title">
              {{ $t('tools.youtubeDownloader.instructions.title') }}
            </h2>
            <ol class="steps-list">
              <li class="step-item">
                <span class="step-num">1</span>
                <span>{{ $t('tools.youtubeDownloader.instructions.step1') }}</span>
              </li>
              <li class="step-item">
                <span class="step-num">2</span>
                <span>{{ $t('tools.youtubeDownloader.instructions.step2') }}</span>
              </li>
              <li class="step-item">
                <span class="step-num">3</span>
                <span>{{ $t('tools.youtubeDownloader.instructions.step3') }}</span>
              </li>
            </ol>
          </div>
        </div>

        <aside class="page-sidebar">
          <SupportedPlatforms />
          <div class="sidebar-ad">
            <AdBanner
              ad-slot="youtube-sidebar"
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
const title = computed(() => t('tools.youtubeDownloader.seo.title'))
const description = computed(() => t('tools.youtubeDownloader.seo.description'))

useSeoMeta({
  title: title.value,
  ogTitle: title.value,
  description: description.value,
  ogDescription: description.value,
  ogImage: '/images/youtube-downloader-og.jpg', // Placeholder - should be replaced with actual image
  ogUrl: canonicalUrl.value,
  ogType: 'website',
  ogSiteName: 'ToolSpace',
  twitterCard: 'summary_large_image',
  twitterTitle: title.value,
  twitterDescription: description.value,
  twitterImage: '/images/youtube-downloader-twitter.jpg', // Placeholder - should be replaced with actual image
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
        t('tools.youtubeDownloader.name'),
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

interface VideoFormat {
  width: number
  height: number
  url: string
  type: number
  qualityLabel: string
}

interface VideoData {
  title: string
  thumbnail?: {
    height: number
    url: string
    width: number
  }
  duration?: string
  downloadUrls: VideoFormat[]
}

const result = ref<VideoData | null>(null)

function isValidYoutubeUrl(input: string): boolean {
  return /youtube\.com|youtu\.be/i.test(input)
}

async function handleDownload() {
  errorMsg.value = ''
  result.value = null

  const trimmed = url.value.trim()
  if (!trimmed) return

  if (!isValidYoutubeUrl(trimmed)) {
    errorMsg.value = t('tools.youtubeDownloader.errors.invalidUrl')
    return
  }

  if (!turnstileToken.value) {
    errorMsg.value = t('common.errors.turnstile')
    return
  }

  isLoading.value = true

  try {
    const response = await $fetch<{ error: boolean, errorKey?: string, message?: string, data?: { video: VideoData } }>('/api/youtube/download', {
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

    result.value = response.data?.video || null
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
.result-card {
  background: linear-gradient(to right, #8b5cf6, #a855f7);
  padding: var(--space-lg);
  border-radius: var(--radius-lg);
  color: white;
}

.result-info-header {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
  margin-bottom: var(--space-lg);
}

.video-preview-container {
  display: flex;
  gap: var(--space-md);
  align-items: flex-start;
}

.result-thumbnail {
  flex-shrink: 0;
  width: 160px;
  height: 90px;
  overflow: hidden;
}

.thumbnail-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: var(--radius-md);
}

.video-details {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
  flex: 1;
}

.result-video-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: white;
  word-break: break-word;
  margin: 0;
}

.result-duration {
  font-size: 0.875rem;
  color: rgba(255, 255, 255, 0.8);
  background: rgba(255, 255, 255, 0.2);
  display: inline-block;
  padding: var(--space-xs) var(--space-sm);
  border-radius: var(--radius-full);
  width: fit-content;
}

.formats-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.format-card {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: #FFF9F3; /* 暖橙色/米白色 */
  padding: var(--space-md) var(--space-lg);
  border-radius: var(--radius-lg);
}

.format-info {
  display: flex;
  flex-direction: column;
}

.format-title {
  color: #f97316; /* 亮橙色 */
  font-size: 1rem;
  font-weight: bold;
}

.format-details {
  color: #6b7280; /* 中灰色 */
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

.download-button {
  background-color: #f97316; /* 亮橙色 */
  color: white;
  font-size: 0.875rem;
  font-weight: bold;
  padding: 0.5rem 1.25rem;
  border-radius: var(--radius-md);
  text-decoration: none;
  transition: background-color 0.2s;
}

.download-button:hover {
  background-color: #ea580c; /* 深一点的橙色 */
}
</style>
