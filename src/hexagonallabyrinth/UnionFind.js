// The union find data structure keeps track of disjoint sets, this is used in kruskal randomized algorithm for maze generation

// implementaion based on Fredrik Anfinsen's "Algoritmer og datastrukturer for Norsk Informatikk Olympiade (NIO)"
class UnionFind{
    constructor(n){ // numbers of elements, all initially disjoint
        this.p = [] // parent
        this.numSets = n; // number of sets
        
        for(let i = 0; i < n; i++){
            this.p[i] = i; // everyone is their own parent to begin with
        }
    }
    
    findSet(i){ // the unique thing identifying a set is its top parent, that is the only node being its own parent
        return this.p[i] == i ? i : this.findSet(this.p[i]);    
    }

    isSameSet(i, j){ // true if the two elements belong to the same set
        return this.findSet(i) == this.findSet(j);
    }

    unify(i, j){ // unify two sets
        this.numSets--;

        let a = this.findSet(i), b = this.findSet(j);

        this.p[a] = b;
    }
}