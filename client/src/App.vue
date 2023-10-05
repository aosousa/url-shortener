<script setup>
  import { onMounted, ref } from 'vue'
  import { RouterView } from 'vue-router'
  import router from '@/router'

  // Stores
  import { useLinksStore as linksStore } from '@/stores/links'

  const theme = ref('theme' in localStorage ? localStorage.theme : 'dark')

  /**
   * Change display theme
   * @param {string} newTheme New theme
   */
  const changeTheme = (newTheme) => {
    theme.value = newTheme
    localStorage.setItem('theme', newTheme)
    if (newTheme === 'dark') {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
  }

  // save all existing links to store on startup
  onMounted(() => linksStore().getLinks())
</script>

<template>
  <div>
    <div class="header">
      <h2 class="title" @click="router.push('/')">URL Shortener</h2>
      <button class="ml-auto">
        <font-awesome-icon
          v-if="theme === 'dark'"
          title="Turn on the lights"
          class="sun"
          size="lg"
          icon="fa-sun"
          @click="changeTheme('light')"
        />
        <font-awesome-icon
          v-else
          title="Turn off the lights"
          class="moon"
          size="lg"
          icon="fa-moon"
          @click="changeTheme('dark')"
        />
      </button>
    </div>
    <RouterView />
  </div>
</template>

<style scoped>
  .header {
    @apply flex flex-row;
  }

  .title {
    @apply text-5xl font-semibold hover:text-neutral-600 hover:dark:text-neutral-400 cursor-pointer;
  }

  .moon {
    @apply text-neutral-800 cursor-pointer;
  }

  .sun {
    @apply text-white cursor-pointer;
  }
</style>
