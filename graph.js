const dims = { height: 600, width: 600, innerRadius:  270, outerRadius: 290, padAngle: 0.025 };
const cent = { x: (dims.width / 2 + 5), y: (dims.height / 2 + 5) }

const svg = d3.selectAll('.canvas')
    .append('svg')
    .attr('width', dims.width)
    .attr('height', dims.height);

const graph = svg.append('g')
    .attr('transform', `translate(${cent.x}, ${cent.y})`);

const circularAxisGroup = graph.append('g').attr('class', 'axis');

const chord = d3.chord()
    .padAngle(dims.padAngle);

const arc = d3.arc()
    .innerRadius(dims.innerRadius)
    .outerRadius(dims.outerRadius);

const ribbon = d3.ribbon()
    .radius(dims.innerRadius);

const colour = d3.scaleOrdinal([
    '#a6611a',
    '#dfc27d',
    '#80cdc1',
    '#018571'
]);

formatValue = d3.formatPrefix(",.0", 1e3);

const update = data => {

    // Link data
    const chordData = chord(data);
    const chordGroupData = chordData.groups;
    let chordTicks = [];
    chordGroupData.map(item => createTicks(item, 1000)).forEach(item => {
        chordTicks = [...chordTicks, ...item];
    });

    const ribbons = graph.selectAll('.ribbon').data(chordData);
    const arcs = graph.selectAll('.arc').data(chordGroupData);
    const axis = circularAxisGroup.selectAll('.tick').data(chordTicks);

    // Update scales domains
    colour.domain(chordGroupData.map(chordGroupMember => chordGroupMember.index));

    // Exit selection
    ribbons.exit().remove();
    arcs.exit().remove();

    // Current selection
    ribbons.remove();
    arcs.remove();

    // Enter selection
    arcs.enter()
        .append('path')
            .attr('fill', d => colour(d.index))
            .attr('stroke', d => d3.color(colour(d.index)).darker(1))
            .attr('class', 'arc')
            .attr('d', arc);

    ribbons.enter()
        .append('path')
            .attr('fill', d => colour(d.source.index))
            .attr('stroke', d => d3.color(colour(d.source.index)).darker(1))
            .style('opacity', 0.5)
            .attr('class', 'ribbon')
            .attr('d', ribbon);

    axis
    axis.enter()
        .append('line')
        .attr('class', 'tick')
        .attr('stroke', '#000')
        .attr('x2', 5)
            .attr('transform', d => `rotate(${d.angle * 180 / Math.PI - 90}) translate(${dims.outerRadius},0)`);
    console.log(axis)
    
    axis.enter()
        .filter(d => d.value % 5000 === 0)
        .append('text')
        .attr('transform', d => `rotate(${d.angle * 180 / Math.PI - 90}) translate(${dims.outerRadius},0)`)
        .text(d => d.value)

    // Other elements
};


const createTicks = (d, step) => {
    const k = (d.endAngle - d.startAngle) / d.value;
    return d3.range(0, d.value, step).map(value => {
        return {value: value, angle: value * k + d.startAngle}
    });
};

update(matrix);
