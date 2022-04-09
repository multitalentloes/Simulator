class SuffixTree{
    constructor(s){
        this.s = s + "$";
        this.cur_str_len = 0;
        this.nodes = []

        this.currNode = -1;
        this.gamma = []

        this.ukkonen();
        this.update_label_length(0);
        console.log(this.nodes);
    }
    
    draw(c, node){
        if (node >= this.nodes.length){
            return;
        }
        this.nodes[node].draw(c);
        for (let child in this.nodes[node].children){
            this.draw(c, this.nodes[node].children[child]);
        }
    }

    skip_count_traverse_along_gamma(node, gamma){
        let child = this.nodes[node].children[this.gamma[0]];
        if (!child) return;

        if (this.s[this.nodes[child].parent_edge[0]] == this.s[this.gamma[0]]){
            let edge_length = 1 + nodes[child].parent_edge[1] - nodes[child].parent_edge[0];

            if (edge_length <= this.gamma[1] - this.gamma[0]){
                this.currNode = child;
                this.gamma = [this.gamma[0] + edge_length, gamma[1]];
                this.skip_count_traverse_along_gamma(this.node, this.gamma);
                return;
            }
        }
        return;
    }

    update_label_length(node){
        if (this.nodes[node].children.length == 0){
            let parent = this.nodes[node].parent;
            let parent_edge_length = this.nodes[node].parent_edge[1] - this.nodes[node].parent_edge[0] + 1;
            this.nodes[node].label_length = this.nodes[parent].label_length + parent_edge_length;
            return;
        }
        for (let child in this.nodes[node].children){
            this.update_label_length(this.nodes[node].children[child]);
        }
    }

    ukkonen(){
        this.nodes.push(new Node(200, 300+this.nodes.length*50)); // root
        this.nodes.push(new Node(200, 300+this.nodes.length*50));
        this.nodes[1].parent = 0;
        this.nodes[1].label_length = 1;
        this.nodes[1].parent_edge = [0, this.s.length-1];
        this.nodes[0].children[this.s[0]] = 1;

        this.currNode = 0;
        
        let j_i = 1;
        let prev_extension_rule_used = -1;

        for (let phase = 2; phase < this.s.length + 1; phase++){
            this.cur_str_len++;

            let j = j_i;
            let suffix_link_start = -1;
            let suffix_link_iteration_set = -1;

            for (; j < phase; j++){
                this.gamma = [j+this.nodes[this.currNode].label_length, phase-1];
                let extension_rule_used = -1;

                if (prev_extension_rule_used != 3 && this.nodes[this.currNode].suffix_link != -1){
                    this.gamma[0] -= 1;
                    this.currNode = this.nodes[this.currNode].suffix_link;
                }

                this.skip_count_traverse_along_gamma(this.currNode, this.gamma);

                let child_it = this.nodes[this.currNode].children[this.s[this.gamma[0]]];

                if (child_it){
                    let child = child_it;    
                    let edge_char_matching_gamma_end = this.nodes[child].parent_edge[0] + this.gamma[1] - this.gamma[0];
                    
                    // console.log(this.nodes[child.parent_edge);
                    if (this.s[this.nodes[child].parent_edge[0]] == this.s[this.gamma[0]]){
                        if (this.s[edge_char_matching_gamma_end] != this.s[this.gamma[1]]){ //rule 2
                            // create new internal node and split edge
                            let gamma_length = this.gamma[1] - this.gamma[0];
    
                            this.nodes.push(new Node(200, 300+this.nodes.length*50)); // create the new internal node
                            let internal = this.nodes.length - 1;
                            this.nodes[internal].parent = this.currNode;
                            this.nodes[internal].parent_edge = [this.nodes[child].parent_edge[0], this.nodes[child].parent_edge[0] + gamma_length];
                            this.nodes[internal].label_length = this.nodes[this.currNode].label_length + gamma_length;
    
                            let internal_edge_length = this.nodes[internal].parent_edge[1] - this.nodes[child].parent_edge[0] + 1;
    
                            this.nodes.push(new Node(200, 300+this.nodes.length*50)); // create the new leaf node
                            let leaf = this.nodes.length - 1;
                            this.nodes[leaf].parent = internal;
                            this.nodes[leaf].parent_edge = [this.gamma[0] + internal_edge_length, this.s.length-1];
                            this.nodes[leaf].label_length = this.nodes[internal].label_length + 1;
    
                            this.nodes[child].parent_edge[0] += internal_edge_length
    
                            this.nodes[this.currNode].children[this.s[this.nodes[internal].parent_edge[0]]] = internal;
    
                            this.nodes[internal].children[this.s[this.nodes[child].parent_edge[0]]] = child
                            this.nodes[internal].children[this.s[this.nodes[leaf].parent_edge[0]]] = leaf
    
                            this.nodes[child].parent = internal;
    
                            if (j == 1 + suffix_link_iteration_set) {
                                this.nodes[suffix_link_start].suffix_link = internal;
                            }

                            console.log(JSON.parse(JSON.stringify(this.nodes[leaf])))
                            console.log(JSON.parse(JSON.stringify(this.nodes[internal])))
    
                            suffix_link_start = internal;
                            suffix_link_iteration_set = j;
                            extension_rule_used = 2;
                        }
                        else{ // rule 3
                            if (j == 1 + suffix_link_iteration_set){
                                this.nodes[suffix_link_start].suffix_link = this.currNode;
                            }
                            extension_rule_used = 3;
                        }
                    }
                }
                else{ // rule 2.5, add new leaf node, but no internal node
                    this.nodes.push(new Node(200, 300+this.nodes.length*50));
                    let nodeidx = this.nodes.length-1;
                    this.nodes[nodeidx].parent = this.currNode;
                    this.nodes[nodeidx].parent_edge = [this.cur_str_len, this.s.length-1];
                    this.nodes[this.currNode].children[this.s[this.gamma[0]]] = nodeidx;
                    extension_rule_used = 2;
                    if (j == 1 + suffix_link_iteration_set){
                        this.nodes[suffix_link_start].suffix_link = this.currNode;
                    }
                }
                prev_extension_rule_used = extension_rule_used;
                if (extension_rule_used == 3) break;
            }
            j_i = j;
            console.log(JSON.parse(JSON.stringify(this.nodes)));
        }
    }
}