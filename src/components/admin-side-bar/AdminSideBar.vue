<template>
  <t-aside style="border-top: 1px solid var(--component-border); width: auto;">
    <t-menu :collapsed="collapsed" theme="light" value="dashboard">
      <t-menu-item value="dashboard">
        <template #icon>
          <t-icon name="dashboard" />
        </template>
        仪表盘
      </t-menu-item>
      <t-menu-item value="hello">
        <template #icon>
          <t-icon name="dashboard" />
        </template>
        仪表盘
      </t-menu-item>
      <template #operations>
        <t-icon class="t-menu__operations-icon" :name="iconName" @click="changeCollapsed" />
      </template>
    </t-menu>
  </t-aside>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue';

const collapsed = ref(false);

const iconName = computed(() => (collapsed.value ? 'chevron-right' : 'chevron-left'));

const changeCollapsed = () => {
  collapsed.value = !collapsed.value;
};
</script>