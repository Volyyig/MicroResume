<script setup lang="ts">
import { useResumeStore } from './stores/resume'
import { Sparkles, Download, Layout, Type, Loader2 } from 'lucide-vue-next'
import { exportToPDF } from './utils/export'
import { improveResumeContent } from './services/ai'

import { ref, onMounted, onUnmounted } from 'vue'

const store = useResumeStore()
const activeTab = ref<'content' | 'style'>('content')
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

  isPolishing.value = true
  try {
    for (const section of store.resume.sections) {
      if (section.type === 'list') {
        for (const item of section.content) {
          if (item.description && item.description.length > 5) {
            const improved = await improveResumeContent(item.description)
            item.description = improved
          }
        }
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
          <div class="header-main">
            <h2 class="text-gradient">
              <Type :size="20" /> Editor
            </h2>
            <div class="tab-selectors">
              <button @click="activeTab = 'content'" :class="{ active: activeTab === 'content' }">Content</button>
              <button @click="activeTab = 'style'" :class="{ active: activeTab === 'style' }">Style</button>
            </div>
          </div>
          <p class="subtitle">{{ activeTab === 'content' ? 'Personalize your details' : 'Adjust the layout' }}</p>
        </div>

        <div class="editor-fields scroll-on-hover">
          <div v-if="activeTab === 'style'" class="style-editor animate-fade-in">
            <div class="style-group">
              <label>Font Size ({{ store.resume.styles.fontSize }}px)</label>
              <input type="range" v-model.number="store.resume.styles.fontSize" min="10" max="20" step="1"
                class="glass-slider" />
            </div>
            <div class="style-group">
              <label>Line Height ({{ store.resume.styles.lineHeight }})</label>
              <input type="range" v-model.number="store.resume.styles.lineHeight" min="1" max="2" step="0.1"
                class="glass-slider" />
            </div>
            <div class="style-group">
              <label>Page Margin ({{ store.resume.styles.pageMargin }}mm)</label>
              <input type="range" v-model.number="store.resume.styles.pageMargin" min="10" max="40" step="1"
                class="glass-slider" />
            </div>
            <div class="style-group">
              <label>Section Spacing ({{ store.resume.styles.sectionSpacing }}px)</label>
              <input type="range" v-model.number="store.resume.styles.sectionSpacing" min="10" max="50" step="1"
                class="glass-slider" />
            </div>
          </div>

          <div v-else class="content-editor animate-fade-in">
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

            <section v-for="section in store.resume.sections" :key="section.id" class="form-group">
              <div class="section-header">
                <input v-model="section.title" placeholder="Section Title" class="section-title-input" />
                <div class="header-actions">
                  <button @click="store.addItem(section.id)" class="btn-icon" title="Add Item">+</button>
                  <button @click="store.removeSection(section.id)" class="btn-icon-danger"
                    title="Remove Section">×</button>
                </div>
              </div>

              <div v-if="section.type === 'list'" class="list-editor">
                <div v-for="item in section.content" :key="item.id" class="exp-item glass">
                  <div class="item-header-editor">
                    <input v-model="item.company" placeholder="Company/Organization" class="glass-input" />
                    <button @click="store.removeItem(section.id, item.id)" class="btn-remove">×</button>
                  </div>
                  <input v-model="item.role" placeholder="Role/Degree" class="glass-input" />
                  <input v-model="item.period" placeholder="Period (e.g., 2021 - Present)" class="glass-input" />
                  <textarea v-model="item.description" placeholder="Description/Achievements"
                    class="glass-input"></textarea>
                </div>
              </div>

              <div v-else-if="section.type === 'tags'" class="tags-editor">
                <div class="tags-container">
                  <div v-for="(_tag, idx) in section.content" :key="idx" class="tag-input-wrapper">
                    <input v-model="section.content[idx]" class="glass-input tag-input" />
                    <button @click="store.removeItem(section.id, idx)" class="btn-remove-tag">×</button>
                  </div>
                </div>
              </div>
            </section>

            <button @click="store.addSection" class="btn-secondary add-section-btn">
              + Add New Section
            </button>
          </div>
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
          <div class="resume-paper" id="resume-preview" :style="{
            transform: `scale(${previewScale})`,
            fontSize: `${store.resume.styles.fontSize}px`,
            lineHeight: store.resume.styles.lineHeight,
            padding: `${store.resume.styles.pageMargin}mm`
          }">
            <div class="resume-header">
              <h1>{{ store.resume.header.fullName }}</h1>
              <p class="resume-title">{{ store.resume.header.title }}</p>
              <div class="resume-contact">
                <span>{{ store.resume.header.email }}</span> |
                <span>{{ store.resume.header.phone }}</span> |
                <span>{{ store.resume.header.location }}</span>
              </div>
            </div>

            <div v-for="section in store.resume.sections" :key="section.id" class="resume-section"
              :style="{ marginBottom: `${store.resume.styles.sectionSpacing}px` }">
              <h2 class="section-title">{{ section.title }}</h2>
              <div class="section-divider"></div>

              <div v-if="section.type === 'list'" class="experience-list">
                <div v-for="item in section.content" :key="item.id" class="resume-item">
                  <div class="item-header">
                    <strong>{{ item.company }}</strong>
                    <span>{{ item.period }}</span>
                  </div>
                  <div class="item-sub"><em>{{ item.role }}</em></div>
                  <p class="item-desc">{{ item.description }}</p>
                </div>
              </div>

              <div v-else-if="section.type === 'tags'" class="skills-line">
                <span v-for="(tag, idx) in section.content" :key="idx" class="skill-tag">
                  {{ tag }}{{ idx < section.content.length - 1 ? ',' : '' }} </span>
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

.header-main {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 8px;
}

.tab-selectors {
  display: flex;
  background: rgba(255, 255, 255, 0.05);
  padding: 4px;
  border-radius: var(--radius-md);
  gap: 4px;
}

.tab-selectors button {
  background: transparent;
  border: none;
  color: #ccc;
  padding: 6px 16px;
  border-radius: var(--radius-sm);
  cursor: pointer;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.tab-selectors button.active {
  background: var(--accent-color);
  color: white;
  box-shadow: 0 2px 8px var(--accent-glow);
}

.style-editor {
  display: flex;
  flex-direction: column;
  gap: var(--spacing-lg);
  padding: var(--spacing-md) 0;
}

.style-group {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.style-group label {
  font-size: 0.9rem;
  color: #aaa;
}

.glass-slider {
  -webkit-appearance: none;
  appearance: none;
  width: 100%;
  height: 6px;
  background: rgba(255, 255, 255, 0.1);
  border-radius: 3px;
  outline: none;
}

.glass-slider::-webkit-slider-thumb {
  -webkit-appearance: none;
  width: 18px;
  height: 18px;
  background: var(--accent-color);
  border-radius: 50%;
  cursor: pointer;
  box-shadow: 0 0 10px var(--accent-glow);
  transition: transform 0.2s;
}

.glass-slider::-webkit-slider-thumb:hover {
  transform: scale(1.2);
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
  position: relative;
}

.item-header-editor {
  display: flex;
  gap: 10px;
  align-items: flex-start;
}

.btn-remove {
  background: none;
  border: none;
  color: #ff4d4d;
  cursor: pointer;
  font-size: 1.2rem;
  padding: 5px;
  opacity: 0.6;
  transition: opacity 0.2s;
}

.btn-remove:hover {
  opacity: 1;
}

.section-title-input {
  background: transparent;
  border: none;
  border-bottom: 2px solid var(--accent-color);
  color: var(--accent-color);
  font-size: 1.1rem;
  font-weight: bold;
  padding: 5px 0;
  width: 60%;
}

.section-title-input:focus {
  outline: none;
  border-bottom-color: white;
}

.header-actions {
  display: flex;
  gap: 10px;
}

.btn-icon-danger {
  background: rgba(255, 77, 77, 0.1);
  border: 1px solid rgba(255, 77, 77, 0.3);
  color: #ff4d4d;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
}

.btn-icon-danger:hover {
  background: rgba(255, 77, 77, 0.2);
}

.add-section-btn {
  width: 100%;
  margin-top: 20px;
  padding: 15px;
  border-style: dashed;
}

.tags-container {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
}

.tag-input-wrapper {
  display: flex;
  align-items: center;
  background: rgba(255, 255, 255, 0.05);
  border-radius: var(--radius-sm);
  padding: 2px 8px;
  border: 1px solid var(--glass-border);
}

.tag-input {
  border: none !important;
  background: transparent !important;
  margin-bottom: 0 !important;
  padding: 5px !important;
  width: 100px !important;
  box-shadow: none !important;
}

.btn-remove-tag {
  background: none;
  border: none;
  color: #ff4d4d;
  cursor: pointer;
  padding: 0 4px;
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
