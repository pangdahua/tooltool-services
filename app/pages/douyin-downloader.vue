<template>
  <div class="douyin-page platform-douyin">
    <div class="container">
      <div class="page-layout">
        <!-- Main Content -->
        <div class="page-main">
          <!-- Page Header -->
          <div class="page-header">
            <h1 class="page-title">
              {{ $t('tools.douyinDownloader.name') }}
            </h1>
            <p class="page-desc">
              {{ $t('tools.douyinDownloader.description') }}
            </p>
          </div>

          <!-- Download Form -->
          <div class="download-card">
            <div class="input-group">
              <input
                id="douyin-url-input"
                v-model="url"
                type="url"
                class="url-input"
                :placeholder="$t('tools.douyinDownloader.inputPlaceholder')"
                :disabled="isLoading"
                @keydown.enter="handleDownload"
              >
              <button
                id="download-btn"
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
                {{ isLoading ? $t('tools.douyinDownloader.downloading') : $t('tools.douyinDownloader.downloadBtn') }}
              </button>
            </div>

            <!-- Turnstile Widget -->
            <div class="turnstile-wrapper">
              <NuxtTurnstile
                ref="turnstile"
                v-model="turnstileToken"
              />
            </div>

            <!-- Error Message -->
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

          <!-- Result -->
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
                      <span class="type-badge type-video">视频</span>
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
                        {{ copyStatus[videoUrl] ? '已复制' : '复制链接' }}
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
                    直接下载
                  </a>
                </div>
              </div>
            </div>
          </Transition>

          <!-- Ad after result -->
          <AdBanner
            ad-slot="douyin-result"
            variant="responsive"
          />

          <!-- Instructions -->
          <div class="instructions-card">
            <h2 class="instructions-title">
              {{ $t('tools.douyinDownloader.instructions.title') }}
            </h2>
            <ol class="steps-list">
              <li class="step-item">
                <span class="step-num">1</span>
                <span>{{ $t('tools.douyinDownloader.instructions.step1') }}</span>
              </li>
              <li class="step-item">
                <span class="step-num">2</span>
                <span>{{ $t('tools.douyinDownloader.instructions.step2') }}</span>
              </li>
              <li class="step-item">
                <span class="step-num">3</span>
                <span>{{ $t('tools.douyinDownloader.instructions.step3') }}</span>
              </li>
              <li class="step-item">
                <span class="step-num">4</span>
                <span>{{ $t('tools.douyinDownloader.instructions.step4') }}</span>
              </li>
            </ol>
          </div>
        </div>

        <!-- Sidebar -->
        <aside class="page-sidebar">
          <SupportedPlatforms />
          <div class="sidebar-ad">
            <AdBanner
              ad-slot="douyin-sidebar"
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
const route = useRoute()

const canonicalUrl = computed(() => getCanonicalUrl(route.path, locale.value))
const title = computed(() => t('tools.douyinDownloader.seo.title'))
const description = computed(() => t('tools.douyinDownloader.seo.description'))

useSeoMeta(generateCommonSeo(title.value, description.value, canonicalUrl.value))

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(generateDownloaderSchema(
        t('tools.douyinDownloader.name'),
        description.value,
        canonicalUrl.value
      ))
    }
  ]
})

// State
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

// Copy handler
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

// Validate URL
function isValidDouyinUrl(input: string): boolean {
  return /douyin\.com|iesdouyin\.com|v\.douyin\.com/i.test(input)
}

const { showError } = useGlobalError()

// Handle download
async function handleDownload() {
  errorMsg.value = ''
  result.value = null

  const trimmed = url.value.trim()
  if (!trimmed) return

  if (!isValidDouyinUrl(trimmed)) {
    errorMsg.value = t('tools.douyinDownloader.errors.invalidUrl')
    return
  }

  if (!turnstileToken.value) {
    errorMsg.value = t('tools.douyinDownloader.errors.turnstileFailed')
    return
  }

  isLoading.value = true

  try {
    const response = await $fetch<{ error: boolean, errorKey?: string, message?: string, data?: DownloadResult }>('/api/douyin/download', {
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
    showError('tools.douyinDownloader.errors.networkError')
  }
  finally {
    isLoading.value = false
    // Reset turnstile for next request
    turnstile.value?.reset()
  }
}
</script>

<style scoped>
@import "@/assets/css/downloader-shared.css";
</style>
