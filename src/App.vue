<script setup lang="ts">
import { useResumeStore, type Section } from './stores/resume'
import { Sparkles, Download, Layout, Type, Loader2 } from 'lucide-vue-next'
import { exportToPDF } from './utils/export'
import { improveResumeContent } from './services/ai'

import { ref, onMounted, onUnmounted } from 'vue'

const store = useResumeStore()
const isPolishing = ref(false)
const previewScale = ref(1)
const previewContainer = ref<HTMLElement | null>(null)

const updateScale = () => {
  if (previewContainer.value) {
    const containerWidth = previewContainer.value.clientWidth - 80 // 40px padding each side
    const paperWidth = 210 * 3.78 // mm to px approx
    previewScale.value = Math.min(1, containerWidth / paperWidth)
  }
}

onMounted(() => {
  updateScale()
  window.addEventListener('resize', updateScale)
})

onUnmounted(() => {
  window.removeEventListener('resize', updateScale)
})

const handleExport = async () => {
  await exportToPDF('resume-preview', `${store.resume.header.fullName.replace(/\s+/g, '_')}_Resume.pdf`)
}

const handleAIImprove = async () => {
  if (isPolishing.value) return

  const expSection = store.resume.sections.find((s: Section) => s.id === 'experience')
  if (!expSection || !Array.isArray(expSection.content)) return

  isPolishing.value = true
  try {
    for (const exp of expSection.content) {
      if (exp.description && exp.description.length > 10) {
        const improved = await improveResumeContent(exp.description)
        exp.description = improved
      }
    }
  } catch (error: any) {
    alert(error.message || 'AI polishing failed.')
  } finally {
    isPolishing.value = false
  }
}
</script>

<template>
  <div class="app-container animate-fade-in">
    <!-- Header / Nav -->
    <header class="main-header glass">
      <div class="header-content">
        <h1 class="logo text-gradient">
          <Layout :size="24" /> micro-resume
        </h1>
        <div class="actions">
          <button @click="handleAIImprove" class="btn-secondary ai-btn" :disabled="isPolishing">
            <component :is="isPolishing ? Loader2 : Sparkles" :size="18" :class="{ 'spin': isPolishing }" />
            {{ isPolishing ? 'Polishing...' : 'AI Polish' }}
          </button>
          <button @click="handleExport" class="btn-primary export-btn">
            <Download :size="18" /> Export PDF
          </button>
        </div>
      </div>
    </header>

    <main class="main-content">
      <div class="editor-pane glass-card">
        <div class="pane-header">
          <h2 class="text-gradient">
            <Type :size="20" /> Editor
          </h2>
          <p class="subtitle">Personalize your details</p>
        </div>

        <div class="editor-fields">
          <section class="form-group">
            <h3>Contact Info</h3>
            <input v-model="store.resume.header.fullName" placeholder="Full Name" class="glass-input" />
            <input v-model="store.resume.header.title" placeholder="Job Title" class="glass-input" />
            <div class="input-grid">
              <input v-model="store.resume.header.email" placeholder="Email" class="glass-input" />
              <input v-model="store.resume.header.phone" placeholder="Phone" class="glass-input" />
            </div>
            <input v-model="store.resume.header.location" placeholder="Location" class="glass-input" />
          </section>

          <section class="form-group">
            <div class="section-header">
              <h3>Experience</h3>
              <button @click="store.addExperience" class="btn-icon">+</button>
            </div>
            <div v-for="exp in (store.resume.sections.find((s: Section) => s.id === 'experience')?.content as any[])"
              :key="exp.id" class="exp-item glass">
              <input v-model="exp.company" placeholder="Company" class="glass-input" />
              <input v-model="exp.role" placeholder="Role" class="glass-input" />
              <textarea v-model="exp.description" placeholder="Description" class="glass-input"></textarea>
            </div>
          </section>
        </div>
      </div>

      <div class="preview-pane glass-card">
        <div class="pane-header">
          <h2 class="text-gradient">
            <Layout :size="20" /> Preview
          </h2>
          <p class="subtitle">Classic Template</p>
        </div>

        <div class="preview-scroll-container" ref="previewContainer">
          <div class="resume-paper" id="resume-preview" :style="{ transform: `scale(${previewScale})` }">
            <div class="resume-header">
              <h1>{{ store.resume.header.fullName }}</h1>
              <p class="resume-title">{{ store.resume.header.title }}</p>
              <div class="resume-contact">
                <span>{{ store.resume.header.email }}</span> |
                <span>{{ store.resume.header.phone }}</span> |
                <span>{{ store.resume.header.location }}</span>
              </div>
            </div>

            <div v-for="section in store.resume.sections" :key="section.id" class="resume-section">
              <h2 class="section-title">{{ section.title }}</h2>
              <div class="section-divider"></div>

              <div v-if="section.id === 'experience'" class="experience-list">
                <div v-for="exp in section.content" :key="exp.id" class="resume-item">
                  <div class="item-header">
                    <strong>{{ exp.company }}</strong>
                    <span>{{ exp.period }}</span>
                  </div>
                  <div class="item-sub"><em>{{ exp.role }}</em></div>
                  <p class="item-desc">{{ exp.description }}</p>
                </div>
              </div>

              <div v-else-if="section.id === 'skills'" class="skills-line">
                <span v-for="(skill, idx) in section.content" :key="idx" class="skill-tag">
                  {{ skill }}{{ idx < section.content.length - 1 ? ',' : '' }} </span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </main>
  </div>
