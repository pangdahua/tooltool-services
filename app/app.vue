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
    },
    {
      src: 'https://www.googletagmanager.com/gtag/js?id=G-DNG9SW4Q5T', // 替换成你的 G-ID
      async: true
    },
    {
      innerHTML: `
        window.dataLayer = window.dataLayer || [];
        function gtag(){dataLayer.push(arguments);}
        gtag('js', new Date());
        gtag('config', 'G-DNG9SW4Q5T');
      `
    },
    {
      innerHTML: `
        var ahrefs_analytics_script = document.createElement('script');
  ahrefs_analytics_script.async = true;
  ahrefs_analytics_script.src = 'https://analytics.ahrefs.com/analytics.js';
  ahrefs_analytics_script.setAttribute('data-key', 'Lz+NingVl66hJpI31hJTXQ');
  document.getElementsByTagName('head')[0].appendChild(ahrefs_analytics_script);
      `
    }
  ]
})
</script>
