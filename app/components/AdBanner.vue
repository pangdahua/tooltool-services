<template>
  <div v-if="adsenseId" class="ad-banner" :class="[`ad-${variant}`]">
    <ins
      class="adsbygoogle"
      :style="adStyle"
      :data-ad-client="adsenseId"
      :data-ad-slot="slot"
      :data-ad-format="format"
      data-full-width-responsive="true"
    />
  </div>
</template>

<script setup lang="ts">
interface Props {
  slot: string
  variant?: 'leaderboard' | 'rectangle' | 'responsive'
  format?: string
}

const props = withDefaults(defineProps<Props>(), {
  variant: 'responsive',
  format: 'auto'
})

const runtimeConfig = useRuntimeConfig()
const adsenseId = computed(() => runtimeConfig.public.googleAdsenseId)

const adStyle = computed(() => {
  switch (props.variant) {
    case 'leaderboard':
      return { display: 'inline-block', width: '728px', height: '90px' }
    case 'rectangle':
      return { display: 'inline-block', width: '300px', height: '250px' }
    default:
      return { display: 'block' }
  }
})

onMounted(() => {
  try {
    // @ts-expect-error adsbygoogle global
    (window.adsbygoogle = window.adsbygoogle || []).push({})
  }
  catch {
    // Ad blocker or script not loaded
  }
})
</script>

<style scoped>
.ad-banner {
  display: flex;
  justify-content: center;
  margin: var(--space-lg) 0;
}

.ad-leaderboard {
  max-width: 728px;
}

.ad-rectangle {
  max-width: 300px;
}

@media (max-width: 768px) {
  .ad-leaderboard {
    display: none;
  }
}
</style>
