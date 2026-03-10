<template>
  <div
    ref="dropdownRef"
    class="lang-switcher"
  >
    <button
      class="lang-btn"
      :aria-label="'Language: ' + currentLocaleName"
      @click="isOpen = !isOpen"
    >
      <span class="lang-icon">🌐</span>
      <span class="lang-code">{{ currentLocaleCode }}</span>
      <span
        class="lang-arrow"
        :class="{ open: isOpen }"
      >▾</span>
    </button>

    <Transition name="dropdown">
      <div
        v-if="isOpen"
        class="lang-dropdown"
      >
        <button
          v-for="loc in availableLocales"
          :key="loc.code"
          class="lang-option"
          :class="{ active: loc.code === locale }"
          @click="switchTo(loc.code)"
        >
          {{ loc.name }}
        </button>
      </div>
    </Transition>
  </div>
</template>

<script setup lang="ts">
type LocaleCode = 'en' | 'zh-CN' | 'zh-TW' | 'ko' | 'ja'

const { locale, locales } = useI18n()
const switchLocalePath = useSwitchLocalePath()
const isOpen = ref(false)
const dropdownRef = ref<HTMLElement | null>(null)

const availableLocales = computed(() =>
  (locales.value as Array<{ code: LocaleCode, name: string }>)
)

const currentLocaleName = computed(() =>
  availableLocales.value.find(l => l.code === locale.value)?.name || locale.value
)

const currentLocaleCode = computed(() => {
  const code = locale.value
  if (code === 'zh-CN') return '简中'
  if (code === 'zh-TW') return '繁中'
  return code.toUpperCase()
})

function switchTo(code: LocaleCode) {
  navigateTo(switchLocalePath(code))
  isOpen.value = false
}

// Close on click outside
function handleClickOutside(e: MouseEvent) {
  if (dropdownRef.value && !dropdownRef.value.contains(e.target as Node)) {
    isOpen.value = false
  }
}

onMounted(() => document.addEventListener('click', handleClickOutside))
onUnmounted(() => document.removeEventListener('click', handleClickOutside))
</script>

<style scoped>
.lang-switcher {
  position: relative;
}

.lang-btn {
  display: flex;
  align-items: center;
  gap: 6px;
  padding: 6px 12px;
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  background: var(--color-surface);
  color: var(--color-text-2);
  font-size: 0.8rem;
  font-weight: 500;
  cursor: pointer;
  transition: all var(--transition-fast);
  white-space: nowrap;
}

.lang-btn:hover {
  border-color: var(--color-border-hover);
  color: var(--color-text);
}

.lang-icon {
  font-size: 1rem;
}

.lang-arrow {
  font-size: 0.7rem;
  transition: transform var(--transition-fast);
}

.lang-arrow.open {
  transform: rotate(180deg);
}

.lang-dropdown {
  position: absolute;
  top: calc(100% + 6px);
  right: 0;
  min-width: 140px;
  background: var(--color-bg);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-md);
  overflow: hidden;
  z-index: 200;
}

.lang-option {
  display: block;
  width: 100%;
  padding: 10px 16px;
  border: none;
  background: none;
  color: var(--color-text-2);
  font-size: 0.875rem;
  text-align: left;
  cursor: pointer;
  transition: all var(--transition-fast);
}

.lang-option:hover {
  background: var(--color-surface);
  color: var(--color-text);
}

.lang-option.active {
  color: var(--color-primary);
  font-weight: 600;
  background: var(--color-primary-light);
}

/* Dropdown animation */
.dropdown-enter-active,
.dropdown-leave-active {
  transition: all 150ms ease;
}

.dropdown-enter-from,
.dropdown-leave-to {
  opacity: 0;
  transform: translateY(-4px);
}
</style>
