class Graph extends HTMLElement {
    static observedAttributes = ["data"];

    data = [0];

    constructor() {
        super();
    }

    async connectedCallback() {
        const margin = {top: 10, right: 30, bottom: 30, left: 60};
        const height = 400 - margin.top - margin.bottom;

        const svg = d3.select(this).append("svg").attr("width", "98%")
            .attr("height", height + margin.top + margin.bottom)
            .append("g")
            .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

        // const data = await d3.csv("https://raw.githubusercontent.com/holtzy/data_to_viz/master/Example_dataset/3_TwoNumOrdered_comma.csv",
        //     d => ({ date : d3.timeParse("%Y-%m-%d")(d.date), value : d.value })
        // );

        //console.log(this.getBoundingClientRect().width)
        // const data = Array()

        const width = this.getBoundingClientRect().width;
        const data = this.data;
        for (let i = 1; i < width; i++) {
            data[i] = data[i - 1] + (Math.round(Math.random()) * 2 - 1);
        }

        const x = d3.scaleLinear();
        
        svg.append("g")
            .attr("transform", "translate(0," + height + ")")
            .call(d3.axisBottom(x));

        console.log(svg.axisLeft);
        const y = d3.scaleLinear()
            .domain([d3.min(data, function(d) { return d; }), d3.max(data, function(d) { return d; })])
            .range([ 0, height ]);

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
