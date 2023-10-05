<script setup>
  defineProps({
    // title to use in modal header
    title: String
  })

  defineEmits(['close'])
</script>

<template>
  <div class="modal">
    <div class="modal-header">
      <div class="modal-header-title">
        <p class="modal-header-title-text">{{ title }}</p>
        <button type="button" class="modal-header-title-div-close" @click="$emit('close')">
          <svg
            class="modal-header-title-div-close-svg"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
            aria-hidden="true"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M6 18L18 6M6 6l12 12"
            />
          </svg>
        </button>
      </div>

      <div class="modal-content">
        <slot></slot>
      </div>
    </div>
  </div>
</template>

<style scoped>
  .modal {
    @apply flex flex-col fixed top-0 left-0 bottom-0 right-0 w-screen h-screen bg-black bg-opacity-80 p-4 z-50 items-center;
  }

  .modal-header {
    @apply flex flex-col w-full bg-white dark:bg-neutral-800 text-black dark:text-white rounded-lg overflow-auto md:w-6/12 2xl:w-4/12;
  }

  .modal-header-title {
    @apply flex flex-row border-b p-4;
  }

  .modal-header-title-text {
    @apply flex flex-col font-semibold text-lg;
  }

  .modal-header-title-div-close {
    @apply hover:bg-gray-100 dark:hover:bg-white focus:bg-gray-100 dark:focus:bg-white disabled:text-gray-300 rounded-md p-1 ml-auto;
  }

  .modal-header-title-div-close-svg {
    @apply h-5 w-5 text-black dark:text-white dark:hover:text-black;
  }

  .modal-content {
    @apply flex flex-col bg-white dark:bg-neutral-800 rounded-md p-4;
  }
</style>
