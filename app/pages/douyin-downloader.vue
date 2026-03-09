<template>
  <div class="douyin-page">
    <div class="container">
      <div class="page-layout">
        <!-- Main Content -->
        <div class="page-main">
          <!-- Page Header -->
          <div class="page-header">
            <h1 class="page-title">{{ $t('tools.douyinDownloader.name') }}</h1>
            <p class="page-desc">{{ $t('tools.douyinDownloader.description') }}</p>
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
                <span v-if="isLoading" class="btn-spinner" />
                <span v-else class="btn-icon">↓</span>
                {{ isLoading ? $t('tools.douyinDownloader.downloading') : $t('tools.douyinDownloader.downloadBtn') }}
              </button>
            </div>

            <!-- Turnstile Widget -->
            <div class="turnstile-wrapper">
              <NuxtTurnstile ref="turnstile" v-model="turnstileToken" />
            </div>

            <!-- Error Message -->
            <Transition name="fade">
              <div v-if="errorMsg" class="error-message">
                <span class="error-icon">⚠</span>
                {{ errorMsg }}
              </div>
            </Transition>
          </div>

          <!-- Result -->
          <Transition name="slide">
            <div v-if="result" class="result-card">
              <h3 class="result-title">{{ $t('tools.douyinDownloader.result.title') }}</h3>

              <div v-if="result.avatar" class="result-header">
                <img :src="result.avatar" :alt="result.author" class="result-avatar">
                <div class="result-meta">
                  <div class="result-author">{{ result.author }}</div>
                  <div class="result-video-title">{{ result.title }}</div>
                </div>
              </div>

              <div class="result-items">
                <div
                  v-for="(item, index) in result.items"
                  :key="index"
                  class="result-item"
                >
                  <div class="item-cover">
                    <img :src="item.cover" :alt="item.type">
                  </div>
                  <div class="item-info">
                    <div class="item-type">
                      <span v-if="item.type === 'video'" class="type-badge type-video">视频</span>
                      <span v-else class="type-badge type-audio">音频</span>
                      <span class="quality-badge">{{ item.quality }}</span>
                    </div>
                    <div v-if="item.size" class="item-size">{{ item.size }}</div>
                    <div v-if="item.duration" class="item-duration">{{ item.duration }}</div>
                  </div>
                  <a
                    v-if="item.url"
                    :href="item.url"
                    target="_blank"
                    rel="noopener"
                    class="item-download-btn"
                  >
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                      <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                      <polyline points="7 10 12 15 17 10" />
                      <line x1="12" y1="15" x2="12" y2="3" />
                    </svg>
                    下载
                  </a>
                </div>
              </div>
            </div>
          </Transition>

          <!-- Ad after result -->
          <AdBanner slot="douyin-result" variant="responsive" />

          <!-- Instructions -->
          <div class="instructions-card">
            <h2 class="instructions-title">{{ $t('tools.douyinDownloader.instructions.title') }}</h2>
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

        <!-- Sidebar (Desktop Ad) -->
        <aside class="page-sidebar">
          <AdBanner slot="douyin-sidebar" variant="rectangle" />
        </aside>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()

// SEO
useSeoMeta({
  title: () => t('tools.douyinDownloader.seo.title'),
  ogTitle: () => t('tools.douyinDownloader.seo.title'),
  description: () => t('tools.douyinDownloader.seo.description'),
  ogDescription: () => t('tools.douyinDownloader.seo.description')
})

// State
const url = ref('')
const isLoading = ref(false)
const errorMsg = ref('')
const turnstileToken = ref('')
const turnstile = ref()

interface DownloadItem {
  type: 'video' | 'audio'
  quality: string
  url: string
  cover: string
  size?: string
  duration?: string
}

interface DownloadResult {
  title: string
  author: string
  avatar?: string
  items: DownloadItem[]
}

const result = ref<DownloadResult | null>(null)

// Validate URL
function isValidDouyinUrl(input: string): boolean {
  return /douyin\.com|iesdouyin\.com|v\.douyin\.com/i.test(input)
}

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
    const data = await $fetch('/api/douyin/download', {
      method: 'POST',
      body: {
        url: trimmed,
        token: turnstileToken.value
      }
    })

    result.value = data as DownloadResult
  }
  catch (err: any) {
    const statusCode = err?.response?.status || err?.statusCode
    if (statusCode === 403) {
      errorMsg.value = t('tools.douyinDownloader.errors.turnstileFailed')
    }
    else if (statusCode === 422) {
      errorMsg.value = t('tools.douyinDownloader.errors.parseFailed')
    }
    else {
      errorMsg.value = t('tools.douyinDownloader.errors.networkError')
    }
  }
  finally {
    isLoading.value = false
    // Reset turnstile for next request
    turnstile.value?.reset()
  }
}
</script>

<style scoped>
.douyin-page {
  padding-top: var(--space-lg);
}

.page-layout {
  display: grid;
  grid-template-columns: 1fr;
  gap: var(--space-xl);
}

@media (min-width: 1024px) {
  .page-layout {
    grid-template-columns: 1fr 300px;
  }
}

/* Page Header */
.page-header {
  margin-bottom: var(--space-xl);
}

.page-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-text);
  line-height: 1.2;
  margin-bottom: var(--space-sm);
}

