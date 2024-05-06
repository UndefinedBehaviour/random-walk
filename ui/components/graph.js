class Graph extends HTMLElement {
    static observedAttributes = ["data"];

    dataStore = [0];

    constructor() {
        super();
    }

    async connectedCallback() {
        const button = document.createElement('button');
        const pause = () => {
            button.onclick = restart;

            clearTimeout(this.timeout);
            button.textContent = 'restart';
        };
        const restart = () => {
            button.onclick = pause;

            setTimeout(func);
            button.textContent = 'pause';
        };
        button.textContent = 'pause';
        button.onclick = pause;
        this.append(button);
        let i = 1;
        const func = () => {
            this.dataStore[i] = this.dataStore[i - 1] + (Math.round(Math.random()) * 2 - 1);
            if (i > this.width) this.dataStore.shift();
            else {i++};
            this.renderGraph();
            this.timeout = setTimeout(func, 1);
        };

        this.timeout = setTimeout(func, 1);
    }

    renderGraph() {
        const margin = {top: 10, right: 30, bottom: 30, left: 60};
        const height = 400 - margin.top - margin.bottom;

        d3.select(this).select("svg").remove();
        const svg = d3.select(this).append("svg").attr("width", "98%")
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        const data = this.dataStore;

        this.width = this.getBoundingClientRect().width - margin.left - margin.right;

        const x = d3.scaleLinear()
            .domain([0, this.width])
            .range([0, this.width]);

        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        const y = d3.scaleLinear()
            .domain([Math.min(d3.min(this.dataStore) * 1.1, -10), Math.max(d3.max(this.dataStore) * 1.1, 10)])
            .range([height, 0]);

        svg.append("g")
            .call(d3.axisLeft(y));

        let z = 0;
        svg.append("path")
            .datum(data)
            .attr("fill", "none")
            .attr("stroke", "steelblue")
            .attr("stroke-width", 1.5)
            .attr("d", d3.line()
                .x(function() { return x(z++) })
                .y(function(d) { return y(d) })
            );
    }
}

customElements.define("random-walk-graph", Graph);
