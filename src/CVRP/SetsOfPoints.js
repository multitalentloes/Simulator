/*
    This class will keep track of all the nodes for the travelling salesman to visit
    Each node will point to one other node, the hillcliming will then swap two random
    edges if they improve the total distance at all. 
*/

class SetsOfPoints{
    constructor(num_of_sets, set_size, HEIGHT, WIDTH){
        this.draw = this.draw.bind(this);
        this.generatePoints = this.generateTrips.bind(this);
        this.num_of_sets = num_of_sets;
        this.set_size = set_size;
        this.trips = null;
        this.colors = ["#FF0000", "#00FF00", "#0000FF", "#00FFFF", "#FF00FF"];

        this.mid_point = new Point(WIDTH/2, HEIGHT/2, 30, "square");

        this.generateTrips(HEIGHT, WIDTH);
        this.local_minima_reached = false;
    }

    draw(c){
        for (let k = 0; k < this.trips.length; k++){
            let trip = this.trips[k];

            for (let i = 0; i < trip.length; i++){
                let from_node = trip[i];
                let to_node = trip[(i+1)%trip.length];
                from_node.drawEdge(c, to_node, this.colors[k]);
            }
        }
        
        for (let trip of this.trips){
            for (let p of trip){
                p.draw(c);
            }
        }
    }

    climb(){  // steepest ascent hill climb
        // if we have reached the local minima we just skip the climbing altogether
        let best_diff = 0;
        let best_truck_a = -1;
        let best_truck_b = -1;
        let best_a_2 = -1;
        let best_b_2 = -1;
        let move_type = "none";

        // intra relocate
        for (let truck = 0; truck < this.num_of_sets; truck++){
            for (let idx_a = 0; idx_a < this.set_size; idx_a++){
                for (let idx_b = idx_a + 2; idx_b < this.set_size; idx_b++){
                    
                    let a_1 = this.trips[truck][idx_a];
                    let a_2 = this.trips[truck][(idx_a+1)%this.set_size];
                    let a_3 = this.trips[truck][(idx_a+2)%this.set_size];
                    let b_1 = this.trips[truck][idx_b];
                    let b_2 = this.trips[truck][(idx_b+1)%this.set_size];
    
                    let removed = a_1.dist(a_2) + a_2.dist(a_3) + b_1.dist(b_2);
    
                    let added = a_2.dist(b_1) + a_2.dist(b_2) + a_1.dist(a_3);
    
                    if (removed - added > best_diff && min_array_dist(idx_b, idx_a, this.set_size) > 2){
                        best_truck_a = truck;
                        best_truck_b = truck;
                        best_diff = removed - added;
                        best_a_2 = (idx_a+1)%this.set_size;
                        best_b_2 = (idx_b+1)%this.set_size;
                        move_type = "intra_relocate";

                    }
                }
            }
        }

        // intra relocate
        for (let truck = 0; truck < this.num_of_sets; truck++){
            for (let idx_a = 0; idx_a < this.set_size; idx_a++){
                for (let idx_b = idx_a + 2; idx_b < this.set_size; idx_b++){
                    
                    let a_1 = this.trips[truck][idx_a];
                    let a_2 = this.trips[truck][(idx_a+1)%this.set_size];
                    let a_3 = this.trips[truck][(idx_a+2)%this.set_size];
                    let b_1 = this.trips[truck][idx_b];
                    let b_2 = this.trips[truck][(idx_b+1)%this.set_size];
    
                    let old_dist = this.trip_distance(this.trips[truck]);
    
                    if (-100 > best_diff && min_array_dist(idx_b, idx_a, this.set_size) > 2){
                        best_truck_a = truck;
                        best_truck_b = truck;
                        best_diff = removed - added;
                        best_a_2 = (idx_a+1)%this.set_size;
                        best_b_2 = (idx_b+1)%this.set_size;
                        move_type = "intra_2_opt";

                    }
                }
            }
        }
        
        // inter exchange
        for (let truck_a = 0; truck_a < this.num_of_sets; truck_a++){
            for (let truck_b = truck_a + 1; truck_b < this.num_of_sets; truck_b++){
                for (let idx_a = 1; idx_a < this.set_size; idx_a++){
                    for (let idx_b = idx_a + 1; idx_b < this.set_size; idx_b++){

                        if ((idx_a+1)%this.set_size == 0 || (idx_b+1)%this.set_size == 0) continue; // dont move the start node

                        let a_1 = this.trips[truck_a][idx_a];
                        let a_2 = this.trips[truck_a][(idx_a+1)%this.set_size];
                        let a_3 = this.trips[truck_a][(idx_a+2)%this.set_size];
                        let b_1 = this.trips[truck_b][idx_b];
                        let b_2 = this.trips[truck_b][(idx_b+1)%this.set_size];
                        let b_3 = this.trips[truck_b][(idx_b+2)%this.set_size];
                        
                        let removed = a_1.dist(a_2) + a_2.dist(a_3) + b_1.dist(b_2) + b_2.dist(b_3);
                        
                        let added = b_1.dist(a_2) + a_2.dist(b_3) + a_1.dist(b_2) + b_2.dist(a_3);
                        
                        if (removed - added > best_diff){ // swap places
                            best_truck_a = truck_a;
                            best_truck_b = truck_b;
                            best_diff = removed - added;
                            best_a_2 = (idx_a+1)%this.set_size;
                            best_b_2 = (idx_b+1)%this.set_size;
                            move_type = "inter_exchange"
                        }
                    }
                }
            }
        }

        if (move_type == "none") {
            return;
        }

        let prev = this.total_dist();
        
        if (move_type == "intra_relocate"){
            this.trips[best_truck_a].move(best_a_2, best_b_2); // move item from a_2 to b_2
        }
        if (move_type == "inter_exchange"){ // swap a_2 and b_2
            let a_2 = this.trips[best_truck_a][best_a_2];
            let b_2 = this.trips[best_truck_b][best_b_2];
            this.trips[best_truck_b].splice(best_b_2, 0, a_2);
            this.trips[best_truck_a].splice(best_a_2, 0, b_2);
            this.trips[best_truck_b].splice(best_b_2+1, 1);
            this.trips[best_truck_a].splice(best_a_2+1, 1);
        }
        
        this.trips[best_truck_a] = this.rotateArray(this.trips[best_truck_a]);
        this.trips[best_truck_b] = this.rotateArray(this.trips[best_truck_b]);
        console.log(Math.floor(this.total_dist() - prev), Math.floor(this.total_dist()), Math.floor(best_diff), best_truck_a, best_truck_b, best_a_2, best_b_2, move_type);
    }
    
