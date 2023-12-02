<template>
    <div class="flex justify-center flex-col sm:flex-row">
        <div class="flex justify-center items-center m-5">
            <span id="left" class="text-7xl origin-center">✊</span>
        </div>
        <div class="flex justify-center items-center m-5">
            <span id="right" class="text-7xl origin-center">✊</span>
        </div>
    </div>
</template>
  
<script lang="ts">
export default {
    props: {
        your: String,
        opponent: String,
    },
};
</script>
  
<style scoped>
#left {
    animation: 0.5s infinite alternate verticalShakingLeftHand;
}

#right {
    animation: 0.5s infinite alternate verticalShakingRightHand;
}

@keyframes verticalShakingLeftHand {
    0% {
        transform: translateY(0) rotate(90deg);
    }

    25% {
        transform: translateY(10px) rotate(90deg);
    }

    50% {
        transform: translateY(-10px) rotate(90deg);
    }

    75% {
        transform: translateY(10px) rotate(90deg);
    }

    100% {
        transform: translateY(0) rotate(90deg);
    }
}

@keyframes verticalShakingRightHand {
    0% {
        transform: translateY(0) rotate(-90deg);
    }

    25% {
        transform: translateY(10px) rotate(-90deg);
    }

    50% {
        transform: translateY(-10px) rotate(-90deg);
    }

    75% {
        transform: translateY(10px) rotate(-90deg);
    }

    100% {
        transform: translateY(0) rotate(-90deg);
    }
}</style>