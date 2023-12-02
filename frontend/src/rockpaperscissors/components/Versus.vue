<template>
    <div
        class="flex justify-center items-center flex-col sm:flex-row bg-white/30 backdrop-blur rounded-xl w-11/12 max-w-sm">
        <div class="flex justify-center items-center m-5">
            <span class="text-7xl">{{ you }}</span>
        </div>
        <span class="text-2xl font-bold">vs.</span>
        <div class="flex justify-center items-center m-5">
            <span class="text-7xl">{{ opponent }}</span>
        </div>
    </div>
</template>
  
<script lang="ts">
export default {
    props: ['you', 'opponent']
};
</script>
  
<style scoped></style>