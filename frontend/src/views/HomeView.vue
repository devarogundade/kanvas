<script setup>
import PrimaryButton from '../components/PrimaryButton.vue';

</script>

<template>
  <section>
    <div class="app_width">
      <main>
        <div class="hero">
          <h3>Craft dynamic, cross-chain NFTs effortlessly for immersive gaming experiences.</h3>
        </div>

        <div class="features">
          <div class="feature">
            <div class="bg"></div>

            <div class="content">
              <h3>Get Started</h3>

              <p>As a game developer, you can integrate Kanvas into your game smart contracts to generate dynamic and
                customizable NFTs for your players.</p>

              <PrimaryButton :bg="'#fff'" :color="'var(--text-normal)'" :width="'200px'" :text="'Create Game'" />
            </div>
          </div>

          <div class="feature">
            <div class="bg"></div>

            <div class="content">
              <h3>Read The Docs</h3>

              <p>Your smart contracts simply calls the Kanvas smart contract with a bytes payload to specify NFT
                customization details.
              </p>

              <PrimaryButton :bg="'#fff'" :color="'var(--text-normal)'" :width="'200px'" :text="'GitHub'" />
            </div>
          </div>
        </div>

        <div class="code_flex">
          <div class="code">
            <div class="yourgame">
              <h3>Piggy <br> Game</h3>
            </div>


            <div class="kanvas">
              <h3>Kanvas</h3>
            </div>



            <img class="gif"
              src="https://pyxis.nymag.com/v1/imgs/696/4f8/7b5322246d421f650f7944793b796f36ae-NYM-Ani-Piggy-3-1-b.rhorizontal.w1100.jpg"
              alt="">

            <div class="path path1">
              <div class="tag">bytes('score=10')</div>
              <div class="tag">api_update(nft)</div>
              <div class="line"></div>
            </div>

            <div class="path path2">
              <div class="tag">uri(string)</div>
              <div class="tag">uri(string)</div>
              <div class="line"></div>
            </div>

          </div>

          <PrimaryButton :bg="'#fff'" :width="'240px'" :color="'var(--text-normal)'" :text="'Get Started  '" />
        </div>
      </main>
    </div>
  </section>
</template>


<style scoped>
section {
  padding: 100px 0;
}

.hero {}

.hero h3 {
  text-align: center;
  font-size: 50px;
  color: var(--text-normal);
  line-height: 80px;
  font-weight: 500;
}

.features {
  position: relative;
  margin-top: 100px;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 40px;
}


.feature .bg {
  position: absolute;
  width: 100%;
  height: 100%;
  background: #00000015;
  left: 0;
  top: 0;
}


.feature .content {
  position: absolute;
  width: 100%;
  left: 0;
  bottom: 0;
  z-index: 1;
  padding: 40px;
}

.feature {
  position: relative;
  background-size: cover;
  background-position: center center;
  background-repeat: no-repeat;
  width: 550px;
  height: 550px;
  border-radius: 12px;
  overflow: hidden;
  z-index: 1;
}

.feature h3 {
  color: #fff;
  font-size: 50px;
  font-weight: 700;
  z-index: 1;
}

.feature p {
  color: #fff;
  font-size: 24px;
  margin-top: 30px;
  margin-bottom: 80px;
  line-height: 40px;
  z-index: 1;
}

.feature:hover {
  transform: translateY(-5px);
}

.feature:first-child {
  background-image: url('https://app.infura.io/images/bg-gradient-01.jpg');
}

.feature:nth-child(2) {
  background-image: url('https://app.infura.io/images/bg-gradient-02.jpg');
}

.code_flex {
  display: flex;
  align-items: center;
  flex-direction: column;
  background: #121111;
  box-shadow: rgba(50, 50, 93, 0.642) 0px 50px 100px -20px, rgba(0, 0, 0, 0.618) 0px 30px 60px -30px;
  margin-top: 100px;
  border-radius: 12px;
  padding: 40px;
  padding-bottom: 80px;
}

.code {
  position: relative;
  width: 1200px;
  height: 500px;
  display: flex;
  align-items: center;
  justify-content: space-around;
}

.code .yourgame {
  width: 200px;
  height: 300px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #282525;
  color: #fff;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
  z-index: 1;
  text-align: center;
  line-height: 26px;
}

.code .kanvas {
  width: 200px;
  height: 300px;
  border-radius: 12px;
  display: flex;
  align-items: center;
  justify-content: center;
  background: #282525;
  color: #fff;
  box-shadow: rgba(0, 0, 0, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
  z-index: 1;
}

.code .gif {
  width: 200px;
  height: 300px;
  border-radius: 12px;
  object-fit: cover;
  box-shadow: rgba(32, 4, 92, 0.25) 0px 54px 55px, rgba(0, 0, 0, 0.12) 0px -12px 30px, rgba(0, 0, 0, 0.12) 0px 4px 6px, rgba(0, 0, 0, 0.17) 0px 12px 13px, rgba(0, 0, 0, 0.09) 0px -3px 5px;
  z-index: 1;
}


.code .path {
  position: absolute;
  transform: translate(-50%, -50%);
  left: 50%;
  width: 1000px;
  display: flex;
  justify-content: space-evenly;
}

.path1 {
  top: 40%;
}

.path2 {
  top: 60%;
}

.code .line {
  height: 1px;
  background: #fff;
  position: absolute;
  transform: translate(-50%, -50%);
  top: 50%;
  left: 50%;
  width: 1000px;
}

.code .tag {
  padding: 4px 8px;
  border-radius: 12px;
  background: #fff;
  font-size: 14px;
  width: 140px;
  text-align: center;
  z-index: 1;
}
</style>
