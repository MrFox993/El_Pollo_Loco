class Cloud extends MovableObject {
    y = 10 
    width = 500;
    height = 300;
    
    constructor() {
        super();
        this.loadImage('../assets/img/5_background/layers/4_clouds/1.png');
        this.x = Math.random() * 700; // Random x position
        this.animate();
    }

    animate() {
        setInterval(() => {
            this.x -= 0.15;
        }, 1000 / 60);
        
    }
}