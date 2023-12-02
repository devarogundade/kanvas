<template>
    <section>
        <div class="app_width">
            <main>
                <div class="title">
                    <h3>Create New Game</h3>
                </div>

                <form>
                    <label for="name">Name</label>
                    <input type="text" id="name" required name="name" placeholder="Axie Infinity">

                    <label for="description">Description</label>
                    <input type="text" id="description" required name="description"
                        placeholder="A Decentralized Arcade Game">

                    <label for="gameId">Game Id</label>
                    <input type="text" id="gameId" required name="gameId"
                        placeholder="0x909d21baE8be0aD4d35d89129b2a4f2925da7877">

                    <label for="email">Email</label>
                    <input type="email" id="email" required name="email" placeholder="axie@game.com">

                    <label for="website">Webiste</label>
                    <input type="text" id="website" name="website" placeholder="https://axie.infinty">

                    <label for="avatar">Avatar</label>
                    <div class="avatar">
                        <input required type="file" style="opacity: 0; cursor: pointer;" accept="image/*">
                        <i class="fi fi-rr-picture"></i>
                        <img v-show="false" src="" alt="">
                    </div>

                    <div class="plans">
                        <div class="plan plan_active">
                            <p class="name">Starter</p>
                            <ul>
                                <li>500 Players</li>
                                <li>3 NFT Templates</li>
                            </ul>
                            <div class="cost">0 Avax</div>
                        </div>

                        <div class="plan">
                            <p class="name">Business</p>
                            <ul>
                                <li>5000 Players</li>
                                <li>10 NFT Templates</li>
                            </ul>
                            <div class="cost">5 Avax</div>
                        </div>

                        <div class="plan">
                            <p class="name">Enterprise</p>
                            <ul>
                                <li>Unlimited Players</li>
                                <li>50 NFT Templates</li>
                            </ul>
                            <div class="cost">50 Avax</div>
                        </div>
                    </div>

                    <button class="button" type="submit">Create Game</button>
                </form>
            </main>
        </div>
    </section>
</template>

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
    border: none !important;
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

.button {
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
</style>