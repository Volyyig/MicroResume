<script setup lang="ts">
import { useResumeStore } from '../stores/resume'

const store = useResumeStore()
</script>

<template>
    <div class="settings-panel">
        <div class="setting-group">
            <label class="setting-label">AI Provider</label>
            <div class="toggle-group">
                <button @click="store.changeAIProvider('gemini')"
                    :class="['toggle-btn', { active: store.resume.settings.aiProvider === 'gemini' }]">Gemini</button>
                <button @click="store.changeAIProvider('zhipu')"
                    :class="['toggle-btn', { active: store.resume.settings.aiProvider === 'zhipu' }]">Zhipu AI</button>
            </div>
        </div>

        <div class="divider"></div>

        <div class="setting-group">
            <label class="setting-label">Font Size <span class="value-badge">{{ store.resume.styles.fontSize
                    }}px</span></label>
            <input type="range" v-model.number="store.resume.styles.fontSize" min="10" max="20" step="1"
                class="range-input" />
        </div>

        <div class="setting-group">
            <label class="setting-label">Line Height <span class="value-badge">{{ store.resume.styles.lineHeight
                    }}</span></label>
            <input type="range" v-model.number="store.resume.styles.lineHeight" min="1" max="2" step="0.1"
                class="range-input" />
        </div>

        <div class="setting-group">
            <label class="setting-label">Page Margin <span class="value-badge">{{ store.resume.styles.pageMargin
                    }}mm</span></label>
            <input type="range" v-model.number="store.resume.styles.pageMargin" min="10" max="40" step="1"
                class="range-input" />
        </div>

        <div class="setting-group">
            <label class="setting-label">Section Spacing <span class="value-badge">{{ store.resume.styles.sectionSpacing
                    }}px</span></label>
            <input type="range" v-model.number="store.resume.styles.sectionSpacing" min="10" max="50" step="1"
                class="range-input" />
        </div>
    </div>
</template>

<style scoped>
.settings-panel {
    display: flex;
    flex-direction: column;
    gap: var(--spacing-lg);
    padding: var(--spacing-xs) 0;
}

.setting-group {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.setting-label {
    font-size: 0.825rem;
    font-weight: 500;
    color: var(--color-text-secondary);
    display: flex;
    align-items: center;
    gap: 8px;
}

.value-badge {
    font-size: 0.75rem;
    font-weight: 600;
    color: var(--color-accent);
    background: var(--color-accent-bg);
    padding: 1px 8px;
    border-radius: var(--radius-full);
}

.divider {
    height: 1px;
    background: var(--color-border);
    margin: 4px 0;
}

/* Toggle group */
.toggle-group {
    display: flex;
    background: var(--color-bg);
    padding: 3px;
    border-radius: var(--radius-md);
    gap: 3px;
    border: 1px solid var(--color-border);
}

.toggle-btn {
    flex: 1;
    padding: 7px 14px;
    border: none;
    background: transparent;
    color: var(--color-text-secondary);
    font-size: 0.825rem;
    font-weight: 500;
    font-family: inherit;
    border-radius: calc(var(--radius-md) - 3px);
    cursor: pointer;
    transition: all var(--transition-fast);
}

.toggle-btn.active {
    background: var(--color-surface);
    color: var(--color-accent);
    box-shadow: var(--shadow-xs);
    font-weight: 600;
}

/* Range slider */
.range-input {
    -webkit-appearance: none;
    appearance: none;
    width: 100%;
    height: 4px;
    background: var(--color-border);
    border-radius: 2px;
    outline: none;
    cursor: pointer;
}

.range-input::-webkit-slider-thumb {
    -webkit-appearance: none;
    width: 16px;
    height: 16px;
    background: var(--color-accent);
    border-radius: 50%;
    cursor: pointer;
    box-shadow: 0 1px 4px rgba(79, 70, 229, 0.3);
    transition: transform var(--transition-fast);
}

.range-input::-webkit-slider-thumb:hover {
    transform: scale(1.15);
}

.range-input::-moz-range-thumb {
    width: 16px;
    height: 16px;
    background: var(--color-accent);
    border-radius: 50%;
    border: none;
    cursor: pointer;
}
</style>
