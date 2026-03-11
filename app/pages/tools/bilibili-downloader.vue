<template>
  <div class="downloader-page platform-bilibili">
    <div class="container">
      <div class="page-layout">
        <div class="page-main">
          <div class="page-header">
            <h1 class="page-title">
              {{ $t('tools.bilibiliDownloader.name') }}
            </h1>
            <p class="page-desc">
              {{ $t('tools.bilibiliDownloader.description') }}
            </p>
          </div>

          <div class="download-card">
            <div class="input-group">
              <input
                v-model="url"
                type="url"
                class="url-input"
                :placeholder="$t('tools.bilibiliDownloader.inputPlaceholder')"
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
                {{ isLoading ? $t('tools.bilibiliDownloader.downloading') : 'Download' }}
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
                <div class="result-video-duration">
                  {{ $t('tools.bilibiliDownloader.result.duration') || 'Duration' }}: {{ formatDuration(result.videoInfo.duration) }}
                </div>
              </div>
              <div class="formats-table-wrapper">
                <table class="formats-table">
                  <tbody>
                    <tr
                      v-for="(item, index) in result.videoInfo.urls"
                      :key="index"
                      class="format-row"
                    >
                      <td class="col-info">
                        {{ item.width }}x{{ item.height }} / {{ item.mimeType?.split('/')[1]?.toUpperCase() || 'MP4' }}
                      </td>
                      <td class="col-action">
                        <a
                          :href="item.downloadUrl"
                          target="_blank"
                          rel="noopener"
                          class="table-download-btn"
                        >
                          Download
                        </a>
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            </div>
          </Transition>

          <AdBanner
            ad-slot="bilibili-result"
            variant="responsive"
          />

          <div class="instructions-card">
            <h2 class="instructions-title">
              {{ $t('tools.bilibiliDownloader.instructions.title') }}
            </h2>
            <ol class="steps-list">
              <li class="step-item">
                <span class="step-num">1</span>
                <span>{{ $t('tools.bilibiliDownloader.instructions.step1') }}</span>
              </li>
              <li class="step-item">
                <span class="step-num">2</span>
                <span>{{ $t('tools.bilibiliDownloader.instructions.step2') }}</span>
              </li>
              <li class="step-item">
                <span class="step-num">3</span>
                <span>{{ $t('tools.bilibiliDownloader.instructions.step3') }}</span>
              </li>
            </ol>
          </div>
        </div>

        <aside class="page-sidebar">
          <SupportedPlatforms />
          <div class="sidebar-ad">
            <AdBanner
              ad-slot="bilibili-sidebar"
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
const title = computed(() => t('tools.bilibiliDownloader.seo.title'))
const description = computed(() => t('tools.bilibiliDownloader.seo.description'))

useSeoMeta(generateCommonSeo(title.value, description.value, canonicalUrl.value))

useHead({
  script: [
    {
      type: 'application/ld+json',
      innerHTML: JSON.stringify(generateDownloaderSchema(
        t('tools.bilibiliDownloader.name'),
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

interface DownloadResult {
  title: string
  videoInfo: {
    duration: number
    urls: {
      type: number
      downloadUrl: string
      width?: number
      height?: number
      mimeType?: string
    }[]
  }
}

const result = ref<DownloadResult | null>(null)

function formatDuration(seconds: number): string {
  const h = Math.floor(seconds / 3600)
  const m = Math.floor((seconds % 3600) / 60)
  const s = Math.floor(seconds % 60)
  return [h, m, s]
    .map(v => v < 10 ? '0' + v : v)
    .filter((v, i) => v !== '00' || i > 0)
    .join(':')
}

function isValidBilibiliUrl(input: string): boolean {
  return /bilibili\.com|b23\.tv/i.test(input)
}

async function handleDownload() {
  errorMsg.value = ''
  result.value = null

  const trimmed = url.value.trim()
  if (!trimmed) return

  if (!isValidBilibiliUrl(trimmed)) {
    errorMsg.value = t('tools.bilibiliDownloader.errors.invalidUrl')
    return
  }

  if (!turnstileToken.value) {
    errorMsg.value = t('common.errors.turnstile')
    return
  }

  isLoading.value = true

  try {
    const response = await $fetch<{ error: boolean, errorKey?: string, message?: string, data?: DownloadResult }>('/api/bilibili/download', {
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

.result-info-header {
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.result-video-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--text-primary);
  margin-bottom: 0.5rem;
  line-height: 1.4;
}

.result-video-duration {
  font-size: 0.9rem;
  color: var(--text-secondary);
}

.formats-table-wrapper {
  overflow-x: auto;
  border-radius: 8px;
  border: 1px solid var(--border-color);
}

.formats-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.formats-table th,
.formats-table td {
  padding: 1rem;
  border-bottom: 1px solid var(--border-color);
}

.formats-table th {
  background: var(--bg-secondary);
  font-weight: 600;
  font-size: 0.85rem;
  text-transform: uppercase;
  color: var(--text-secondary);
}

.format-row {
  background: rgba(3, 169, 244, 0.1); /* button info color shade */
  transition: background 0.2s;
}

.format-row:hover {
  background: rgba(3, 169, 244, 0.15);
}

.col-info {
  font-family: monospace;
  font-weight: 600;
  font-size: 1rem;
  color: var(--text-primary);
  padding: 1.25rem 1rem !important;
}

.col-action {
  text-align: right;
  padding: 1rem !important;
}

.table-download-btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  background: var(--primary-color);
  color: white;
  border-radius: 6px;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.2s;
  text-decoration: none;
}

.table-download-btn:hover {
  opacity: 0.9;
  transform: translateY(-1px);
}
</style>
