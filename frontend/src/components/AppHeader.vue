<template>
    <section>
        <div class="app_width">
            <header>
                <RouterLink to="/">
                    <div class="logo">
                        <p>Kanvas</p>
                    </div>
                </RouterLink>

                <div class="actions">
                    <RouterLink to="/games">
                        <PrimaryButton width="240px" text="Launch App" v-if="$route.path == '/'" />
                        <div v-else>
                            <PrimaryButton width="240px" v-if="!$store.state.wallet" text="Connect Wallet"
                                @click="connectWallet" />
                            <PrimaryButton width="240px" v-else :text="$fineAddress($store.state.wallet)"
                                @click="openModel" />
                        </div>
                    </RouterLink>
                </div>
            </header>
        </div>
    </section>
</template>

<script setup>
import { RouterLink } from "vue-router";
import PrimaryButton from "../components/PrimaryButton.vue"
</script>

<script>
import { createWeb3Modal, defaultWagmiConfig } from '@web3modal/wagmi/vue'
import { avalancheFuji } from '@wagmi/core/chains'
import { watchAccount } from '@wagmi/core'

const projectId = import.meta.env.VITE_PROJECT_ID

export default {
    data() {
        return {
            modal: null,
        }
    },
    mounted() {
        const metadata = {
            name: 'Kanvas dApp',
            description: 'Connect Your Web3 Wallet',
            url: 'https://web3modal.com',
            icons: ['https://avatars.githubusercontent.com/u/37784886']
        }

        const chains = [avalancheFuji]
        const wagmiConfig = defaultWagmiConfig({ chains, projectId, metadata })

        this.modal = createWeb3Modal({ wagmiConfig, projectId, chains, defaultChain: avalancheFuji })

        watchAccount((account) => {
            this.$store.commit('setWallet', account.address)
        })
    },
    methods: {
        openModel: function () {
            if (this.modal) this.modal.open({ view: 'Account' })
        },

        connectWallet: async function () {
            if (!this.$store.state.wallet) {
                this.modal.open()
            } else {
                this.openModel()
                return
            }

            watchAccount((account) => {
                this.$store.commit('setWallet', account.address)
            })
        },
    }
}
</script>

<style scoped>
section {
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
</style>