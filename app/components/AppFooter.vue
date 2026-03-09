<template>
  <footer class="app-footer">
    <div class="container footer-inner">
      <div class="footer-brand">
        <span class="footer-logo">
          <span class="logo-icon">◆</span> ToolSpace
        </span>
        <p class="footer-desc">{{ $t('site.tagline') }}</p>
      </div>

      <div class="footer-bottom">
        <p class="footer-copyright">
          {{ $t('footer.copyright', { year: new Date().getFullYear() }) }}
        </p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  border-top: 1px solid var(--color-border);
  padding: var(--space-2xl) 0 var(--space-lg);
  background: var(--color-surface);
}

.footer-inner {
  display: flex;
  flex-direction: column;
  gap: var(--space-lg);
}

.footer-brand {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.footer-logo {
  font-weight: 700;
  font-size: 1.125rem;
  color: var(--color-text);
}

.logo-icon {
  color: var(--color-primary);
}

.footer-desc {
  color: var(--color-text-2);
  font-size: 0.875rem;
  max-width: 320px;
}

.footer-bottom {
  padding-top: var(--space-md);
  border-top: 1px solid var(--color-border);
}

.footer-copyright {
  color: var(--color-text-3);
  font-size: 0.8rem;
}
</style>
