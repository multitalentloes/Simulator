// Constants
const NDIRS = 4;
const PREV = {
    UP: 0,
    RIGHT: 1,
    DOWN: 2,
    LEFT: 3
};
const NSTATES = 3;
const STATE = {
    STANDING: 0,
    LYING_UP: 1,
    LYING_LEFT: 2
};
const INF = 1e9;

function makeIDX(a, b, B, c, C, d, D) {
    return a * B * C * D + b * C * D + c * D + d;
}

class TIndex {
    constructor(y, x, s, p) {
        this.y = y;
        this.x = x;
        this.s = s;
        this.p = p;
    }
}

function getTIndex(idx, B, C, D) {
    const y = Math.floor(idx / (B * C * D));
    idx %= (B * C * D);
    const x = Math.floor(idx / (C * D));
    idx %= (C * D);
    const s = Math.floor(idx / D);
    idx %= D;
    const p = idx;
    return new TIndex(y, x, s, p);
}

class Grid {
    constructor() {
        this.WIDTH = 1920;
        this.HEIGHT = 1080;

        this.gridHeight = 15;
        this.gridWidth = 20;

        this.start = { first: 0, second: 0 };
        // this.end = {
        //     first: Math.max(0, this.gridHeight - 1 - Math.floor(Math.random() * 3)),
        //     second: Math.max(0, this.gridWidth - 1 - Math.floor(Math.random() * 3))
        // };
        this.end = { first: 12, second: 18 };

        this.timestep = 0; // used to determine which boxes to show in animation
        this.solved = false;

        this.grid = [];
        this.dist = [];
        for (let i = 0; i < this.gridHeight * this.gridWidth * NDIRS * NSTATES; i++) {
            this.dist.push(INF);
        }

        this.solution_path = [];

        // create the graph
        this.g = [];
        for (let i = 0; i < this.gridHeight; i++) {
            this.g.push([]);
            for (let j = 0; j < this.gridWidth; j++) {
                this.g[i].push([]);
                for (let k = 0; k < NSTATES; k++) {
                    this.g[i][j].push([]);
                    for (let l = 0; l < NDIRS; l++) {
                        this.g[i][j][k].push([]);
                    }
                }
            }
        }

        // previous cell in graph search
        this.p = [];
        for (let i = 0; i < this.gridHeight; i++) {
            this.p.push([]);
            for (let j = 0; j < this.gridWidth; j++) {
                this.p[i].push([]);
                for (let k = 0; k < NSTATES; k++) {
                    this.p[i][j].push([]);
                    for (let l = 0; l < NDIRS; l++) {
                        this.p[i][j][k].push(-1);
                    }
                }
            }
        }

        this.cellWidth = 60;

        for (let i = 0; i < this.gridHeight; i++) {
            this.grid.push([]);
            for (let j = 0; j < this.gridWidth; j++) {
                this.grid[i].push(new Cell(50 + j * this.cellWidth, 50 + i * this.cellWidth, this.cellWidth));
            }
        }

        this.grid[this.start.first][this.start.second].is_end_or_start = true;
        this.grid[this.end.first][this.end.second].is_end_or_start = true;

        this.generate_solvable_grid(0.1);
        this.solved = true;

        this.animation = this.placeholder();
    }

