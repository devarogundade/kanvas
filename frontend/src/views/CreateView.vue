<template>
    <section>
        <div class="app_width">
            <main>
                <div class="title">
                    <h3>Create New Game</h3>
                </div>

                <form @submit="createGame">
                    <label for=" name">Name</label>
                    <input type="text" v-model="game.name" id="name" required name="name" placeholder="Axie Infinity">

                    <label for="description">Description</label>
                    <input type="text" v-model="game.description" id="description" required name="description"
                        placeholder="A Decentralized Arcade Game">

                    <label for="gameId">Game Id</label>
                    <input type="text" v-model="game.gameId" id="gameId" required name="gameId"
                        placeholder="0x909d21baE8be0aD4d35d89129b2a4f2925da7877">

                    <label for="email">Email</label>
                    <input type="email" v-model="game.email" id="email" required name="email" placeholder="axie@game.com">

                    <label for="website">Webiste</label>
                    <input type="text" v-model="game.website" id="website" name="website"
                        placeholder="https://axie.infinty">

                    <label for="avatar">Avatar</label>
                    <div class="avatar">
                        <input @change="doFile" required type="file" style="opacity: 0; cursor: pointer;" accept="image/*">
                        <i class="fi fi-rr-picture"></i>
                        <img ref="image" v-show="file" src="" alt="">
                    </div>

                    <div class="plans">
                        <div v-for="plan, index in plans" :key="plan.id" @click="game.plan = plan.planId"
                            :class="plan.planId == game.plan ? 'plan plan_active' : 'plan'">
                            <p class="name">{{ plan.name }}</p>
                            <ul>
                                <li>{{ limits[index].players }} Players</li>
                                <li>{{ limits[index].templates }} NFT Templates</li>
                                <li>O.OO3AVAX per request</li>
                            </ul>
                            <p></p>
                            <div class="cost">{{ $fromWei(plan.cost) }} Avax</div>
                        </div>
                    </div>

                    <br> <br>

                    <PrimaryButton :width="'240px'" :progress="creating" :text="'Create Game'" />
                </form>
            </main>
        </div>
    </section>
</template>

<script setup>
import PrimaryButton from '../components/PrimaryButton.vue'
</script>

<script>
import { fetchPlans } from '../scripts/graph'
import { tryCreateGame } from '../scripts/kanvas'
import { upload } from "../scripts/storage"
import { notify } from "../reactives/notify"
export default {
    data() {
        return {
            plans: [],
            file: null,
            creating: false,
            game: {
                name: "",
                description: "",
                gameId: "",
                avatar: "",
                email: "",
                website: "",
                plan: null
            },
            limits: [
                { players: 500, templates: 3 },
                { players: 10000, templates: 10 },
                { players: 'Unlimited', templates: 25 }
            ]
        };
    },
    mounted() {
        this.getPlans();
    },
    methods: {
        doFile: function (e) {
            const files = e.target.files;
            if (files.length > 0) {
                this.file = files[0];
                this.$refs['image'].src = URL.createObjectURL(this.file)
            }
            else {
                this.file = null;
            }
        },
        getPlans: async function () {
            this.plans = await fetchPlans();
        },
        createGame: async function (e) {
            e.preventDefault();
            if (this.creating) return

            if (this.game.plan == null) {
                notify.push({
                    title: "Input error",
                    description: "Select a plan!",
                    category: "error",
                });
                return
            }

            this.creating = true;

            let avatar = '';
            if (this.file) {
                const url = await upload(this.file, `avatars/${this.game.gameId}`);
                if (url) { avatar = url; }
            }
            this.game.avatar = avatar;
            const transaction = await tryCreateGame(this.game);
            if (transaction) {
                notify.push({
                    title: "Transaction sent ✔️",
                    description: this.game.name + " was created successfully!",
                    category: "success",
                    linkTitle: "View Tnx",
                    linkUrl: `https://testnet.snowtrace.io/tx/${transaction.transactionHash}`
                });
                this.$router.push('/games');
            }
            else {
                notify.push({
                    title: "Transaction failed ❌",
                    description: "Please try again!",
                    category: "error",
                });
            }


            this.creating = false;
        }
    }
}
</script>

<style scoped>
main {
    padding: 60px 0;
    min-height: 800px;
}

.title {
    display: flex;
    align-items: center;
    justify-content: space-between;
}

.title h3 {
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

.avatar input {
    border: none;
}

.avatar {
    margin-top: 6px;
    border-radius: 12px;
    border: 1px solid #ccc;
    display: flex;
    align-items: center;
    justify-content: center;
    position: relative;
    height: 300px;
    overflow: hidden;
}

.avatar input {
    position: absolute;
    width: 100%;
    height: 100%;
    top: 0;
    left: 0;
    cursor: pointer;
}

.avatar img {
    position: absolute;
    width: 300px;
    height: 300px;
    top: 0;
    left: 0;
    object-fit: cover;
}

.plans {
    display: flex;
    align-items: center;
    gap: 30px;
    margin-top: 16px;
    user-select: none;
}

.plan_active {
    background: red;
    border: 1px red solid;
}

.plan {
    width: 200px;
    border: 1px solid #ccc;
    padding: 20px;
    border-radius: 12px;
    cursor: pointer;
}

.plan .name {
    font-size: 20px;
    font-weight: 500;
}

.plan li {
    margin-top: 10px;
    font-size: 14px;
    list-style: none;
    text-decoration: underline;
}

.plan .cost {
    margin-top: 20px;
    font-size: 30px;
    font-weight: 700;
    color: red;
}

.plan_active .cost {
    color: #fff;
}
</style>