function createLevel1() {
    return new Level({
      enemies: [
        new ChickenSmall(),
        new ChickenSmall(),
        new ChickenSmall(),
        new ChickenSmall()
      ],
      endboss: new Endboss(),
      clouds: [
        new Cloud(),
        new Cloud(),
        new Cloud(),
        new Cloud(),
        new Cloud()
      ],
      backgroundObject1: [
        "./assets/img/5_background/layers/air.png",
        "./assets/img/5_background/layers/3_third_layer/1.png",
        "./assets/img/5_background/layers/2_second_layer/1.png",
        "./assets/img/5_background/layers/1_first_layer/1.png"
      ],
      backgroundObject2: [
        "./assets/img/5_background/layers/air.png",
        "./assets/img/5_background/layers/3_third_layer/2.png",
        "./assets/img/5_background/layers/2_second_layer/2.png",
        "./assets/img/5_background/layers/1_first_layer/2.png"
      ],
      bottles: [
        new Bottle(), new Bottle(), new Bottle(),
        new Bottle(), new Bottle(), new Bottle(),
        new Bottle()
      ],
      coins: [
        new Coin(), new Coin(), new Coin(),
        new Coin(), new Coin(), new Coin(),
        new Coin()
      ]
    });
  }
  