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
                aria-label="Bilibili video URL"
              >
              <button
                class="download-btn"
                :disabled="isLoading || !url.trim()"
                @click="handleDownload"
                :aria-label="isLoading ? $t('tools.bilibiliDownloader.downloading') : 'Download'"
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
                <span class="error-icon" aria-label="Error">⚠</span>
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
                  Duration: {{ formatDuration(result.videoInfo.duration) }}
                </div>
              </div>
              <div class="formats-table-wrapper">
                <table class="formats-table">
                  <thead>
                    
                  </thead>
                  <tbody>
                    <tr
                      v-for="(item, index) in result.videoInfo.urls"
                      :key="index"
                      class="format-row"
                    >
                      <td class="col-info">
                        {{ item.width }}x{{ item.height }}
                      </td>
                      <td class="col-action">
                        <a
                          :href="item.downloadUrl"
                          target="_blank"
                          rel="noopener"
                          class="table-download-btn"
                          :aria-label="`Download ${item.width}x${item.height} video`"
                        >
                          <span class="download-icon" aria-hidden="true">↓</span>
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
                <span class="step-num">{{ 1 }}</span>
                <span>{{ $t('tools.bilibiliDownloader.instructions.step1') }}</span>
              </li>
              <li class="step-item">
                <span class="step-num">{{ 2 }}</span>
                <span>{{ $t('tools.bilibiliDownloader.instructions.step2') }}</span>
              </li>
              <li class="step-item">
                <span class="step-num">{{ 3 }}</span>
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

