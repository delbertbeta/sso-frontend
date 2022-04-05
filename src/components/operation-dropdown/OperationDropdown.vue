<template>
  <div class="operation-dropdown">
    <t-dropdown trigger="click" @click="handleClick">
      <t-button variant="text" size="large">
        <self-face />
        <t-icon name="chevron-down" style="margin-left: 8px;" />
      </t-button>
      <template #dropdown>
        <t-dropdown-menu>
          <t-dropdown-item value="logout">
            <t-icon name="logout" style="margin-right: 8px;" />登出
          </t-dropdown-item>
        </t-dropdown-menu>
      </template>
    </t-dropdown>
  </div>
</template>

<script setup lang="ts">
import type { DropdownOption } from 'tdesign-vue-next';
import SelfFace from '$components/face/SelfFace.vue';

const handleClick = (e: DropdownOption) => {

}
</script>

<style scoped>
:deep(.t-dropdown__item-text) {
  display: flex;
  align-items: center;
}
</style>