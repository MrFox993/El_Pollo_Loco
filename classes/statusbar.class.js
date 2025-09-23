class StatusBar extends DrawableObject {
    imagesHealthBar = [
        "./assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/100.png",
        "./assets/img/7_statusbars/1_statusbar/2_statusbar_health/green/80.png",
        "./assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/60.png",
        "./assets/img/7_statusbars/1_statusbar/2_statusbar_health/blue/40.png",
        "./assets/img/7_statusbars/1_statusbar/2_statusbar_health/orange/20.png",
        "./assets/img/7_statusbars/1_statusbar/2_statusbar_health/orange/0.png",
    ]
    healthBarPercentage = 100;

    constructor(){
        super();
        this.x = 20;
        this.y = 0;
        this.width = 200;
        this.height = 60;
        this.loadImages(this.imagesHealthBar);
        this.setHealthBarPercentage(100);
    }

    setHealthBarPercentage(percentage) {
        this.healthBarPercentage = percentage;
        let path = this.imagesHealthBar[this.resolveImageIndex(percentage)];
        this.img = this.imageCache[path];
    }

    resolveImageIndex(ObjectPercentage) {
        if (ObjectPercentage == 100) {
            return 0;
        } else if (ObjectPercentage >= 80) {
            return 1;
        } else if (ObjectPercentage >= 60) {
            return 2;
        } else if (ObjectPercentage >= 40) {
            return 3;
        } else if (ObjectPercentage >= 20) {
            return 4;
        } else {
            return 5;
        }
    }
}