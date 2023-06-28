const PARAMETERS = {

}

class Enzyme {
    /* enz_id : Enzyme identifier
     * Triggers certain reactions, (Array with reaction identifiers)
     * inhibitors : Molecule identifiers that can inhibit the enzyme
     * activators : Molecule identifiers that can activate the enzyme
     * change_factor : How much the enzyme slows down or speeds up a reaction
     * default_active : If the enzyme is active by default or if it needs to wait for activators
     */
    constructor(enz_id, reactions, inhibitors, activators, change_factor, default_active = !activators) {

    }
}

class Molecule {
    /* bio_id : BIOMOLECULE IDENTIFIERS
     * data : Data contained inside the molecule
     */
    constructor(bio_id, data) {
        this.data = data
        this.bio_id = bio_id
    }

}


class Reaction {
    /* react_id : REACTION IDENTIFIERS
     * accept : Molecule identifiers that are accepted (Array)
     * out : Data is wrapped in this type of molecule
     * fun : The function that is executed with the data
     * ticks : The amount of ticks it takes to complete the reaction
     */
    constructor(react_id, accept, fun, ticks) {
        this.fun = fun
        this.react_id = react_id
        this.accept = accept
        this.ticks = ticks
    }
    trigger(molecule) {
        let [bio_id, data] = this.fun(molecule.data)
        console.log("Bio ID : ", bio_id)
        return new Molecule(bio_id, data)
    }
}

class System {
    /* reactions : Array object with all possible reactions 
     * plasma : The Plasma object
     * tick_ms : The amount of time in milliseconds it takes for one tick
     */
    constructor(reactions, tick_ms) {
        this.reactions = reactions
        this.tick = 0
        this.tick_ms = tick_ms
        this.molecules = []
        this.tick_queue = []
    }
    start_sim() {
        setInterval(() => {
            this.print_tick()
            this.clear_tick_queue()
            this.execute_reactions()
            this.tick++
        }, this.tick_ms)
    }
    print_tick() {
        console.log(`TICK ${this.tick} \n-----------`)
        for (let i = 0; i < this.molecules.length; i++) {
            const molecule = this.molecules[i];
            console.log(` - (${molecule.bio_id}) ${JSON.stringify(molecule.data)}`)
        }
    }
    execute_reactions() {
        for (let i = 0; i < this.reactions.length; i++) {
            const reaction = this.reactions[i];
            const delete_queue = []
            for (let j = 0; j < this.molecules.length; j++) {
                console.log(this.molecules)
                let mol = this.molecules[j]
                if(reaction.accept.includes(mol.bio_id)) {
                    const new_molecule = reaction.trigger(mol);
                    console.log(new_molecule)
                    delete_queue.push(j)
                    this.tick_queue.push({
                        ticks: reaction.ticks,
                        fun: () => {this.molecules.push(new_molecule)}
                    });
                };
            };
            console.log(this.molecules)
            delete_queue.forEach(k => this.molecules.splice(k, 1))
        };
    };
    clear_tick_queue() {
        this.tick_queue.forEach(tick_queue_item => {
            tick_queue_item.ticks--;
            if(tick_queue_item.ticks == 0) {
                tick_queue_item.fun()
            }
        });
    };
};

let reaction1 = new Reaction("ADD", "ADD", (data) => {
    return ["RES", (data.a + data.b)];
}, 3);

let reaction2 = new Reaction("EXP", "RES", (data) => {
    return ["ADD", {a: data * 2,b: data}];
}, 1);

let my_system = new System([reaction1, reaction2], 100);

for (let i = 0; i < 1; i++) {
    my_system.molecules.push(new Molecule("ADD", {a: 2, b: 3}));   
};


my_system.start_sim();