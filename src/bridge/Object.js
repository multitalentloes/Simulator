class Object{
    constructor(x, y, is_movable){

        this.pos = {
            "x" : x,
            "y" : y
        }

        this.v = {
            "x" : 0,
            "y" : 0
        }

        this.F  = {
            "x" : 0,
            "y" : 0
        }

        this.F_old = {
            "x" : 0,
            "y" : 0
        }

        this.is_movable = is_movable;
    }
}
