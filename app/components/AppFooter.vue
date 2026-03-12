<template>
  <footer class="app-footer">
    <div class="container footer-inner">
      <div class="footer-brand">
        <span class="footer-logo">
          <span class="logo-icon">◆</span> ToolSpace
        </span>
        <p class="footer-desc">
          {{ $t('site.tagline') }}
        </p>
      </div>

      <div class="footer-links">
        <div class="footer-group">
          <h4 class="footer-title">
            {{ $t('footer.about') }}
          </h4>
          <NuxtLink
            :to="localePath('/terms')"
            class="footer-link"
          >
            {{ $t('footer.terms') }}
          </NuxtLink>
        </div>
        <div class="footer-group">
          <h4 class="footer-title">
            {{ $t('footer.contact') }}
          </h4>
          <a
            href="mailto:support@tooltool.services"
            class="footer-link"
          >
            support@tooltool.services
          </a>
        </div>
      </div>

      <div class="footer-bottom">
        <p class="footer-copyright">
          {{ $t('footer.copyright', { year: new Date().getFullYear() }) }}
        </p>
      </div>
    </div>
  </footer>
</template>

<script setup>
const localePath = useLocalePath()
</script>

<style scoped>
.app-footer {
  border-top: 1px solid var(--color-border);
  padding: var(--space-2xl) 0 var(--space-lg);
  background: var(--color-surface);
}

.footer-inner {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--space-xl);
}

.footer-brand {
  display: flex;
  flex-direction: column;
  gap: var(--space-sm);
}

.footer-logo {
  font-weight: 800;
  font-size: 1.25rem;
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

.footer-title {
  font-size: 0.9rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: var(--space-md);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.footer-links {
  display: flex;
  flex-direction: column;
  gap: var(--space-md);
}

.footer-link {
  color: var(--color-text-2);
  font-size: 0.9rem;
  transition: color var(--transition-fast);
  display: block;
  text-decoration: none;
}

.footer-link:hover {
  color: var(--color-primary);
}

.footer-bottom {
  grid-column: 1 / -1;
  padding-top: var(--space-lg);
  border-top: 1px solid var(--color-border);
  text-align: center;
}

.footer-copyright {
  color: var(--color-text-3);
  font-size: 0.8rem;
}

@media (max-width: 640px) {
  .footer-inner {
    grid-template-columns: 1fr;
    text-align: center;
  }
  
  .footer-brand {
    align-items: center;
  }

  .footer-desc {
    margin: 0 auto;
  }
}
</style>
