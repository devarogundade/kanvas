<template>
    <div class="w-full flex flex-col sm:flex-row justify-center items-center">
        <div v-for="choice in choices"
            class="bg-white/30 backdrop-blur aspect-square rounded-xl w-36 m-5 flex justify-center items-center hover:outline outline-black/30 cursor-pointer"
            @click="userAction(choice)">
            <span class="text-7xl">{{ choice }}</span>
        </div>
    </div>
</template>
  
<script lang="ts">
export default {
    data() {
        return {
            choices: ["🪨", "🧻", "✂️"],
        };
    },
    methods: {
        userAction(choice) {
            this.$emit("userAction", choice);
        },
    },
};
</script>
  
<style scoped></style>