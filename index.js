const TABLE = `
    ---
    |Q|  ----|
    ---    --|
    x1       |
             |
    ---      |   ---      ---
    |W| -------- |Z| ---- |H| --
    ---       |  ---      ---   |
    x2        |  x3       x4    |
              |                 |
    ---   ---/                  |
    |F| -/                      |
    ---   <---------------------|
    x5
`;

const createTable = (x1, x2, x3, x4, x5) => {
    let newtable = TABLE;
    newtable = newtable.replace("Q", x1 ? "■" : " ");
    newtable = newtable.replace("W", x2 ? "■" : " ");
    newtable = newtable.replace("Z", x3 ? "■" : " ");
    newtable = newtable.replace("H", x4 ? "■" : " ");
    newtable = newtable.replace("F", x5 ? "■" : " ");
    return newtable
}

class Timescale {
    t = 0;
    neurons = [];
    constructor(handler, timeInterval = 500) {
        setInterval(() => {
            this.t++;
            this.neurons.forEach(neuron => neuron.timeHandler());
            handler()
            this.neurons.forEach(neuron => neuron.update());
        }, timeInterval)
    }
    register(handler) {
        this.neurons.push(handler)
    }
}
class Neuron {
    inputs = []
    threshold;
    time;
    next_status;
    output = 0;

    constructor(inputs, threshold, time, output = undefined) {
        this.inputs = inputs;
        this.threshold = threshold;
        this.time = time;
        this.time.register(this);
        this.output = output;
    }

    timeHandler() {
        let inputs = this.inputs.map(neuron => neuron.output);
        let prev_neurons_fired = inputs.filter(output => output == 1).length;
        this.next_status = prev_neurons_fired >= this.threshold ? 1 : 0
    }
    update() {
        this.output = this.next_status;
    }
}

class InputNeuron  {
    output;
    constructor(value) {
        this.output = value;
    }
}
const x1 = new InputNeuron(0);
const x2 = new InputNeuron(1);

const time = new Timescale(() => {
    console.log("Time : ", time.t)
    console.log(createTable(x1.output, x2.output, x3.output, x4.output, x5.output))
});

const x5 = new Neuron([x1], 1, time, 1)
const x3 = new Neuron([x1, x2, x5], 2, time)
const x4 = new Neuron([x3], 1, time)
x5.inputs.push(x4);

class Layer {
    neurons = [];
    constructor(neurons, time) {
        for (let i = 0; i < neurons.length; i++) {
            let neuron = new Neuron([], 1, time)
            this.neurons.push(neuron);
            
            
        }
    }
}
