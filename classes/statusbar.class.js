class StatusBar extends DrawableObject {
    imagesHealthBar = [
        "./assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png",
        "./assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/80.png",
        "./assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png",
        "./assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png",
        "./assets/img/7_statusbars/1_statusbar/2_statusbar_health/orange/20.png",
        "./assets/img/7_statusbars/1_statusbar/2_statusbar_health/orange/0.png",
    ];
    imagesBootleBar = [
        "./assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/100.png",
        "./assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/green/80.png",
        "./assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/60.png",
        "./assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/blue/40.png",
        "./assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/20.png",
        "./assets/img/7_statusbars/1_statusbar/3_statusbar_bottle/orange/0.png",
    ];
    imagesCoinBar = [
        "./assets/img/7_statusbars/1_statusbar/1_statusbar_coin/green/100.png",
        "./assets/img/7_statusbars/1_statusbar/1_statusbar_coin/green/80.png",
        "./assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/60.png",
        "./assets/img/7_statusbars/1_statusbar/1_statusbar_coin/blue/40.png",
        "./assets/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/20.png",
        "./assets/img/7_statusbars/1_statusbar/1_statusbar_coin/orange/0.png",
    ];
    imagesEndbossHealthBar = [
        "./assets/img/7_statusbars/2_statusbar_endboss/green/green100.png",
        "./assets/img/7_statusbars/2_statusbar_endboss/green/green80.png",
        "./assets/img/7_statusbars/2_statusbar_endboss/blue/blue60.png",
        "./assets/img/7_statusbars/2_statusbar_endboss/blue/blue40.png",
        "./assets/img/7_statusbars/2_statusbar_endboss/orange/orange20.png",
        "./assets/img/7_statusbars/2_statusbar_endboss/orange/orange0.png",
    ];
    healthBarPercentage = 100;
    endbossHealthBarPercentage = 100;
    bottleBarPercentage = 0;
    coinBarPercentage = 0;

    constructor(type, canvasWidth){
        super();
        this.width = 200;
        this.height = 60;
        this.x = type === 'endboss' ? canvasWidth - this.width - 20 : 20;
        this.y = this.getYByType(type);
        this.images = this.getImagesByType(type);
        this.loadImages(this.images);
        this.initPercentageByType(type);
    }

    getYByType(type) {
        if (type == 'health') return 0;
        if (type == 'bottle') return 50;
        if (type == 'coins') return 100;
        if (type == 'endboss') return 0;
    }

    getImagesByType(type) {
        if (type == 'health') return this.imagesHealthBar;
        if (type == 'bottle') return this.imagesBootleBar;
        if (type == 'coins') return this.imagesCoinBar;
        if (type == 'endboss') return this.imagesEndbossHealthBar;
    }

    initPercentageByType(type) {
        if (type == 'health') this.setHealthBarPercentage(100);
        if (type == 'bottle') this.setBottleBarPercentage(0);
        if (type == 'coins') this.setCoinBarPercentage(0);
        if (type == 'endboss') this.setEndbossHealthBarPercentage(100);
    }

    
    mapHealthToIndex(healthPercentage) {
        // healthPercentage: 100, 95, 90, ..., 0
        let index = Math.floor(healthPercentage / 20);
        return index; // 100 -> 5, 80 -> 4, 60 -> 3, 40 -> 2, 20 -> 1, 0 -> 0
    }

    setHealthBarPercentage(percentage) {
        this.healthBarPercentage = this.mapHealthToIndex(percentage);
        let path = this.imagesHealthBar[this.resolveImageIndex(this.healthBarPercentage)];
        this.img = this.imageCache[path];
    }

    setBottleBarPercentage(percentage) {
        this.bottleBarPercentage = percentage;
        let path = this.imagesBootleBar[this.resolveImageIndex(percentage)];
        this.img = this.imageCache[path];
    }

    setCoinBarPercentage(percentage) {
        this.coinBarPercentage = percentage;
        let path = this.imagesCoinBar[this.resolveImageIndex(percentage)];
        this.img = this.imageCache[path];
    }

    setEndbossHealthBarPercentage(percentage) {
        this.endbossHealthBarPercentage = this.mapHealthToIndex(percentage);
        let path = this.imagesEndbossHealthBar[this.resolveImageIndex(this.endbossHealthBarPercentage)];
        this.img = this.imageCache[path];
    }

    resolveImageIndex(ObjectPercentage) {
    if (ObjectPercentage >= 5) {
            return 0;
        } else if (ObjectPercentage === 4) {
            return 1;
        } else if (ObjectPercentage === 3) {
            return 2;
        } else if (ObjectPercentage === 2) {
            return 3;
        } else if (ObjectPercentage === 1) {
            return 4;
        } else {
            return 5;
        }
    }
}