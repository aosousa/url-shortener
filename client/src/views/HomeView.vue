<script setup>
  import { computed, ref } from 'vue'
  import { storeToRefs } from 'pinia'

  // Components
  import LinkForm from '@/components/LinkForm.vue'
  import LinkItem from '@/components/LinkItem.vue'
  import LoadingSpinner from '@/components/LoadingSpinner.vue'

  // Stores
  import { useLinksStore } from '@/stores/links'

  const sortOption = ref('created-at-desc')
  const searchFilter = ref('')

  /**
   * convert getters in store to Vue refs so any change is reflected
   * immediately either in the template or in computed variables that
   * use the refs
   */
  const linksStore = useLinksStore()
  const { sortedAndFilteredLinks } = storeToRefs(linksStore)
  const links = computed(() => sortedAndFilteredLinks.value(sortOption.value, searchFilter.value))

  const activeTab = ref('links')
  const changeTab = (tab) => (activeTab.value = tab)
</script>

<template>
  <main>
    <div class="tabs">
      <button
        class="tab"
        :class="{ 'active-tab': activeTab === 'links' }"
        data-test-id="links-tab"
        @click="changeTab('links')"
      >
        Links
      </button>
      <button
        class="tab"
        :class="{ 'active-tab': activeTab === 'add-link' }"
        data-test-id="add-link-tab"
        @click="changeTab('add-link')"
      >
        Add Link
      </button>
    </div>

    <div v-if="activeTab === 'links'">
      <div class="filters">
        <div class="filter-items">
          <div class="filter-item">
            <label for="sort-option" class="filter-label">Sort links by</label>
            <select
              v-model="sortOption"
              name="sort-option"
              id="sort-option"
              class="filter-select"
              data-test-id="sort-option"
            >
              <option value="title-asc">Title (Ascending)</option>
              <option value="title-desc">Title (Descending)</option>
              <option value="views-asc">Views (Ascending)</option>
              <option value="views-desc">Views (Descending)</option>
              <option value="created-at-asc">Created At (Ascending)</option>
              <option value="created-at-desc">Created At (Descending)</option>
            </select>
          </div>
          <div class="filter-item">
            <label for="search-filter" class="filter-label">Search</label>
            <input
              v-model="searchFilter"
              id="search-filter"
              type="text"
              class="filter-input"
              placeholder="Filter by title, link, or code"
              data-test-id="search-filter"
            />
          </div>
        </div>
      </div>

      <div class="filter-line"></div>

      <div v-if="linksStore.loading">
        <LoadingSpinner />
      </div>
      <div v-else>
        <div class="content">
          <div v-if="links.length > 0">
            <div v-for="link in links" :key="link.id" class="link-item">
              <LinkItem :link="link" />
            </div>
          </div>
          <div v-else class="no-links">
            <p>
              No links available.
              <span class="add-link" @click="changeTab('add-link')">Create one?</span>
            </p>
          </div>
        </div>
      </div>
    </div>

    <div v-else-if="activeTab === 'add-link'">
      <LinkForm @cancel="changeTab('links')" @submit="changeTab('links')" />
    </div>
  </main>
</template>

<style scoped>
  .tabs {
    @apply flex flex-row mt-2 mb-4;
  }

  .tab {
    @apply hover:bg-sky-400 focus:bg-sky-400 text-black dark:text-white rounded-md p-2;
  }

  .tab:not(:first-child) {
    @apply ml-2;
  }

  .active-tab {
    @apply bg-sky-400 font-semibold rounded-md;
  }

  .filters {
    @apply flex flex-row text-black dark:text-white rounded-md mt-2 mb-4;
  }

  .filter-items {
    @apply flex flex-row gap-2;
  }

  .filter-item {
    @apply flex flex-col;
  }

  .filter-label {
    @apply text-lg font-semibold;
  }

  .filter-select {
    @apply xs:w-full sm:w-56 h-8 bg-neutral-600 dark:bg-white text-white dark:text-black rounded-md p-1;
  }

  .filter-input {
    @apply xs:w-full sm:w-52 bg-neutral-600 dark:bg-white text-white dark:text-black rounded-md p-1;
  }

  .filter-input::placeholder {
    @apply text-white dark:text-black opacity-50 xs:text-sm sm:text-base;
  }

  .filter-line {
    @apply border border-neutral-400 dark:border-white rounded-md my-4;
  }

  .content {
    @apply flex flex-col gap-4 mt-2;
  }

  .no-links {
    @apply text-xl mx-auto;
  }

  .link-item:not(:first-child) {
    @apply my-4;
  }

  .add-link {
    @apply text-sky-500 cursor-pointer hover:underline;
  }
</style>
