<template>
  <t-avatar v-if="!self" alt="empty avatar"></t-avatar>
  <face v-else :nickname="self.nickname" :face-url="self.face_url" />
</template>

<script setup lang="ts">
import { key } from '$store';
import Face from './Face.vue';
import { useStore } from 'vuex';
import { computed } from 'vue';

const store = useStore(key);

const self = computed(() => store.state.user.self);
</script>
