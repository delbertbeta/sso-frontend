<template>
  <t-skeleton :row-col="rowCol"></t-skeleton>
</template>

<script setup lang="ts">
import type { SkeletonRowCol } from 'tdesign-vue-next';

const rowCol: SkeletonRowCol = [
  [1, 1, 1].map(() => ({ type: 'rect', content: 'image', width: '33%', height: '180px' })),
  [
    { type: 'circle', size: '50px' },
    { type: 'rect', margin: '20px 0', width: '80%', height: '30px' },
  ],
  1,
  1,
  { type: 'text', width: '70%', margin: '0 0 16px 0' },
]
</script>