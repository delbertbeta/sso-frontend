<template>
  <t-avatar v-if="targetName" :alt="nickname">{{ targetName }}</t-avatar>
  <t-avatar v-else :image="faceUrl" :alt="nickname" />
</template>

<script setup lang="ts">
import { computed, defineProps } from 'vue';
import isChinese from 'is-chinese';

const props = defineProps<{
  nickname: string;
  faceUrl?: string;
}>();

const { nickname, faceUrl } = props;

const targetName = computed(() => {
  if (faceUrl) return null;
  const splitted = nickname.trim().split(' ');
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
.face-wrapper {
  /* display: inline-block;
  border: 50%;
  overflow: hidden; */
}
</style>