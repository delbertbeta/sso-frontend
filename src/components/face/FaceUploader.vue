<template>
  <image-uploader ref="imageUploader" v-bind="$props">
    <self-face :size="size" />
  </image-uploader>
</template>

<script lang="ts" setup>
import SelfFace from './SelfFace.vue';
import ImageUploader from '$components/image-uploader/ImageUploader.vue';
import { CSSProperties, ref } from 'vue';

const imageUploader = ref<InstanceType<typeof ImageUploader> | null>(null);

const props = defineProps<{
  size?: string;
  style?: CSSProperties;
  editing: boolean;
  submitting: boolean;
}>();

defineExpose({
  getImageUploader: () => {
    return imageUploader.value;
  },
});
</script>