    generate_solvable_grid(threshold) {
        console.log("Generating solvable grid");
        let cnt = 0;
        let blocked_circles = 5;

        for (let n_circles = 0; n_circles <= blocked_circles; n_circles++) {
            cnt++;
            console.log("Starting attempt " + cnt);
            if (cnt % 5 == 0) {
                console.log("reducing blocked circles");
                blocked_circles--;
            }

            for (let attempts = 0; attempts < 1; attempts++) {
                this.resetSolveState();
                let centerX, centerY, radius;
                console.log("Starting local attempt " + cnt);
                for (let circle = 0; circle < blocked_circles; circle++) {
                    while (true) {
                        centerX = Math.floor(Math.random() * this.gridWidth);
                        centerY = Math.floor(Math.random() * this.gridHeight);
                        radius = Math.floor(Math.random() * 4) + 2;

                        const will_block_start_x = (centerX - radius <= this.start.second && centerX + radius >= this.start.second)
                        const will_block_start_y = (centerY - radius <= this.start.first && centerY + radius >= this.start.first)
                        const will_block_end_x = (centerX - radius <= this.end.second && centerX + radius >= this.end.second)
                        const will_block_end_y = (centerY - radius <= this.end.first && centerY + radius >= this.end.first)

                        if (!will_block_start_x && !will_block_start_y && !will_block_end_x && !will_block_end_y) {
                            break;
                        }
                    }

                    for (let i = 0; i < this.gridHeight; i++) {
                        for (let j = 0; j < this.gridWidth; j++) {
                            const distance = Math.sqrt((i - centerY) ** 2 + (j - centerX) ** 2);
                            if (distance <= radius) {
                                this.grid[i][j].state = 'B'; // Mark as blocked
                            }
                        }
                    }
                }

                // Check if the grid is solvable
                if (this.solve()) {
                    return;
                } else {
                    // If not solvable, reset the grid and try again
                    for (let i = 0; i < this.gridHeight; i++) {
                        for (let j = 0; j < this.gridWidth; j++) {
                            this.grid[i][j].state = '.'; // Reset to empty
                        }
                    }
                }
            }
        }

        for (let i = 0; i < this.gridHeight; i++) {
            for (let j = 0; j < this.gridWidth; j++) {
                this.grid[i][j].state = '.'; // Free
            }
        }
        // If we reach here, we couldn't generate a solvable grid
        // Fallback to a default grid                    // If not solvable, reset the grid and try again
        console.log(this.solve());
        console.log(this.end);
    }

    * placeholder() {
        while (true) {
            yield;
        }
    }

    draw(c) {
        let mod_step = ((this.timestep % this.solution_path.length) + this.solution_path.length) % this.solution_path.length;

        if (!this.solved) {
            return;
        }

        for (let i = 0; i < Math.max(1, (this.solution_path.length - 6) / 6); i++) {
            let local_step = (mod_step + 6 * i) % this.solution_path.length;
            // apply effect of moving box to current solution step
            if (this.solution_path[local_step].length == 2) {
                this.grid[this.solution_path[local_step][0]][this.solution_path[local_step][1]].state = "O";
            } else {
                this.grid[this.solution_path[local_step][0]][this.solution_path[local_step][1]].state = "O";
                this.grid[this.solution_path[local_step][2]][this.solution_path[local_step][3]].state = "O";
            }
        }

        for (let row of this.grid) {
            for (let cell of row) {
                cell.draw(c);
            }
        }

        for (let i = 0; i < Math.max(1, Math.floor(this.solution_path.length - 6) / 6); i++) {
            let local_step = (mod_step + 6 * i) % this.solution_path.length;
            // undo effect of this box step
            if (this.solution_path[local_step].length == 2) {
                this.grid[this.solution_path[local_step][0]][this.solution_path[local_step][1]].state = "P";
            } else {
                this.grid[this.solution_path[local_step][0]][this.solution_path[local_step][1]].state = "P";
                this.grid[this.solution_path[local_step][2]][this.solution_path[local_step][3]].state = "P";
            }
        }

        this.timestep--;
    }

    compute_path(p, idx, B, C, D) {

        let idxs = getTIndex(idx, B, C, D);
        while (true) {
            console.log
            if (idxs.s === STATE.STANDING) {
                console.assert(this.grid[idxs.y][idxs.x].state != "B");
                this.grid[idxs.y][idxs.x].state = "P";
                this.solution_path.push([idxs.y, idxs.x]);
            } else if (idxs.s === STATE.LYING_LEFT) {
                console.assert(this.grid[idxs.y][idxs.x].state != "B");
                console.assert(this.grid[idxs.y][idxs.x - 1].state != "B");
                this.grid[idxs.y][idxs.x].state = "P";
                this.grid[idxs.y][idxs.x - 1].state = "P";
                this.solution_path.push([idxs.y, idxs.x, idxs.y, idxs.x - 1]);
            } else if (idxs.s === STATE.LYING_UP) {
                console.assert(this.grid[idxs.y][idxs.x].state != "B");
                console.assert(this.grid[idxs.y - 1][idxs.x].state != "B");
                this.grid[idxs.y][idxs.x].state = "P";
                this.grid[idxs.y - 1][idxs.x].state = "P";
                this.solution_path.push([idxs.y, idxs.x, idxs.y - 1, idxs.x]);
            }
            const prevIdx = p[idxs.y][idxs.x][idxs.s][idxs.p];
            if (prevIdx === -1) break;
            idxs = getTIndex(prevIdx, B, C, D);
        }
    }

