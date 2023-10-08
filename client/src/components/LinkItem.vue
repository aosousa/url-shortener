<script setup>
  import { defineAsyncComponent, ref } from 'vue'
  import dayjs from 'dayjs'
  import router from '@/router'

  // Lazy load components that are not immediately needed
  const DeleteLinkModal = defineAsyncComponent({
    loader: () => import('@/components/DeleteLinkModal.vue')
  })

  const URI = import.meta.env.VITE_API_URI

  const props = defineProps({
    link: Object
  })

  // don't mutate prop directly
  const linkCopy = props.link

  const showDeleteLinkModal = ref(false)

  const createdAt = dayjs(linkCopy.created_at).format('DD MMM YYYY HH:mm:ss')
  const updatedAt = linkCopy.updated_at
    ? dayjs(linkCopy.updated_at).format('DD MMM YYYY HH:mm:ss')
    : '-'

  const copyIcon = ref('fa-clipboard')
  const copied = ref(false)

  /**
   * Copy link code to clipboard
   */
  const copyToClipboard = () => {
    // temporarily update icon and show success message
    copyIcon.value = 'fa-clipboard-check'
    copied.value = true

    // copy link code to clipboard
    navigator.clipboard.writeText(`${URI}/${linkCopy.link_code}`)

    // change icon and disable success message after 2500ms
    setTimeout(() => {
      copyIcon.value = 'fa-clipboard'
      copied.value = false
    }, 2500)
  }

  /**
   * Optimistically increment link's views by one
   */
  const updateLinkViews = () => (linkCopy.views += 1)

  /**
   * Open the edit link page for the link received via props
   */
  const editLink = () => {
    router.push({
      name: 'edit-link',
      params: {
        id: props.link.id
      }
    })
  }
</script>

<template>
  <div class="item-container">
    <div class="row">
      <img
        :src="`https://www.google.com/s2/favicons?domain=${linkCopy.original_link}&size=32`"
        :alt="`${linkCopy.original_link} favicon`"
        class="link-icon"
      />
      <p class="link-title" data-test-id="link-title">
        {{ linkCopy.title && linkCopy.title !== '' ? linkCopy.title : '-' }}
      </p>
      <div class="link-actions">
        <span>
          <font-awesome-icon
            title="Copy link to clipboard"
            size="lg"
            :icon="copyIcon"
            class="copy-icon"
            @click="copyToClipboard()"
            data-test-id="copy-to-clipboard-btn"
          />
          <span class="xs:hidden sm:inline-block" :class="{ 'ml-2': copied }">{{
            copied ? 'Copied' : ''
          }}</span>
        </span>
        <font-awesome-icon
          title="Edit link"
          size="lg"
          icon="fa-pencil"
          class="edit-icon"
          @click="editLink()"
          data-test-id="edit-link-btn"
        />
        <font-awesome-icon
          title="Delete link"
          size="lg"
          icon="fa-trash"
          class="delete-icon"
          @click="showDeleteLinkModal = true"
          data-test-id="delete-link-btn"
        />
      </div>
    </div>
    <div class="my-1">
      <!-- prettier-ignore -->
      <a :href="`${URI}/${linkCopy.link_code}`" target="_blank" class="link-code" @click="updateLinkViews()" data-test-id="link-code">{{`${URI}/${linkCopy.link_code}`}}</a>
    </div>
    <div>
      <!-- prettier-ignore -->
      <a :href="linkCopy.original_link" target="_blank" class="link-original" data-test-id="link-original-link">{{ linkCopy.original_link }}</a>
    </div>
    <div class="row mt-2">
      <p class="text-xs" data-test-id="link-views">
        Visited {{ linkCopy.views }} {{ linkCopy.views === 1 ? 'time' : 'times' }}
      </p>
      <div class="ml-auto">
        <div class="row">
          <div class="flex">
            <font-awesome-icon title="Created at" size="sm" icon="fa-calendar" class="date-icon" />
            <p class="date-value" data-test-id="link-created-at">{{ createdAt }}</p>
          </div>
          <div class="flex ml-4">
            <font-awesome-icon title="Last update at" size="sm" icon="fa-gear" class="date-icon" />
            <p class="date-value" data-test-id="link-updated-at">{{ updatedAt }}</p>
          </div>
        </div>
      </div>
    </div>

    <Transition name="fade">
      <DeleteLinkModal
        v-if="showDeleteLinkModal"
        :link="link"
        @close="showDeleteLinkModal = false"
      />
    </Transition>
  </div>
</template>

<style scoped>
  .item-container {
    @apply bg-white dark:bg-neutral-700 w-full min-w-full rounded-md p-4;
  }

  .row {
    @apply flex flex-row;
  }

  .link-icon {
    @apply w-6 h-6 my-auto;
  }

  .link-title {
    @apply text-2xl font-semibold ml-4;
  }

  .link-code {
    @apply text-blue-700 dark:text-blue-400 cursor-pointer hover:underline;
  }

  .link-original {
    @apply text-sm hover:underline;
  }

  .link-actions {
    @apply ml-auto my-auto min-w-[6em];
  }

  .edit-icon {
    @apply text-sky-500 mx-4 cursor-pointer;
  }

  .delete-icon {
    @apply text-red-500 cursor-pointer;
  }

  .date-icon {
    @apply text-neutral-700 dark:text-white my-auto;
  }

  .copy-icon {
    @apply text-neutral-700 dark:text-white cursor-pointer;
  }

  .date-value {
    @apply text-neutral-700 dark:text-white text-xs ml-2;
  }

  .fade-enter-from,
  .fade-leave-to {
    opacity: 0;
  }

  .fade-enter-active {
    transition: opacity 200ms ease-out;
  }

  .fade-leave-active {
    transition: opacity 200ms ease-out;
  }
</style>
