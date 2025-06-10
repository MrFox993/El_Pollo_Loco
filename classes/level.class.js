class Level {
  enemies;
  clouds;
  backgroundObjects;
  bgImgStartingX = -719;
  level_end_x = 5750;

  constructor(enemies, clouds, backgroundObject1, backroundObject2) {
    this.enemies = enemies || [];
    this.clouds = clouds || [];
    this.backgroundObjects = [];
    this.generateBackgroundObjects(backgroundObject1, backroundObject2);
  }

  generateBackgroundObjects(backgroundObject1, backroundObject2) {
    const repetitions = 10;
    const segmentWidth = 719;
    let currentX = this.bgImgStartingX;

    this.backgroundObjects = [];

    for (let i = 0; i < repetitions; i++) {
      const imageSet = i % 2 === 0 ? backgroundObject1 : backroundObject2;

      for (let j = 0; j < imageSet.length; j++) {
        this.backgroundObjects.push(new BackgroundObject(imageSet[j], currentX));
      }

      currentX += segmentWidth;
    }
  }
}
