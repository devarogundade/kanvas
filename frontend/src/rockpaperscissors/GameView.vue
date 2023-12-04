<template>
    <GameHeader />

    <LoadingBox v-if="!$store.state.player" />

    <section v-else>
        <div class="app_width">
            <div v-if="$store.state.player.name == ''" class="create">
                <h3>Create Game Account</h3>

                <form @submit="createPlayer">
                    <label for="name">Your Name</label>
                    <input type="text" v-model="playerName" id="name" required name="name" placeholder="John Doe">

                    <br> <br>

                    <PrimaryButton :type="'submit'" :progress="creating" :width="'200px'" :text="'Create Game'" />
                </form>
            </div>

            <div class="play" v-else>
                <div class="profile">
                    <h3>Choose your weapon!</h3>

                    <div class="name">
                        <p>{{ $store.state.player.name }}</p>
                        <span>{{ $store.state.player.points }} points</span>
                        <a style="display: flex; align-items: center; gap: 10px; font-weight: 500; font-size: 14px; border: 1px solid #ccc; border-radius: 6px; padding: 4px 10px;"
                            target="_blank"
                            :href="`https://testnets.opensea.io/assets/avalanche-fuji/${gameId(43113)}`">View NFT
                            <OutIcon />
                        </a>
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
import PrimaryButton from '../components/PrimaryButton.vue';
import OutIcon from '../components/icons/OutIcon.vue';
import Choice from './components/Choice.vue';
</script>

<script>
import { mapMutations } from "vuex";
import { tryGetPlayerOnAvax, tryCreatePlayer, gameId } from "../scripts/rockpaperscissors"
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

        createPlayer: async function (e) {
            e.preventDefault()

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

                this.getPlayer()
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