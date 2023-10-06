<script setup></script>

<template>
  <div class="not-found-container">
    <div class="not-found-center">
      <h2 class="not-found-title">404 Not Found</h2>
      <p class="not-found-message">
        The link you've clicked is invalid or does not exist.<br />Remember that the links are case
        sensitive.
      </p>
      <p class="not-found-message">
        You can check the list of available links <a href="/" class="home-link">here.</a>
      </p>
    </div>
  </div>
</template>

<style scoped>
  .not-found-container {
    @apply flex flex-col min-h-[calc(95vh-74px)];
  }

  .not-found-center {
    @apply flex flex-col my-auto;
  }

  .not-found-title {
    @apply text-5xl font-semibold mx-auto mb-4;
  }

  .not-found-message {
    @apply mx-auto my-2;
  }

  .home-link {
    @apply text-sky-500 cursor-pointer hover:underline;
  }
</style>
