<script setup lang="ts">
import { useResumeStore } from './stores/resume'
import { Sparkles, Download, FileText, Loader2 } from 'lucide-vue-next'
import { exportToPDF } from './utils/export'
import { improveResumeContent } from './services/ai'
import { ref } from 'vue'

import EditorHeader from './components/EditorHeader.vue'
import SectionEditor from './components/SectionEditor.vue'
import StyleSettings from './components/StyleSettings.vue'
import ResumePreview from './components/ResumePreview.vue'
import SectionToolbar from './components/SectionToolbar.vue'

const store = useResumeStore()
const activeTab = ref<'content' | 'style'>('content')
const isPolishing = ref(false)
const polishingStatus = ref('')

const handleExport = async () => {
  await exportToPDF('resume-preview', `${store.resume.header.fullName.replace(/\s+/g, '_')}_Resume.pdf`)
}

const handleAIImprove = async () => {
  if (isPolishing.value) return

  isPolishing.value = true
  polishingStatus.value = 'Preparing...'
  try {
    let totalItems = 0
    store.resume.sections.forEach(s => {
      s.blocks.forEach(b => {
        if (b.type === 'professional' || b.type === 'bullets') {
          totalItems += b.content.length
        }
      })
    })

    let currentItem = 0

    for (const section of store.resume.sections) {
      for (const block of section.blocks) {
        if (block.type === 'professional') {
          for (const item of block.content) {
            if (item.description && item.description.length > 5) {
              currentItem++
              polishingStatus.value = `Polishing ${section.title} (${currentItem}/${totalItems})...`
              const improved = await improveResumeContent(item.description, store.resume.settings.aiProvider)
              item.description = improved
            }
          }
        } else if (block.type === 'bullets') {
          for (let i = 0; i < block.content.length; i++) {
            if (block.content[i].length > 5) {
              currentItem++
              polishingStatus.value = `Polishing ${section.title} (${currentItem}/${totalItems})...`
              const improved = await improveResumeContent(block.content[i], store.resume.settings.aiProvider)
              block.content[i] = improved
            }
          }
        }
      }
    }
    polishingStatus.value = 'Done!'
    setTimeout(() => { polishingStatus.value = '' }, 3000)
  } catch (error: any) {
    alert(error.message || 'AI polishing failed.')
    polishingStatus.value = ''
  } finally {
    isPolishing.value = false
  }
}
</script>

<template>
  <div class="app">
    <!-- Top Bar -->
    <header class="topbar">
      <div class="topbar-inner">
        <div class="brand">
          <FileText :size="20" class="brand-icon" />
          <span class="brand-name">micro-resume</span>
        </div>
        <div class="topbar-actions">
          <button @click="handleAIImprove" class="btn-secondary" :disabled="isPolishing">
            <component :is="isPolishing ? Loader2 : Sparkles" :size="16" :class="{ spin: isPolishing }" />
            {{ isPolishing ? polishingStatus : 'AI Polish' }}
          </button>
          <button @click="handleExport" class="btn-primary">
            <Download :size="16" />
            Export PDF
          </button>
        </div>
      </div>
    </header>

    <!-- Main Layout -->
    <main class="main-layout">
      <!-- Editor Panel -->
      <aside class="editor-panel">
        <!-- Tab switcher -->
        <div class="panel-header">
          <div class="tab-bar">
            <button @click="activeTab = 'content'" :class="['tab-btn', { active: activeTab === 'content' }]">
              Content
            </button>
            <button @click="activeTab = 'style'" :class="['tab-btn', { active: activeTab === 'style' }]">
              Settings
            </button>
          </div>
        </div>

        <!-- Tab content -->
        <div class="panel-body">
          <!-- Style settings -->
          <div v-if="activeTab === 'style'" class="animate-fade-in">
            <StyleSettings />
          </div>

          <!-- Content editor -->
          <div v-else class="animate-fade-in">
            <EditorHeader />

            <SectionEditor v-for="(section, idx) in store.resume.sections" :key="section.id" :section-id="section.id"
              :is-first="idx === 0" :is-last="idx === store.resume.sections.length - 1" class="section-gap" />

            <SectionToolbar />
          </div>
        </div>
      </aside>

      <!-- Preview Panel -->
      <section class="preview-panel card">
        <div class="preview-header">
          <span class="preview-label">Preview</span>
        </div>
        <ResumePreview />
      </section>
    </main>
  </div>
</template>

<style scoped>
.app {
  display: flex;
  flex-direction: column;
  height: 100vh;
}

/* Top Bar */
.topbar {
  height: 60px;
  background: var(--color-surface);
  border-bottom: 1px solid var(--color-border);
  display: flex;
  align-items: center;
  padding: 0 var(--spacing-lg);
  flex-shrink: 0;
}

.topbar-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
  width: 100%;
  max-width: 1440px;
  margin: 0 auto;
}

.brand {
  display: flex;
  align-items: center;
  gap: 10px;
}

.brand-icon {
  color: var(--color-accent);
}

.brand-name {
  font-size: 1.15rem;
  font-weight: 700;
  color: var(--color-text-primary);
  letter-spacing: -0.02em;
}

.topbar-actions {
  display: flex;
  gap: var(--spacing-sm);
}

/* Main Layout */
.main-layout {
  display: grid;
  grid-template-columns: 420px 1fr;
  flex: 1;
  overflow: hidden;
  max-width: 1440px;
  margin: 0 auto;
  width: 100%;
  gap: 0;
}

/* Editor Panel */
.editor-panel {
  display: flex;
  flex-direction: column;
  border-right: 1px solid var(--color-border);
  background: var(--color-surface);
  overflow: hidden;
}

.panel-header {
  padding: var(--spacing-md) var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
}

.tab-bar {
  display: flex;
  background: var(--color-bg);
  padding: 3px;
  border-radius: var(--radius-md);
  gap: 3px;
  border: 1px solid var(--color-border);
}

.tab-btn {
  flex: 1;
  padding: 8px 16px;
  border: none;
  background: transparent;
  color: var(--color-text-secondary);
  font-size: 0.85rem;
  font-weight: 500;
  font-family: inherit;
  border-radius: calc(var(--radius-md) - 3px);
  cursor: pointer;
  transition: all var(--transition-fast);
}

.tab-btn.active {
  background: var(--color-surface);
  color: var(--color-accent);
  box-shadow: var(--shadow-xs);
  font-weight: 600;
}

.panel-body {
  flex: 1;
  overflow-y: auto;
  padding: var(--spacing-lg);
}

.section-gap {
  margin-bottom: var(--spacing-md);
}

/* Preview Panel */
.preview-panel {
  display: flex;
  flex-direction: column;
  overflow: hidden;
  border-radius: 0;
  border: none;
  box-shadow: none;
}

.preview-header {
  padding: var(--spacing-md) var(--spacing-lg);
  border-bottom: 1px solid var(--color-border);
}

.preview-label {
  font-size: 0.8rem;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  color: var(--color-text-secondary);
}

/* Spinner */
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
</style>
