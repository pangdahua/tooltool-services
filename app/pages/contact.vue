<template>
  <div class="contact-page">
    <div class="container">
      <article class="content">
        <header class="page-header">
          <h1>{{ $t('contact.title') }}</h1>
          <p>{{ $t('contact.intro') }}</p>
        </header>

        <section class="contact-methods">
          <h2>{{ $t('contact.methods.title') }}</h2>
          
          <div class="contact-option">
            <h3>{{ $t('contact.methods.email.title') }}</h3>
            <p>
              <a href="mailto:support@tooltool.services" class="email-link">
                support@tooltool.services
              </a>
            </p>
            <p>{{ $t('contact.methods.email.responseTime') }}</p>
          </div>

          <div class="contact-option">
            <h3>{{ $t('contact.methods.form.title') }}</h3>
            <form class="contact-form" @submit.prevent="handleSubmit">
              <div class="form-group">
                <label for="name">{{ $t('contact.form.name') }}</label>
                <input
                  id="name"
                  v-model="formData.name"
                  type="text"
                  class="form-input"
                  :placeholder="$t('contact.form.namePlaceholder')"
                  required
                >
              </div>

              <div class="form-group">
                <label for="email">{{ $t('contact.form.email') }}</label>
                <input
                  id="email"
                  v-model="formData.email"
                  type="email"
                  class="form-input"
                  :placeholder="$t('contact.form.emailPlaceholder')"
                  required
                >
              </div>

              <div class="form-group">
                <label for="subject">{{ $t('contact.form.subject') }}</label>
                <input
                  id="subject"
                  v-model="formData.subject"
                  type="text"
                  class="form-input"
                  :placeholder="$t('contact.form.subjectPlaceholder')"
                  required
                >
              </div>

              <div class="form-group">
                <label for="message">{{ $t('contact.form.message') }}</label>
                <textarea
                  id="message"
                  v-model="formData.message"
                  class="form-textarea"
                  rows="5"
                  :placeholder="$t('contact.form.messagePlaceholder')"
                  required
                ></textarea>
              </div>

              <button
                type="submit"
                class="submit-btn"
                :disabled="isSubmitting"
              >
                <span v-if="isSubmitting">{{ $t('contact.form.submitting') }}</span>
                <span v-else>{{ $t('contact.form.submit') }}</span>
              </button>
            </form>
          </div>
        </section>

        <section class="business-hours">
          <h2>{{ $t('contact.businessHours.title') }}</h2>
          <p>{{ $t('contact.businessHours.days') }}</p>
          <p>{{ $t('contact.businessHours.time') }}</p>
        </section>
      </article>
    </div>
  </div>
</template>

<script setup lang="ts">
import { getCanonicalUrl } from '~/utils/seo'

const { t, locale } = useI18n()
const route = useRoute()

const canonicalUrl = computed(() => getCanonicalUrl(route.path, locale.value))

useSeoMeta({
  title: t('contact.seo.title'),
  ogTitle: t('contact.seo.title'),
  description: t('contact.seo.description'),
  ogDescription: t('contact.seo.description'),
  ogUrl: canonicalUrl.value,
  ogType: 'website',
  ogSiteName: 'ToolSpace'
})

const formData = reactive({
  name: '',
  email: '',
  subject: '',
  message: ''
})

const isSubmitting = ref(false)

const handleSubmit = async () => {
  isSubmitting.value = true
  try {
    // 这里可以添加实际的表单提交逻辑
    console.log('Form submitted:', formData)
    alert(t('contact.form.successMessage'))
    
    // 重置表单
    Object.assign(formData, {
      name: '',
      email: '',
      subject: '',
      message: ''
    })
  } catch (error) {
    console.error('Submission error:', error)
    alert(t('contact.form.errorMessage'))
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.contact-page {
  padding: var(--space-2xl) 0;
}

.page-header {
  text-align: center;
  margin-bottom: var(--space-xl);
}

.page-header h1 {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-text);
  margin-bottom: var(--space-sm);
}

.page-header p {
  color: var(--color-text-2);
  max-width: 600px;
  margin: 0 auto;
}

.content {
  max-width: 800px;
  margin: 0 auto;
}

.contact-methods h2 {
  font-size: 1.5rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: var(--space-lg);
}

.contact-option {
  margin-bottom: var(--space-xl);
}

.contact-option h3 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: var(--space-md);
}

.email-link {
  color: var(--color-primary);
  text-decoration: none;
  font-weight: 500;
}

.email-link:hover {
  text-decoration: underline;
}

.contact-form {
  max-width: 600px;
}

.form-group {
  margin-bottom: var(--space-md);
}

.form-group label {
  display: block;
  font-weight: 500;
  color: var(--color-text);
  margin-bottom: var(--space-xs);
}

.form-input,
.form-textarea {
  width: 100%;
  padding: var(--space-sm);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
  font-size: 1rem;
  background: var(--color-surface);
  color: var(--color-text);
}

.form-input:focus,
.form-textarea:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(37, 99, 235, 0.1);
}

.form-textarea {
  resize: vertical;
  min-height: 120px;
}

.submit-btn {
  background: var(--color-primary);
  color: white;
  border: none;
  padding: var(--space-sm) var(--space-lg);
  border-radius: var(--radius-md);
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  transition: background-color var(--transition-fast);
}

.submit-btn:hover:not(:disabled) {
  background: var(--color-primary-dark);
}

.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}

.business-hours {
  margin-top: var(--space-2xl);
  padding-top: var(--space-xl);
  border-top: 1px solid var(--color-border);
}

.business-hours h2 {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-text);
  margin-bottom: var(--space-md);
}
</style>