/* Page Layout */
.downloader-page {
  min-height: 100vh;
  background: var(--color-bg, #ffffff);
  color: var(--color-text, #111827);
}

.container {
  max-width: 1200px;
  margin: 0 auto;
  padding: 32px 24px;
}

.page-layout {
  display: grid;
  grid-template-columns: 1fr 300px;
  gap: 32px;
  align-items: start;
}

.page-main {
  max-width: 720px;
  width: 100%;
}

/* Page Header */
.page-header {
  margin-bottom: 32px;
  text-align: center;
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  line-height: 1.2;
  color: var(--color-text, #111827);
  margin-bottom: 12px;
}

.page-desc {
  font-size: 1rem;
  line-height: 1.6;
  color: var(--color-text-2, #6b7280);
  max-width: 600px;
  margin: 0 auto;
}

/* Download Card */
.download-card {
  background: var(--color-surface, #f8f9fa);
  border: 1px solid var(--color-border, #e5e7eb);
  border-radius: var(--radius-lg, 16px);
  padding: 24px;
  margin-bottom: 32px;
  box-shadow: var(--shadow-sm, 0 1px 2px rgba(0, 0, 0, 0.05));
  transition: all 0.3s ease;
}

.download-card:hover {
  box-shadow: var(--shadow-md, 0 4px 12px rgba(0, 0, 0, 0.08));
  border-color: var(--color-primary, #2563eb);
}

/* Input Group */
.input-group {
  display: flex;
  gap: 12px;
  margin-bottom: 20px;
}

.url-input {
  flex: 1;
  height: 44px;
  padding: 0 16px;
  background: var(--color-surface, #f8f9fa);
  border: 1px solid var(--color-border, #e5e7eb);
  border-radius: var(--radius-md, 10px);
  font-size: 1rem;
  color: var(--color-text, #111827);
  transition: all 0.2s ease;
}

.url-input:focus {
  outline: none;
  border-color: var(--color-primary, #2563eb);
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.2);
}

.url-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

/* Download Button */
.download-btn {
  display: flex;
  align-items: center;
  gap: 8px;
  height: 44px;
  padding: 0 20px;
  background: var(--color-primary, #2563eb);
  color: white;
  border: none;
  border-radius: var(--radius-md, 10px);
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: all 0.2s ease;
  white-space: nowrap;
}

.download-btn:hover:not(:disabled) {
  background: var(--color-primary-hover, #1d4ed8);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md, 0 4px 12px rgba(0, 0, 0, 0.08));
}

.download-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
  transform: none;
  box-shadow: none;
}

.btn-spinner {
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top: 2px solid white;
  border-radius: 50%;
  animation: spin 1s linear infinite;
}

@keyframes spin {
  0% { transform: rotate(0deg); }
  100% { transform: rotate(360deg); }
}

.btn-icon {
  font-size: 1.2rem;
  font-weight: 600;
}

/* Turnstile */
.turnstile-wrapper {
  margin-bottom: 16px;
  display: flex;
  justify-content: center;
}

/* Error Message */
.error-message {
  display: flex;
  align-items: center;
  gap: 8px;
  padding: 12px 16px;
  background: rgba(220, 38, 38, 0.1);
  border: 1px solid rgba(220, 38, 38, 0.2);
  border-radius: var(--radius-md, 10px);
  color: var(--color-error, #dc2626);
  font-size: 0.875rem;
}

.error-icon {
  font-size: 1.2rem;
}

/* Result Card */
.result-card {
  background: var(--color-surface, #f8f9fa);
  border: 1px solid var(--color-border, #e5e7eb);
  border-radius: var(--radius-lg, 16px);
  padding: 24px;
  margin-bottom: 32px;
  box-shadow: var(--shadow-sm, 0 1px 2px rgba(0, 0, 0, 0.05));
}

.result-title {
  font-size: 1.25rem;
  font-weight: 600;
  line-height: 1.2;
  color: var(--color-text, #111827);
  margin-bottom: 20px;
}

.result-info-header {
  margin-bottom: 24px;
  padding-bottom: 16px;
  border-bottom: 1px solid var(--color-border, #e5e7eb);
}

.result-video-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text, #111827);
  margin-bottom: 8px;
  line-height: 1.4;
  word-break: break-word;
}

.result-video-duration {
  font-size: 0.875rem;
  color: var(--color-text-2, #6b7280);
}

/* Formats Table */
.formats-table-wrapper {
  overflow-x: auto;
  border-radius: var(--radius-md, 10px);
  border: 1px solid var(--color-border, #e5e7eb);
}

.formats-table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.formats-table th,
.formats-table td {
  padding: 16px;
  border-bottom: 1px solid var(--color-border, #e5e7eb);
}

.formats-table th {
  background: var(--color-surface, #f8f9fa);
  font-weight: 600;
  font-size: 0.875rem;
  text-transform: uppercase;
  color: var(--color-text-2, #6b7280);
  letter-spacing: 0.5px;
}

.formats-table th.col-info-header {
  width: 60%;
}

.formats-table th.col-action-header {
  text-align: right;
  width: 40%;
}

.format-row {
  background: rgba(37, 99, 235, 0.05);
  transition: background 0.2s ease;
}

.format-row:hover {
  background: rgba(37, 99, 235, 0.1);
}

.col-info {
  font-family: monospace;
  font-weight: 600;
  font-size: 1rem;
  color: var(--color-text, #111827);
}

.col-action {
  text-align: right;
}

.table-download-btn {
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 8px 16px;
  background: var(--color-primary, #2563eb);
  color: white;
  border-radius: var(--radius-md, 10px);
  font-size: 0.875rem;
  font-weight: 500;
  text-decoration: none;
  transition: all 0.2s ease;
}

.table-download-btn:hover {
  background: var(--color-primary-hover, #1d4ed8);
  transform: translateY(-1px);
  box-shadow: var(--shadow-md, 0 4px 12px rgba(0, 0, 0, 0.08));
}

.download-icon {
  font-size: 1rem;
  font-weight: 600;
}

/* Instructions Card */
.instructions-card {
  background: var(--color-surface, #f8f9fa);
  border: 1px solid var(--color-border, #e5e7eb);
  border-radius: var(--radius-lg, 16px);
  padding: 24px;
  box-shadow: var(--shadow-sm, 0 1px 2px rgba(0, 0, 0, 0.05));
}

.instructions-title {
  font-size: 1.5rem;
  font-weight: 600;
  line-height: 1.2;
  color: var(--color-text, #111827);
  margin-bottom: 16px;
}

.steps-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.step-item {
  display: flex;
  align-items: flex-start;
  gap: 12px;
  margin-bottom: 16px;
  line-height: 1.6;
}

.step-item:last-child {
  margin-bottom: 0;
}

.step-num {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  height: 24px;
  background: var(--color-primary, #2563eb);
  color: white;
  border-radius: 50%;
  font-size: 0.875rem;
  font-weight: 600;
  flex-shrink: 0;
  margin-top: 2px;
}

/* Sidebar */
.page-sidebar {
  position: sticky;
  top: 32px;
  height: fit-content;
}

.sidebar-ad {
  margin-top: 24px;
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active,
.slide-leave-active {
  transition: all 0.3s ease;
}

.slide-enter-from {
  opacity: 0;
  transform: translateY(20px);
}

.slide-leave-to {
  opacity: 0;
  transform: translateY(-20px);
}

/* Responsive Design */
@media (max-width: 1024px) {
  .page-layout {
    grid-template-columns: 1fr;
    gap: 24px;
  }
  
  .page-main {
    max-width: 100%;
  }
  
  .page-sidebar {
    order: -1;
    position: relative;
    top: 0;
  }
  
  .SupportedPlatforms {
    display: flex;
    overflow-x: auto;
    gap: 12px;
    padding-bottom: 12px;
  }
  
  .SupportedPlatforms > div {
    flex-shrink: 0;
  }
}

@media (max-width: 640px) {
  .container {
    padding: 24px 16px;
  }
  
  .page-title {
    font-size: 1.75rem;
  }
  
  .input-group {
    flex-direction: column;
  }
  
  .download-btn {
    width: 100%;
    justify-content: center;
  }
  
  .formats-table th,
  .formats-table td {
    padding: 12px;
  }
  
  .result-card,
  .download-card,
  .instructions-card {
    padding: 20px;
  }
}
</style>
