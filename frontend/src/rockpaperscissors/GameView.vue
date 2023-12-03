<template>
    <GameHeader />

    <LoadingBox v-if="!$store.state.player" />

    <section v-else>
        <div class="app_width">
            <div v-if="$store.state.player.name == ''" class="create">
                <h3>Create Game Account</h3>

                <form>
                    <label for="name">Your Name</label>
                    <input type="text" v-model="playerName" id="name" required name="name" placeholder="John Doe">

                    <button class="button" type="submit">Create Game</button>
                </form>
            </div>

            <div class="play" v-else>
                <div class="profile">
                    <h3>Choose your weapon!</h3>

                    <div class="name">
                        <p>{{ $store.state.player.name }}</p>
                        <span>{{ $store.state.player.points }} points</span>
                    </div>
                </div>

                <Choice v-if="!cooldown" @userAction="sendUserAction"></Choice>
                <ColdownAnimation v-if="cooldown"></ColdownAnimation>
            </div>
        </div>
    </section>
</template>

<script setup>
import GameHeader from './components/GameHeader.vue';
import LoadingBox from '../components/LoadingBox.vue';
import ColdownAnimation from './components/ColdownAnimation.vue';
import Choice from './components/Choice.vue';
</script>

<script>
import { mapMutations } from "vuex";
import { tryGetPlayerOnAvax, tryCreatePlayer } from "../scripts/rockpaperscissors"
import { notify } from "../reactives/notify"
import { watchAccount } from '@wagmi/core'
export default {
    data() {
        return {
            cooldown: false,
            creating: false,
            playerName: ""
        }
    },

    mounted() {
        this.getPlayer()

        watchAccount((account) => {
            this.$store.commit('setWallet', account.address)
            this.getPlayer()
        })
    },

    methods: {
        ...mapMutations(["setChoice"]),

        sendUserAction(choice) {
            this.setChoice(choice);
            this.cooldown = true;

            setTimeout(() => {
                this.$router.push("/rockpaperscissors/result");
            }, 1000);
        },

        createPlayer: async function () {
            if (this.creating) return
            this.creating = true

            const transaction = await tryCreatePlayer(this.$store.state.wallet, this.playerName);
            if (transaction) {
                notify.push({
                    title: "Transaction sent ✔️",
                    description: "Account was created successfully!",
                    category: "success",
                    linkTitle: "View Tnx",
                    linkUrl: `https://testnet.snowtrace.io/tx/${transaction.transactionHash}`
                });
            }
            else {
                notify.push({
                    title: "Transaction failed ❌",
                    description: "Please try again!",
                    category: "error",
                });
            }

            this.creating = false
        },

        getPlayer: async function () {
            if (!this.$store.state.wallet) return
            const player = await tryGetPlayerOnAvax(this.$store.state.wallet)
            this.$store.commit('setPlayer', player)
        }
    }
}
</script>

<style scoped>
.section_header {
    box-shadow: rgba(42, 23, 148, 0.15) 0px 48px 100px 0px;
}

.logo p {
    font-size: 40px;
    font-weight: 700;
    user-select: none;
    color: #000;
}

header {
    height: 80px;
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.create,
.play {
    padding: 60px 0;
}

.create h3,
.play h3 {
    font-size: 30px;
    font-weight: 500;
}

form {
    display: flex;
    flex-direction: column;
}

input {
    height: 50px;
    padding: 20px;
    border-radius: 12px;
    margin-top: 6px;
    border: 1px solid #ccc;
    outline: none;
    font-size: 16px;
}

label {
    margin-top: 16px;
}

form .button {
    height: 50px;
    width: 200px;
    background: var(--pr);
    color: #fff;
    font-size: 16px;
    font-weight: 600;
    border-radius: 12px;
    margin-top: 30px;
    cursor: pointer;
}

.profile {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.profile .name {
    display: flex;
    align-items: center;
    gap: 20px;
}

.name p {
    font-size: 18px;
    font-weight: 500;
}

.name span {
    padding: 4px 8px;
    border-radius: 6px;
    background: blue;
    color: #fff;
    font-size: 14px;
}
</style>