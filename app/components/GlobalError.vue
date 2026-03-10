<template>
  <Teleport to="body">
    <Transition name="slide-up">
      <div
        v-if="isVisible"
        class="global-error-container"
        @click="hideError"
      >
        <div class="global-error-content">
          <div class="error-main">
            <span class="error-icon">⚠</span>
            <div class="error-info">
              <div class="error-text">
                {{ $t(errorKey || 'common.error') }}
              </div>
              <div
                v-if="errorMessage"
                class="error-subtext"
              >
                {{ errorMessage }}
              </div>
            </div>
          </div>
          <button
            class="close-btn"
            @click.stop="hideError"
          >
            &times;
          </button>
        </div>
      </div>
    </Transition>
  </Teleport>
</template>

<script setup lang="ts">
const { errorKey, errorMessage, isVisible, hideError } = useGlobalError()
</script>

<style scoped>
.global-error-container {
  position: fixed;
  bottom: 32px;
  left: 0;
  right: 0;
  z-index: 9999;
  display: flex;
  justify-content: center;
  padding: 0 20px;
  pointer-events: none;
}

.global-error-content {
  pointer-events: auto;
  background: #dc2626;
  color: white;
  padding: 14px 20px;
  border-radius: 16px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  box-shadow: 0 10px 25px -5px rgba(220, 38, 38, 0.3), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  max-width: 100%;
  width: auto;
  min-width: 300px;
  backdrop-filter: blur(8px);
  border: 1px solid rgba(255, 255, 255, 0.1);
}

.error-main {
  display: flex;
  align-items: center;
  gap: 12px;
}

.error-icon {
  font-size: 1.25rem;
  flex-shrink: 0;
}

.error-info {
  display: flex;
  flex-direction: column;
}

.error-text {
  font-size: 0.95rem;
  font-weight: 600;
  line-height: 1.4;
}

.error-subtext {
  font-size: 0.8rem;
  opacity: 0.8;
  margin-top: 2px;
}

.close-btn {
  background: rgba(255, 255, 255, 0.1);
  border: none;
  color: white;
  font-size: 1.4rem;
  width: 28px;
  height: 28px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
  cursor: pointer;
  transition: background 0.2s;
  flex-shrink: 0;
}

.close-btn:hover {
  background: rgba(255, 255, 255, 0.2);
}

/* Transitions */
.slide-up-enter-active,
.slide-up-leave-active {
  transition: all 0.4s cubic-bezier(0.165, 0.84, 0.44, 1);
}

.slide-up-enter-from {
  transform: translateY(100px);
  opacity: 0;
}

.slide-up-leave-to {
  transform: translateY(100px);
  opacity: 0;
}
</style>
