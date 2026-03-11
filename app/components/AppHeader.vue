<template>
  <header class="app-header">
    <div class="container header-inner">
      <NuxtLink
        :to="localePath('/')"
        class="header-logo"
      >
        <span class="logo-icon">◆</span>
        <span class="logo-text">ToolSpace</span>
      </NuxtLink>


      <div class="header-actions">
        <LanguageSwitcher />
        <button
          class="mobile-menu-btn"
          aria-label="Toggle menu"
          @click="mobileMenuOpen = !mobileMenuOpen"
        >
          <span class="menu-bar" />
          <span class="menu-bar" />
          <span class="menu-bar" />
        </button>
      </div>
    </div>
  </header>
</template>

<script setup lang="ts">
const localePath = useLocalePath()
const mobileMenuOpen = ref(false)
</script>

<style scoped>
.app-header {
  position: sticky;
  top: 0;
  z-index: 100;
  height: var(--header-height);
  background: var(--color-bg);
  border-bottom: 1px solid var(--color-border);
  backdrop-filter: blur(12px);
  background: rgba(255, 255, 255, 0.85);
}

.dark .app-header {
  background: rgba(15, 23, 42, 0.85);
}

.header-inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 100%;
  gap: var(--space-lg);
}

.header-logo {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  text-decoration: none;
  color: var(--color-text);
  font-weight: 700;
  font-size: 1.25rem;
  flex-shrink: 0;
}

.logo-icon {
  color: var(--color-primary);
  font-size: 1.5rem;
}

.header-nav {
  display: flex;
  align-items: center;
  gap: var(--space-xs);
}

.nav-link {
  padding: var(--space-sm) var(--space-md);
  border-radius: var(--radius-md);
  color: var(--color-text-2);
  font-size: 0.9rem;
  font-weight: 500;
  transition: all var(--transition-fast);
  text-decoration: none;
  white-space: nowrap;
}

.nav-link:hover,
.nav-link.router-link-active {
  color: var(--color-primary);
  background: var(--color-primary-light);
}

.header-actions {
  display: flex;
  align-items: center;
  gap: var(--space-sm);
  flex-shrink: 0;
}

.mobile-menu-btn {
  display: none;
  flex-direction: column;
  gap: 4px;
  background: none;
  border: none;
  cursor: pointer;
  padding: var(--space-sm);
}

.menu-bar {
  display: block;
  width: 20px;
  height: 2px;
  background: var(--color-text);
  border-radius: 1px;
  transition: all var(--transition-fast);
}

@media (max-width: 768px) {
  .mobile-menu-btn {
    display: flex;
  }

  .header-nav {
    display: none;
    position: absolute;
    top: var(--header-height);
    left: 0;
    right: 0;
    flex-direction: column;
    background: var(--color-bg);
    border-bottom: 1px solid var(--color-border);
    padding: var(--space-md);
    gap: var(--space-xs);
  }

  .header-nav.open {
    display: flex;
  }

  .nav-link {
    width: 100%;
  }
}
</style>
