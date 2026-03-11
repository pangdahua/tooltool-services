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
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getCanonicalUrl, generateCommonSeo } from '~/utils/seo'
import { generateDownloaderSchema } from '~/utils/schema'

const { t, locale } = useI18n()
const { showError } = useGlobalError()
const route = useRoute()

const canonicalUrl = computed(() => getCanonicalUrl(route.path, locale.value))
const title = computed(() => t('tools.tiktokDownloader.seo.title'))
const description = computed(() => t('tools.tiktokDownloader.seo.description'))

useSeoMeta(generateCommonSeo(title.value, description.value, canonicalUrl.value))

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(generateDownloaderSchema(
        t('tools.tiktokDownloader.name'),
        description.value,
        canonicalUrl.value
      ))
    }
  ]
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
</style>