    generateTrips(HEIGHT, WIDTH){ // generate n points randomely distributed in the canvas, but dont place them to close to another
        this.trips = [];
        for(let i = 0; i < this.num_of_sets; i++){
            this.trips.push([]);
            this.trips[i].push(this.mid_point);

            for (let k = 0; k < this.set_size - 1; k++){
                let p;
                do {
                    let x = Math.floor(Math.random()*(WIDTH-100) + 50);
                    let y = Math.floor(Math.random()*(HEIGHT-100) + 50);
                    p = new Point(x, y, 13);
                } while (this.trips[i].some((e) => p.dist(e) <= 50)); //generate new point unless not all points are far enough away 
                
                this.trips[i].push(p);
            }
        }
    }

    rotateArray(array){
        // console.log(array);
        for (let i = 0; i < array.length; i++){
            if (array[i].equals(this.mid_point)){
                for (let k = 0; k < i; k++){
                    array.push(array.shift());
                }
                break;
            }
        }
        return array;
    }

    total_dist(){
        let ans = 0;
        for (let trip of this.trips){
            ans += this.trip_distance(trip);
        }
        return ans;
    }

    trip_distance(arr){
        let ans = 0;
        for (let i = 0; i < arr.length; i++){
            ans =+ arr[i].dist(arr[(i+1)%arr.length]);
        }
        return ans;
    }
}


function min_array_dist(idxa, idxb, list_size){
    return Math.min(Math.abs(idxa-idxb), list_size-Math.abs(idxa-idxb));
}

//https://stackoverflow.com/questions/5306680/move-an-array-element-from-one-array-position-to-another
Array.prototype.move = function(from, to) {
    this.splice(to, 0, this.splice(from, 1)[0]);
    return this;
};