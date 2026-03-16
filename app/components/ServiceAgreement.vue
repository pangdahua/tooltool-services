<template>
  <div class="service-agreement">
    <i18n-t
      keypath="footer.agreement"
      tag="p"
    >
      <template #terms>
        <NuxtLink
          :to="localePath('/terms')"
          class="agreement-link"
        >
          {{ $t('footer.terms') }}
        </NuxtLink>
      </template>
      <template #privacy>
        <NuxtLink
          :to="localePath('/privacy')"
          class="agreement-link"
        >
          {{ $t('footer.privacy') }}
        </NuxtLink>
      </template>
    </i18n-t>
  </div>
</template>

<script setup lang="ts">
const localePath = useLocalePath()
</script>

<style scoped>
.service-agreement {
  margin-top: var(--space-md);
  text-align: center;
}

.service-agreement p {
  font-size: 0.8rem;
  color: var(--color-text-3);
  line-height: 1.5;
}

.agreement-link {
  color: var(--color-primary);
  text-decoration: underline;
  text-decoration-thickness: 1px;
  text-underline-offset: 2px;
  transition: color var(--transition-fast);
}

.agreement-link:hover {
  color: var(--color-primary-dark, var(--color-primary));
}
</style>
