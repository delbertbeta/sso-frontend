<template>
  <t-avatar v-if="targetName" :style="style" :size="size" :alt="nickname">{{ targetName }}</t-avatar>
  <t-avatar v-else :style="style" :size="size" :image="faceUrl" :alt="nickname" />
</template>

<script setup lang="ts">
import { computed, defineProps } from 'vue';
import type { CSSProperties } from 'vue';
import isChinese from 'is-chinese';

const props = defineProps<{
  nickname: string;
  faceUrl?: string;
  size?: string;
  style?: CSSProperties;
}>();

const targetName = computed(() => {
  if (props.faceUrl) return null;
  const splitted = props.nickname.trim().split(' ');
  if (splitted.length > 1) {
    return splitted.map(v => v[0]).join('').toUpperCase();
  } else {
    const target = splitted[0];
    const hasChinese = Array.from(target).some(isChinese);
    if (hasChinese) {
      return target.slice(-2);
    } else {
      return target.slice(0, 2);
    }
  }
});
</script>

<style scoped>

</style>