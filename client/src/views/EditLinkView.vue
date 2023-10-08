<script setup>
  import { computed } from 'vue'
  import { useRoute } from 'vue-router'
  import { storeToRefs } from 'pinia'
  import router from '@/router'

  // Components
  import LinkForm from '@/components/LinkForm.vue'

  // Stores
  import { useLinksStore } from '@/stores/links'

  /**
   * convert getters in store to Vue refs so any change is reflected
   * immediately either in the template or in computed variables that
   * use the refs
   */
  const linksStore = useLinksStore()
  const { linkByID } = storeToRefs(linksStore)

  // get link ID in route and find link in store through that ID
  const route = useRoute()
  const linkID = Number(route.params.id)
  const link = computed(() => linkByID.value(linkID))

  // redirect to home page if a link with ID in route doesn't exist
  if (!link.value) {
    router.push('/')
  }

  /**
   * Handle a submit event sent by the LinkForm component. It means the
   * request was successful, so we should send the user back to the home
   * page
   */
  const handleSubmit = () => (router.push('/'))
</script>

<template>
  <div v-if="link">
    <h2 class="title">
      Edit Link - {{ link && link.title && link.title !== '' ? link.title : link.link_code }}
    </h2>
    <LinkForm :link="link" @submit="handleSubmit()" />
  </div>
</template>

<style scoped>
  .title {
    @apply text-2xl font-semibold py-2;
  }
</style>
