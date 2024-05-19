<template>
  <div
    class="image-uploader-wrapper"
    :class="{ editing }"
    @click="handleClick"
    :style="style"
  >
    <t-avatar
      v-if="editing && imageBlobUrl"
      :size="size"
      :image="imageBlobUrl"
      :image-props="{ fit: 'cover' }"
    />
    <slot v-else />
    <div class="upload-button" v-if="editing">
      <t-icon name="upload" />
    </div>
    <input
      style="display: none"
      ref="input"
      type="file"
      accept="image/gif, image/bmp, image/jpg, image/jpeg, image/png, image/webp"
      multiple="false"
      @change="handleFileInputChange"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watchEffect } from "vue";
import type { CSSProperties } from "vue";
import { patchImage, postImage } from "$api/request";
import { cos, setCosToken } from "$utils/cos";

const props = defineProps<{
  size?: string;
  style?: CSSProperties;
  editing: boolean;
  submitting: boolean;
}>();

const file = ref<File | null>(null);
const imageBlobUrl = ref<string | null>(null);
const input = ref<HTMLInputElement | null>(null);

const handleClick = () => {
  if (props.editing && !props.submitting) {
    input.value?.click();
  }
};

const handleFileInputChange = () => {
  if (!input.value) {
    return;
  }
  if ((input.value.files?.length || 0) > 0) {
    if (imageBlobUrl.value) {
      URL.revokeObjectURL(imageBlobUrl.value);
    }
    file.value = input.value.files![0];
    imageBlobUrl.value = URL.createObjectURL(file.value);
  }
};

watchEffect(() => {
  if (!props.editing) {
    file.value = null;
    if (imageBlobUrl.value) {
      URL.revokeObjectURL(imageBlobUrl.value);
      imageBlobUrl.value = null;
    }
  }
});

const doSubmit = () => {
  return new Promise<string | null>(async (resolve, reject) => {
    if (!file.value) {
      return resolve(null);
    }

    const fileExtension = file.value.name.split(".").pop() || "";

    const postImageRes = await postImage(fileExtension);

    if (postImageRes.isErr) {
      return reject(postImageRes.response);
    }

    const { bucket, region, image_id, image_path, token } =
      postImageRes.response.data;

    setCosToken(token);

    cos.putObject(
      {
        Bucket: bucket,
        Region: region,
        Key: image_path,
        StorageClass: "STANDARD",
        Body: file.value,
      },
      async (err) => {
        if (err) {
          reject(err);
          return;
        } else {
          const res = await patchImage(image_id);
          if (res.isErr) {
            reject(res.response);
            return;
          }
          resolve(image_id);
        }
      }
    );
  });
};

defineExpose({ doSubmit });
</script>

<style scoped>
.image-uploader-wrapper {
  position: relative;
  border-radius: 50%;
  overflow: hidden;
}

.image-uploader-wrapper.editing {
  cursor: pointer;
}

.upload-button {
  position: absolute;
  bottom: 0;
  left: 0;
  height: 22px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  background-color: rgba(255, 255, 255, 0.6);
}
</style>