    solve() {
        let end = this.end;
        let start = this.start;

        for (let i = 0; i < this.gridHeight; i++) {
            for (let j = 0; j < this.gridWidth; j++) {
                let c = this.grid[i][j].state;
                if (c !== 'B') {
                    const oneabove = i && this.grid[i - 1][j].state !== 'B';
                    const twoabove = oneabove && i > 1 && this.grid[i - 2][j].state !== 'B';
                    const oneleft = j && this.grid[i][j - 1].state !== 'B';
                    const upleft = oneabove && oneleft && this.grid[i - 1][j - 1].state !== 'B';
                    const twoleft = oneleft && j > 1 && this.grid[i][j - 2].state !== 'B';

                    if (oneabove) {
                        if (upleft) {
                            this.g[i - 1][j][STATE.LYING_LEFT][PREV.LEFT].push([2, makeIDX(i, j, this.gridWidth, STATE.LYING_LEFT, NSTATES, PREV.UP, NDIRS)]);
                            this.g[i - 1][j][STATE.LYING_LEFT][PREV.RIGHT].push([2, makeIDX(i, j, this.gridWidth, STATE.LYING_LEFT, NSTATES, PREV.UP, NDIRS)]);
                            this.g[i - 1][j][STATE.LYING_LEFT][PREV.DOWN].push([2, makeIDX(i, j, this.gridWidth, STATE.LYING_LEFT, NSTATES, PREV.UP, NDIRS)]);
                            this.g[i][j][STATE.LYING_LEFT][PREV.LEFT].push([2, makeIDX(i - 1, j, this.gridWidth, STATE.LYING_LEFT, NSTATES, PREV.DOWN, NDIRS)]);
                            this.g[i][j][STATE.LYING_LEFT][PREV.RIGHT].push([2, makeIDX(i - 1, j, this.gridWidth, STATE.LYING_LEFT, NSTATES, PREV.DOWN, NDIRS)]);
                            this.g[i][j][STATE.LYING_LEFT][PREV.UP].push([2, makeIDX(i - 1, j, this.gridWidth, STATE.LYING_LEFT, NSTATES, PREV.DOWN, NDIRS)]);
                        }
                        if (twoabove) {
                            this.g[i - 1][j][STATE.LYING_UP][PREV.LEFT].push([3, makeIDX(i, j, this.gridWidth, STATE.STANDING, NSTATES, PREV.UP, NDIRS)]);
                            this.g[i - 1][j][STATE.LYING_UP][PREV.RIGHT].push([3, makeIDX(i, j, this.gridWidth, STATE.STANDING, NSTATES, PREV.UP, NDIRS)]);
                            this.g[i - 1][j][STATE.LYING_UP][PREV.DOWN].push([3, makeIDX(i, j, this.gridWidth, STATE.STANDING, NSTATES, PREV.UP, NDIRS)]);
                            this.g[i][j][STATE.STANDING][PREV.LEFT].push([1, makeIDX(i - 1, j, this.gridWidth, STATE.LYING_UP, NSTATES, PREV.DOWN, NDIRS)]);
                            this.g[i][j][STATE.STANDING][PREV.RIGHT].push([1, makeIDX(i - 1, j, this.gridWidth, STATE.LYING_UP, NSTATES, PREV.DOWN, NDIRS)]);
                            this.g[i][j][STATE.STANDING][PREV.UP].push([1, makeIDX(i - 1, j, this.gridWidth, STATE.LYING_UP, NSTATES, PREV.DOWN, NDIRS)]);

                            this.g[i - 2][j][STATE.STANDING][PREV.LEFT].push([1, makeIDX(i, j, this.gridWidth, STATE.LYING_UP, NSTATES, PREV.UP, NDIRS)]);
                            this.g[i - 2][j][STATE.STANDING][PREV.RIGHT].push([1, makeIDX(i, j, this.gridWidth, STATE.LYING_UP, NSTATES, PREV.UP, NDIRS)]);
                            this.g[i - 2][j][STATE.STANDING][PREV.DOWN].push([1, makeIDX(i, j, this.gridWidth, STATE.LYING_UP, NSTATES, PREV.UP, NDIRS)]);
                            this.g[i][j][STATE.LYING_UP][PREV.LEFT].push([3, makeIDX(i - 2, j, this.gridWidth, STATE.STANDING, NSTATES, PREV.DOWN, NDIRS)]);
                            this.g[i][j][STATE.LYING_UP][PREV.RIGHT].push([3, makeIDX(i - 2, j, this.gridWidth, STATE.STANDING, NSTATES, PREV.DOWN, NDIRS)]);
                            this.g[i][j][STATE.LYING_UP][PREV.UP].push([3, makeIDX(i - 2, j, this.gridWidth, STATE.STANDING, NSTATES, PREV.DOWN, NDIRS)]);
                        }
                    }
                    if (oneleft) {
                        if (upleft) {
                            this.g[i][j - 1][STATE.LYING_UP][PREV.DOWN].push([2, makeIDX(i, j, this.gridWidth, STATE.LYING_UP, NSTATES, PREV.LEFT, NDIRS)]);
                            this.g[i][j - 1][STATE.LYING_UP][PREV.RIGHT].push([2, makeIDX(i, j, this.gridWidth, STATE.LYING_UP, NSTATES, PREV.LEFT, NDIRS)]);
                            this.g[i][j - 1][STATE.LYING_UP][PREV.UP].push([2, makeIDX(i, j, this.gridWidth, STATE.LYING_UP, NSTATES, PREV.LEFT, NDIRS)]);
                            this.g[i][j][STATE.LYING_UP][PREV.UP].push([2, makeIDX(i, j - 1, this.gridWidth, STATE.LYING_UP, NSTATES, PREV.RIGHT, NDIRS)]);
                            this.g[i][j][STATE.LYING_UP][PREV.LEFT].push([2, makeIDX(i, j - 1, this.gridWidth, STATE.LYING_UP, NSTATES, PREV.RIGHT, NDIRS)]);
                            this.g[i][j][STATE.LYING_UP][PREV.DOWN].push([2, makeIDX(i, j - 1, this.gridWidth, STATE.LYING_UP, NSTATES, PREV.RIGHT, NDIRS)]);
                        }
                        if (twoleft) {
                            this.g[i][j - 1][STATE.LYING_LEFT][PREV.DOWN].push([3, makeIDX(i, j, this.gridWidth, STATE.STANDING, NSTATES, PREV.LEFT, NDIRS)]);
                            this.g[i][j - 1][STATE.LYING_LEFT][PREV.RIGHT].push([3, makeIDX(i, j, this.gridWidth, STATE.STANDING, NSTATES, PREV.LEFT, NDIRS)]);
                            this.g[i][j - 1][STATE.LYING_LEFT][PREV.UP].push([3, makeIDX(i, j, this.gridWidth, STATE.STANDING, NSTATES, PREV.LEFT, NDIRS)]);
                            this.g[i][j][STATE.STANDING][PREV.LEFT].push([1, makeIDX(i, j - 1, this.gridWidth, STATE.LYING_LEFT, NSTATES, PREV.RIGHT, NDIRS)]);
                            this.g[i][j][STATE.STANDING][PREV.UP].push([1, makeIDX(i, j - 1, this.gridWidth, STATE.LYING_LEFT, NSTATES, PREV.RIGHT, NDIRS)]);
                            this.g[i][j][STATE.STANDING][PREV.DOWN].push([1, makeIDX(i, j - 1, this.gridWidth, STATE.LYING_LEFT, NSTATES, PREV.RIGHT, NDIRS)]);

                            this.g[i][j - 2][STATE.STANDING][PREV.DOWN].push([1, makeIDX(i, j, this.gridWidth, STATE.LYING_LEFT, NSTATES, PREV.LEFT, NDIRS)]);
                            this.g[i][j - 2][STATE.STANDING][PREV.RIGHT].push([1, makeIDX(i, j, this.gridWidth, STATE.LYING_LEFT, NSTATES, PREV.LEFT, NDIRS)]);
                            this.g[i][j - 2][STATE.STANDING][PREV.UP].push([1, makeIDX(i, j, this.gridWidth, STATE.LYING_LEFT, NSTATES, PREV.LEFT, NDIRS)]);
                            this.g[i][j][STATE.LYING_LEFT][PREV.LEFT].push([3, makeIDX(i, j - 2, this.gridWidth, STATE.STANDING, NSTATES, PREV.RIGHT, NDIRS)]);
                            this.g[i][j][STATE.LYING_LEFT][PREV.UP].push([3, makeIDX(i, j - 2, this.gridWidth, STATE.STANDING, NSTATES, PREV.RIGHT, NDIRS)]);
                            this.g[i][j][STATE.LYING_LEFT][PREV.DOWN].push([3, makeIDX(i, j - 2, this.gridWidth, STATE.STANDING, NSTATES, PREV.RIGHT, NDIRS)]);
                        }
                    }
                }
            }
        }

        const pq = [];
        const start1FlatIdx = makeIDX(start.first, start.second, this.gridWidth, STATE.STANDING, NSTATES, PREV.LEFT, NDIRS);
        const start2FlatIdx = makeIDX(start.first, start.second, this.gridWidth, STATE.STANDING, NSTATES, PREV.DOWN, NDIRS);
        pq.push([0, start1FlatIdx]);
        pq.push([0, start2FlatIdx]);
        this.dist[start1FlatIdx] = 0;
        this.dist[start2FlatIdx] = 0;

        while (pq.length > 0) {
            const [weight_u, u] = pq.pop();

            const u_idx = getTIndex(u, this.gridWidth, NSTATES, NDIRS);
            // console.log(u, this.gridWidth, NSTATES, NDIRS, u_idx);

            for (const neighbor of this.g[u_idx.y][u_idx.x][u_idx.s][u_idx.p]) {
                const [weight_uv, v] = neighbor;

                if (this.dist[u] + weight_uv < this.dist[v]) {
                    this.dist[v] = this.dist[u] + weight_uv;
                    pq.push([-this.dist[v], v]);

                    // we know that only last element might be out of order
                    // a single pass through the list is efficient enough
                    for (let i = pq.length - 1; i > 0; i--) {
                        if (pq[i][0] < pq[i - 1][0]) {
                            [pq[i], pq[i - 1]] = [pq[i - 1], pq[i]];
                        } else {
                            break;
                        }
                    }

                    const v_idx = getTIndex(v, this.gridWidth, NSTATES, NDIRS);
                    this.p[v_idx.y][v_idx.x][v_idx.s][v_idx.p] = u;
                }
            }
        }

        const endLeft = makeIDX(end.first, end.second, this.gridWidth, STATE.STANDING, NSTATES, PREV.LEFT, NDIRS);
        const endRight = makeIDX(end.first, end.second, this.gridWidth, STATE.STANDING, NSTATES, PREV.RIGHT, NDIRS);
        const endUp = makeIDX(end.first, end.second, this.gridWidth, STATE.STANDING, NSTATES, PREV.UP, NDIRS);
        const endDown = makeIDX(end.first, end.second, this.gridWidth, STATE.STANDING, NSTATES, PREV.DOWN, NDIRS);
        const best = Math.min(this.dist[endLeft], this.dist[endRight], this.dist[endUp], this.dist[endDown]);
        console.log(this.dist[endLeft], this.dist[endRight], this.dist[endUp], this.dist[endDown]);
        if (best == INF) {
            return false;
        }

        if (this.dist[endLeft] == best) {
            this.compute_path(this.p, endLeft, this.gridWidth, NSTATES, NDIRS);
        }
        else if (this.dist[endRight] == best) {
            this.compute_path(this.p, endRight, this.gridWidth, NSTATES, NDIRS);
        }
        else if (this.dist[endUp] == best) {
            this.compute_path(this.p, endUp, this.gridWidth, NSTATES, NDIRS);
        }
        else if (this.dist[endDown] == best) {
            this.compute_path(this.p, endDown, this.gridWidth, NSTATES, NDIRS);
        }

        return true;
    }

    resetSolveState() {
        for (let i = 0; i < this.dist.length; i++) {
            this.dist[i] = INF;
        }

        this.solution_path = [];

        for (let i = 0; i < this.gridHeight; i++) {
            for (let j = 0; j < this.gridWidth; j++) {
                for (let k = 0; k < NSTATES; k++) {
                    for (let l = 0; l < NDIRS; l++) {
                        this.p[i][j][k][l] = -1;
                    }
                }
            }
        }

        for (let i = 0; i < this.gridHeight; i++) {
            for (let j = 0; j < this.gridWidth; j++) {
                for (let k = 0; k < NSTATES; k++) {
                    for (let l = 0; l < NDIRS; l++) {
                        this.g[i][j][k][l] = [];
                    }
                }
            }
        }
    }
}