</template>

<style scoped>
.app-container {
  display: flex;
  flex-direction: column;
  height: 100vh;
  gap: 0;
}

.main-header {
  height: 70px;
  display: flex;
  align-items: center;
  padding: 0 var(--spacing-lg);
  position: sticky;
  top: 0;
  z-index: 100;
  border-bottom: 1px solid var(--glass-border);
}

.header-content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1400px;
  margin: 0 auto;
}

.logo {
  font-size: 1.5rem;
  font-weight: 800;
  display: flex;
  align-items: center;
  gap: 10px;
  margin: 0;
}

.actions {
  display: flex;
  gap: var(--spacing-md);
}

.main-content {
  display: grid;
  grid-template-columns: 450px 1fr;
  gap: var(--spacing-lg);
  padding: var(--spacing-lg);
  flex: 1;
  overflow: hidden;
  max-width: 1400px;
  margin: 0 auto;
  width: 100%;
}

.editor-pane,
.preview-pane {
  display: flex;
  flex-direction: column;
  overflow: hidden;
}

.editor-fields {
  overflow-y: auto;
  flex: 1;
  padding-right: 10px;
}

.form-group {
  margin-bottom: var(--spacing-lg);
}

.form-group h3 {
  font-size: 1.1rem;
  margin-bottom: var(--spacing-md);
  color: var(--accent-color);
}

.glass-input {
  width: 100%;
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid var(--glass-border);
  padding: 12px;
  border-radius: var(--radius-md);
  color: white;
  margin-bottom: var(--spacing-sm);
  transition: all 0.2s;
  box-sizing: border-box;
}

.glass-input:focus {
  outline: none;
  border-color: var(--accent-color);
  background: rgba(255, 255, 255, 0.1);
  box-shadow: 0 0 10px var(--accent-glow);
}

.input-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: var(--spacing-sm);
}

.section-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: var(--spacing-md);
}

.btn-icon {
  background: var(--glass-bg);
  border: 1px solid var(--glass-border);
  color: white;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.2rem;
}

.exp-item {
  padding: var(--spacing-md);
  border-radius: var(--radius-md);
  margin-bottom: var(--spacing-md);
}

/* Resume Preview Styles */
.preview-scroll-container {
  flex: 1;
  overflow-y: auto;
  padding: 40px;
  display: flex;
  justify-content: center;
  background: rgba(0, 0, 0, 0.2);
  border-radius: var(--radius-md);
}

.resume-paper {
  background: white;
  color: #333;
  width: 210mm;
  min-height: 297mm;
  padding: 20mm;
  /* Standard 20mm margin */
  box-shadow: 0 10px 40px rgba(0, 0, 0, 0.5);
  box-sizing: border-box;
  transform-origin: top center;
  position: relative;
}

.resume-header {
  text-align: center;
  margin-bottom: 30px;
}

.resume-header h1 {
  margin: 0;
  font-size: 2.5rem;
  color: #1a1a1a;
  text-transform: uppercase;
  letter-spacing: 2px;
}

.resume-title {
  font-size: 1.2rem;
  color: #666;
  margin: 5px 0;
}

.resume-contact {
  font-size: 0.9rem;
  color: #888;
}

.resume-section {
  margin-bottom: 25px;
}

.section-title {
  font-size: 1.2rem;
  color: #1a1a1a;
  text-transform: uppercase;
  margin: 0;
  letter-spacing: 1px;
}

.section-divider {
  height: 2px;
  background: #333;
  margin: 5px 0 15px 0;
}

.resume-item {
  margin-bottom: 15px;
}

.item-header {
  display: flex;
  justify-content: space-between;
  font-size: 1.1rem;
}

.item-sub {
  color: #555;
  font-size: 0.95rem;
}

.item-desc {
  margin: 8px 0;
  font-size: 0.9rem;
  line-height: 1.4;
  color: #444;
}

.skills-line {
  font-size: 0.95rem;
}

.skill-tag {
  margin-right: 8px;
}

.spin {
  animation: spin 1s linear infinite;
}

@keyframes spin {
  from {
    transform: rotate(0deg);
  }

  to {
    transform: rotate(360deg);
  }
}

/* Scrollbar styling */
::-webkit-scrollbar {
  width: 6px;
}

::-webkit-scrollbar-track {
  background: transparent;
}

::-webkit-scrollbar-thumb {
  background: var(--glass-border);
  border-radius: 10px;
}

::-webkit-scrollbar-thumb:hover {
  background: var(--accent-color);
}
</style>
