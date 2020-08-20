class Utils {

    static getRandom(max) {
        return this.getRandomMinMax(0, max - 1);
    }
    
    static getRandomMinMax(min, max) {
        return Math.floor(Math.random() * (max - min + 1) ) + min;
    }

}
