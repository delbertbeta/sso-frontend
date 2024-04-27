<template>
  <div class="empty-placeholder-container">
    <div class="emoticon">(￣ω￣;)</div>
    <div>什么都找不到捏</div>
  </div>
</template>

<style scoped>
  .empty-placeholder-container {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    font: var(--td-font-body-medium);
    color: var(--td-gray-color-5);
    user-select: none;
  }

  .emoticon {
    font: var(--td-font-title-medium);
    margin-bottom: 8px;
  }
</style>