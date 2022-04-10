class SuffixTree{
    constructor(s){
        this.WIDTH = 1920;
        this.HEIGHT = 1080;
        this.s = s + "$";
        this.cur_str_len = 0;
        this.nodes = []
        this.tree_height = -1;

        this.currNode = -1;
        this.gamma = []

        this.ukkonen();
        this.update_label_length(0);
        this.update_tree_height();
        this.height_cnt = [];

        for (let i = 0; i < this.tree_height; i++){
            this.height_cnt.push(0);
        }

        this.set_node_positions(0, 0, 0, this.WIDTH);

        console.log(this.nodes);
    }
    
    draw(c, node){
        if (node >= this.nodes.length){
            return;
        }

        c.fillStyle = "black";
        let posA = this.nodes[node].pos;
        let num_of_children = Object.keys(this.nodes[node].children).length;
        let cnt =0;
        
        for (let child in this.nodes[node].children){
            let child_node = this.nodes[this.nodes[node].children[child]];
            let posB = child_node.pos;
            
            c.lineWidth = 5;
            c.beginPath();
            c.moveTo(posA.x, posA.y);
            c.lineTo(posB.x, posB.y);
            c.stroke();
            this.draw(c, this.nodes[node].children[child]);

            
            // add edge labels
            let chars_on_edge = child_node.parent_edge[1] - child_node.parent_edge[0] + 1;
            let vec = {
                "x" : (posB.x - posA.x)/(chars_on_edge+1),
                "y" : (posB.y - posA.y)/(chars_on_edge+1)
            }
            c.lineWidth = 2;
            c.font = "50px Arial";
            for (let i = 0; i < chars_on_edge; i++){
                c.fillStyle = "white";
                c.fillText(this.s[child_node.parent_edge[0]+i], posA.x + vec.x*(i+1)+(cnt == 0 ? -2.5 : 1)*10, posA.y + vec.y*(i+1));
                c.strokeText(this.s[child_node.parent_edge[0]+i], posA.x + vec.x*(i+1)+(cnt == 0 ? -2.5 : 1)*10, posA.y + vec.y*(i+1));
            }
            cnt++;
        }
        this.nodes[node].draw(c, node);
    }  

    set_node_positions(node, depth, xmin, xmax){
        this.nodes[node].pos.y = this.HEIGHT * (depth/this.tree_height) + this.HEIGHT/(this.tree_height*2);
        this.nodes[node].pos.x = (xmin + xmax)/2;
        this.height_cnt[depth]++;
        let total = Object.keys(this.nodes[node].children).length
        if (total == 0){
            return;
        }
        let i = 0;
        let slice_width = (xmax-xmin)/total;
        for (let child in this.nodes[node].children){
            this.set_node_positions(this.nodes[node].children[child], depth+1, xmin + i*slice_width, xmin + (i + 1)*slice_width);
            i++;
        }
    }

    update_tree_height(){
        this.tree_height = 0;
        this.update_tree_height_dfs(0, 1)
    }

    update_tree_height_dfs(node, depth){
        this.tree_height = Math.max(depth, this.tree_height);
        for (let key in this.nodes[node].children){
            this.update_tree_height_dfs(this.nodes[node].children[key], depth+1);
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
        this.nodes.push(new Node()); // root
        this.nodes.push(new Node());
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
    
                            this.nodes.push(new Node()); // create the new internal node
                            let internal = this.nodes.length - 1;
                            this.nodes[internal].parent = this.currNode;

                            if (internal == 8){
                                console.log([this.nodes[child].parent_edge[0], this.nodes[child].parent_edge[0] + gamma_length - 1])
                            }

                            this.nodes[internal].parent_edge = [this.nodes[child].parent_edge[0], this.nodes[child].parent_edge[0] + gamma_length - 1];
                            this.nodes[internal].label_length = this.nodes[this.currNode].label_length + gamma_length;
    
                            let internal_edge_length = this.nodes[internal].parent_edge[1] - this.nodes[child].parent_edge[0] + 1;
    
                            this.nodes.push(new Node()); // create the new leaf node
                            let leaf = this.nodes.length - 1;
                            this.nodes[leaf].parent = internal;
                            this.nodes[leaf].parent_edge = [this.gamma[0] + internal_edge_length, this.s.length-1];
                            this.nodes[leaf].label_length = this.nodes[internal].label_length + 1;
    
                            this.nodes[child].parent_edge[0] += internal_edge_length
                            // this.nodes[child].parent_edge[1] = Math.max(this.nodes[child].parent_edge[0], this.nodes[child].parent_edge[1]);
    
                            this.nodes[this.currNode].children[this.s[this.nodes[internal].parent_edge[0]]] = internal;
    
                            this.nodes[internal].children[this.s[this.nodes[child].parent_edge[0]]] = child
                            this.nodes[internal].children[this.s[this.nodes[leaf].parent_edge[0]]] = leaf
    
                            this.nodes[child].parent = internal;
    
                            if (j == 1 + suffix_link_iteration_set) {
                                this.nodes[suffix_link_start].suffix_link = internal;
                            }
    
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
                    this.nodes.push(new Node());
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
            // console.log(JSON.parse(JSON.stringify(this.nodes)));
        }
    }
}