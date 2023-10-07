<script setup>
  import { onUnmounted } from 'vue'

  // Components
  import DefaultModal from '@/components/DefaultModal.vue'

  // Stores
  import { useLinksStore } from '@/stores/links'

  const URI = import.meta.env.VITE_API_URI

  const props = defineProps({
    link: Object
  })

  const emit = defineEmits(['close'])

  const linksStore = useLinksStore()

  /**
   * Call the delete link method in links store.
   *
   * If the operation was successful, emit a close event that will
   * be handled by the views that use this component. Otherwise, the
   * error saved in the store will be displayed to the user.
   */
  const deleteLink = () => {
    linksStore.deleteLink(props.link.id).then((status) => {
      if (status) {
        emit('close')
      }
    })
  }

  // reset store errors when the component is no longer mounted
  onUnmounted(() => (linksStore.error = null))
</script>

<template>
  <DefaultModal
    :title="`Delete Link - ${link.title && link.title !== '' ? link.title : link.link_code}`"
    @close="$emit('close')"
  >
    <div class="container">
      <p>Are you sure you want to delete the following link?</p>
      <p class="link" data-test-id="link-description">{{ `${URI}/${link.link_code}` }}</p>
      <div class="delete-actions">
        <p class="error" v-if="linksStore.error">{{ linksStore.error }}</p>
        <button
          type="button"
          class="cancel"
          :disabled="linksStore.loading"
          @click="$emit('close')"
          data-test-id="cancel-btn"
        >
          Cancel
        </button>
        <button
          type="submit"
          class="delete"
          :disabled="linksStore.loading"
          @click="deleteLink()"
          data-test-id="delete-btn"
        >
          Delete Link
        </button>
      </div>
    </div>
  </DefaultModal>
</template>

<style scoped>
  .container {
    @apply flex flex-col;
  }

  .link {
    @apply text-blue-700 dark:text-blue-400 mx-auto mt-4;
  }

  .delete-actions {
    @apply flex flex-row mt-4;
  }

  .cancel {
    @apply bg-neutral-600 hover:bg-neutral-700 focus:bg-neutral-700 disabled:bg-neutral-400 dark:bg-white hover:dark:bg-gray-400 focus:dark:bg-gray-400 disabled:dark:bg-gray-100 disabled:dark:text-gray-500 text-white dark:text-black rounded-md p-2 ml-auto;
  }

  .delete {
    @apply bg-red-500 hover:bg-red-700 focus:bg-red-700 disabled:bg-red-300 text-white rounded-md p-2 ml-2;
  }

  .error {
    @apply text-sm text-red-500 my-auto;
  }
</style>
