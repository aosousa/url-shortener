<script setup>
  import { onUnmounted, ref, watch } from 'vue'
  import router from '@/router'
  import { maxLength, required, requiredIf, url } from '@vuelidate/validators'
  import useVuelidate from '@vuelidate/core'

  // Stores
  import { useLinksStore } from '@/stores/links'

  const props = defineProps({
    link: Object || null
  })

  const emit = defineEmits(['cancel', 'submit'])

  /**
   * If a link is received via prop, use its information in
   * the model and send a PUT request. Otherwise, use default
   * information and send a POST request
   */
  const model = ref({
    title: props.link ? props.link.title : '',
    original_link: props.link ? props.link.original_link : '',
    link_code: props.link ? props.link.link_code : ''
  })

  const error = ref(false)

  /**
   * Link is required and must be a valid URL.
   * Link code must have a maximum length of 8 characters.
   */
  const validations = {
    title: {
      maxLength: maxLength(60)
    },
    original_link: {
      required,
      url
    },
    link_code: {
      /**
       * Short code is not required during creation (where props.link is null)
       * but it is required during editing (where props.link is not null)
       */
      required: requiredIf(() => !!props.link),
      maxLength: maxLength(8)
    }
  }

  const v$ = useVuelidate(validations, model)

  // reset error value when changing model data to re-enable submit button
  watch(model, () => (error.value = false), {
    deep: true
  })

  const linksStore = useLinksStore()

  /**
   * Handle cancel behavior. If we are editing an existing link, use
   * the router to go back to the home page. If we are creating a
   * link, send an event to change the active tab to the links tab.
   */
  const cancel = () => {
    if (props.link) {
      router.push('/')
    } else {
      emit('cancel')
    }
  }

  /**
   * Validate the model according to the defined rules and
   * submit request to links data store if there are no validation
   * errors.
   */
  const submit = () => {
    error.value = false

    // validate the model according to the rules set
    v$.value.$touch()
    if (v$.value.$invalid) {
      error.value = true
      return
    }

    /**
     * If a link was received via props, it means we are updating
     * an existing link, so call the store's update method.
     *
     * Otherwise we are creating a new link, so call the store's
     * create method.
     *
     * If the operation was successful, emit a submit event that will be
     * handled by the views that use this component. Otherwise, the
     * error saved in the store will be displayed to the user.
     */
    if (props.link) {
      linksStore.updateLink(props.link.id, model.value).then((status) => {
        if (status) {
          emit('submit')
        }
      })
    } else {
      linksStore.createLink(model.value).then((status) => {
        if (status) {
          emit('submit')
        }
      })
    }
  }

  // reset store errors when the component is no longer mounted
  onUnmounted(() => (linksStore.error = null))
</script>

<template>
  <form class="container" @submit.prevent="submit()">
    <div class="input-container">
      <label for="original-link" class="input-label">Original Link</label>
      <input
        v-model.trim="model.original_link"
        id="original-link"
        type="url"
        placeholder="https://example.com"
        class="input-item"
        data-test-id="original-link"
      />
      <p v-if="error && v$.original_link.required.$invalid" class="input-error">
        This is a required field.
      </p>
      <p
        v-if="error && v$.original_link.url.$invalid && !v$.original_link.required.$invalid"
        class="input-error"
      >
        Invalid URL.
      </p>
    </div>
    <div class="input-grid mt-4">
      <div class="input-container">
        <label for="title" class="input-label">Title (optional)</label>
        <input
          v-model.trim="model.title"
          id="title"
          type="text"
          maxlength="60"
          placeholder="Example"
          class="input-item"
          data-test-id="title"
        />
        <p v-if="error && v$.title.maxLength.$invalid" class="input-error">
          Maximum of 60 characters allowed.
        </p>
      </div>
      <div class="input-container">
        <!-- prettier-ignore -->
        <label for="link-code" class="input-label">Short Code <span v-if="!link">(optional)</span></label>
        <input
          v-model.trim="model.link_code"
          id="link-code"
          type="text"
          maxlength="8"
          placeholder="Max. 8 characters (e.g., testcode)"
          class="input-item"
          data-test-id="link-code"
        />
        <p v-if="error && v$.link_code.maxLength.$invalid" class="input-error">
          Maximum of 8 characters allowed.
        </p>
        <p v-if="link && v$.link_code.required.$invalid" class="input-error">
          Field cannot be empty while editing.
        </p>
      </div>
    </div>
    <div class="actions">
      <p class="input-error" v-if="linksStore.error" data-test-id="store-error">
        {{ linksStore.error }}
      </p>
      <button
        type="button"
        class="cancel"
        :disabled="linksStore.loading"
        @click="cancel()"
        data-test-id="cancel-btn"
      >
        Cancel
      </button>
      <button
        type="submit"
        class="submit"
        :disabled="linksStore.loading || error"
        data-test-id="submit-btn"
      >
        Submit
      </button>
    </div>
  </form>
</template>

<style scoped>
  .container {
    @apply bg-white dark:bg-neutral-700 w-full min-w-full rounded-md p-4;
  }

  .input-container {
    @apply w-full flex flex-col;
  }

  .input-grid {
    @apply grid grid-cols-2 gap-2;
  }

  .input-label {
    @apply xs:text-xs sm:text-xl font-semibold mb-2;
  }

  .input-item {
    @apply w-full bg-neutral-600 dark:bg-white text-white dark:text-black rounded-md p-1;
  }

  .input-item::placeholder {
    @apply text-white dark:text-black opacity-50 xs:text-xs sm:text-base;
  }

  .input-error {
    @apply text-sm text-red-500 my-auto;
  }

  .actions {
    @apply flex flex-row mt-4;
  }

  .cancel {
    @apply bg-neutral-600 hover:bg-neutral-700 focus:bg-neutral-700 disabled:bg-neutral-400 dark:bg-white hover:dark:bg-gray-400 focus:dark:bg-gray-400 disabled:dark:bg-gray-100 disabled:dark:text-gray-500 text-white dark:text-black rounded-md p-2 ml-auto;
  }

  .submit {
    @apply bg-sky-500 hover:bg-sky-600 focus:bg-sky-600 disabled:bg-sky-300 text-white rounded-md p-2 ml-2;
  }
</style>
