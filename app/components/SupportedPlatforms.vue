<template>
  <div class="platforms-widget">
    <h3 class="widget-title">
      {{ $t('components.supportedPlatforms.title') }}
    </h3>
    <div class="platforms-list">
      <NuxtLink
        v-for="platform in platforms"
        :key="platform.id"
        :to="platform.link"
        class="platform-item"
        :class="{ active: currentPath === platform.link }"
      >
        <div
          class="platform-icon-wrapper"
          :style="{ backgroundColor: platform.color }"
        >
          <span class="platform-icon">{{ platform.icon }}</span>
        </div>
        <div class="platform-info">
          <span class="platform-name">{{ platform.name }}</span>
          <span class="platform-desc">{{ platform.shortDesc }}</span>
        </div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup lang="ts">
const { t } = useI18n()
const route = useRoute()
const currentPath = computed(() => route.path)

const platforms = computed(() => [
  {
    id: 'douyin',
    name: t('tools.douyinDownloader.name'),
    shortDesc: t('tools.douyinDownloader.shortDesc'),
    link: '/douyin-downloader',
    icon: '抖',
    color: '#000000'
  },
  {
    id: 'tiktok',
    name: t('tools.tiktokDownloader.name'),
    shortDesc: t('tools.tiktokDownloader.shortDesc'),
    link: '/tools/tiktok-downloader',
    icon: 'Tk',
    color: '#000000'
  },
  {
    id: 'youtube',
    name: t('tools.youtubeDownloader.name'),
    shortDesc: t('tools.youtubeDownloader.shortDesc'),
    link: '/tools/youtube-downloader',
    icon: 'YT',
    color: '#FF0000'
  },
  {
    id: 'bilibili',
    name: t('tools.bilibiliDownloader.name'),
    shortDesc: t('tools.bilibiliDownloader.shortDesc'),
    link: '/tools/bilibili-downloader',
    icon: 'B',
    color: '#00A1D6'
  },
  {
    id: 'red',
    name: t('tools.redDownloader.name'),
    shortDesc: t('tools.redDownloader.shortDesc'),
    link: '/tools/red-downloader',
    icon: '红',
    color: '#FF2442'
  }
])
</script>

<style scoped>
.platforms-widget {
  background: var(--glass-bg);
  backdrop-filter: blur(var(--glass-blur));
  -webkit-backdrop-filter: blur(var(--glass-blur));
  border: 1px solid var(--glass-border);
  border-radius: var(--radius-lg);
  padding: var(--space-lg);
  box-shadow: var(--shadow-md);
}

.widget-title {
  font-size: 1rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: var(--space-md);
  padding-bottom: var(--space-xs);
  border-bottom: 2px solid var(--color-primary);
  display: inline-block;
}

.platforms-list {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.platform-item {
  display: flex;
  align-items: center;
  gap: var(--space-md);
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-md);
  text-decoration: none;
  transition: all var(--transition-base);
  border: 1px solid transparent;
}

.platform-item:hover {
  background: var(--color-surface-hover);
  border-color: var(--glass-border);
  transform: translateX(6px);
}

.platform-item.active {
  background: var(--color-primary-light);
  border-color: var(--color-primary);
  pointer-events: none;
  transform: none;
}

.platform-icon-wrapper {
  width: 40px;
  height: 40px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-shrink: 0;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.2);
  transition: transform var(--transition-fast);
}

.platform-item:hover .platform-icon-wrapper {
  transform: scale(1.1);
}

.platform-icon {
  color: white;
  font-size: 0.9rem;
  font-weight: 800;
}

.platform-info {
  display: flex;
  flex-direction: column;
  min-width: 0;
}

.platform-name {
  font-size: 0.95rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: 2px;
}

.platform-desc {
  font-size: 0.75rem;
  color: var(--color-text-2);
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}
</style>