.page-desc {
  color: var(--color-text-2);
  font-size: 1rem;
  line-height: 1.6;
}

/* Download Card */
.download-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  margin-bottom: var(--space-xl);
}

.input-group {
  display: flex;
  gap: var(--space-sm);
}

.url-input {
  flex: 1;
  height: 48px;
  padding: 0 var(--space-md);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-bg);
  color: var(--color-text);
  font-size: 0.95rem;
  font-family: var(--font-sans);
  transition: border-color var(--transition-fast);
  outline: none;
}

.url-input:focus {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 3px var(--color-primary-light);
}

.url-input:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.download-btn {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  height: 48px;
  padding: 0 24px;
  border: none;
  border-radius: var(--radius-md);
  background: var(--color-primary);
  color: white;
  font-size: 0.95rem;
  font-weight: 600;
  font-family: var(--font-sans);
  cursor: pointer;
  transition: all var(--transition-fast);
  white-space: nowrap;
  flex-shrink: 0;
}

.download-btn:hover:not(:disabled) {
  background: var(--color-primary-hover);
  transform: translateY(-1px);
}

.download-btn:active:not(:disabled) {
  transform: translateY(0);
}

.download-btn:disabled {
  opacity: 0.5;
  cursor: not-allowed;
}

.btn-icon {
  font-size: 1.2rem;
  font-weight: 700;
}

.btn-spinner {
  width: 18px;
  height: 18px;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-top-color: white;
  border-radius: 50%;
  animation: spin 0.6s linear infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

.turnstile-wrapper {
  margin-top: var(--space-md);
}

/* Error */
.error-message {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  margin-top: var(--space-md);
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-md);
  background: rgba(220, 38, 38, 0.08);
  color: var(--color-error);
  font-size: 0.875rem;
}

.error-icon {
  flex-shrink: 0;
}

/* Result Card */
.result-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  margin-bottom: var(--space-xl);
}

.result-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: var(--space-md);
}

.result-header {
  display: flex;
  gap: var(--space-md);
  margin-bottom: var(--space-lg);
  padding-bottom: var(--space-lg);
  border-bottom: 1px solid var(--color-border);
}

.result-avatar {
  width: 60px;
  height: 60px;
  border-radius: 50%;
  object-fit: cover;
  flex-shrink: 0;
}

.result-meta {
  flex: 1;
  display: flex;
  flex-direction: column;
  justify-content: center;
  gap: var(--space-xs);
}

.result-author {
  font-size: 0.9rem;
  color: var(--color-text-2);
}

.result-video-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-text);
}

.result-items {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.result-item {
  display: flex;
  gap: var(--space-md);
  padding: var(--space-md);
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  align-items: center;
}

.item-cover {
  width: 100px;
  height: 60px;
  flex-shrink: 0;
  border-radius: var(--radius-md);
  overflow: hidden;
}

.item-cover img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.item-info {
  flex: 1;
  display: flex;
  flex-direction: column;
  gap: var(--space-xs);
}

.item-type {
  display: flex;
  gap: var(--space-sm);
  align-items: center;
}

.type-badge {
  padding: 2px 8px;
  border-radius: var(--radius-sm);
  font-size: 0.75rem;
  font-weight: 600;
}

.type-video {
  background: var(--color-primary-light);
  color: var(--color-primary);
}

.type-audio {
  background: var(--color-success-light);
  color: var(--color-success);
}

.quality-badge {
  padding: 2px 8px;
  border-radius: var(--radius-sm);
  background: var(--color-surface-hover);
  color: var(--color-text-2);
  font-size: 0.75rem;
}

.item-size,
.item-duration {
  font-size: 0.8rem;
  color: var(--color-text-2);
}

.item-download-btn {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  padding: 8px 16px;
  background: var(--color-primary);
  color: white;
  border-radius: var(--radius-md);
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 600;
  transition: all var(--transition-fast);
  flex-shrink: 0;
}

.item-download-btn:hover {
  background: var(--color-primary-hover);
  transform: translateY(-1px);
}

/* Instructions */
.instructions-card {
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
}

.instructions-title {
  font-size: 1.1rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: var(--space-md);
}

.steps-list {
  list-style: none;
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.step-item {
  display: flex;
  align-items: flex-start;
  gap: var(--space-md);
  font-size: 0.9rem;
  color: var(--color-text-2);
  line-height: 1.5;
}

.step-num {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--color-primary-light);
  color: var(--color-primary);
  font-size: 0.8rem;
  font-weight: 700;
  flex-shrink: 0;
}

/* Sidebar */
.page-sidebar {
  display: none;
}

@media (min-width: 1024px) {
  .page-sidebar {
    display: block;
    position: sticky;
    top: calc(var(--header-height) + var(--space-lg));
    align-self: start;
  }
}

/* Transitions */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 200ms ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

.slide-enter-active {
  transition: all 300ms ease;
}

.slide-enter-from {
  opacity: 0;
  transform: translateY(10px);
}

@media (max-width: 640px) {
  .page-title {
    font-size: 1.5rem;
  }

  .input-group {
    flex-direction: column;
  }

  .download-btn {
    justify-content: center;
  }

  .result-item {
    flex-direction: column;
    align-items: stretch;
  }

  .item-cover {
    width: 100%;
    height: 120px;
  }

  .item-download-btn {
    justify-content: center;
  }
}
</style>
