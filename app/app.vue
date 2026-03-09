<template>
  <NuxtRouteAnnouncer />
  <NuxtLoadingIndicator color="var(--color-primary)" />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<script setup lang="ts">
const { t, locale } = useI18n()

useHead({
  htmlAttrs: {
    lang: locale.value
  },
  titleTemplate: (titleChunk) => {
    return titleChunk ? `${titleChunk} | ToolSpace` : 'ToolSpace - Free Online Tools'
  },
  meta: [
    { name: 'description', content: () => t('site.description') }
  ],
  script: [
    {
      async: true,
      src: 'https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-7739767559619265',
      crossorigin: 'anonymous'
    }
  ]
})
</script>
