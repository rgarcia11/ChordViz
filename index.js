const dims = { height: 600, width: 600, innerRadius:  270, outerRadius: 290, padAngle: 0.025 };
const cent = { x: (dims.width / 2 + 5), y: (dims.height / 2 + 5) }

const svg = d3.selectAll('.canvas')
    .append('svg')
    .attr('width', dims.width)
    .attr('height', dims.height);

const graph = svg.append('g')
    .attr('transform', `translate(${cent.x}, ${cent.y})`);

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

const update = data => {

    // Link data
    const chordData = chord(data);
    const chordGroupData = chordData.groups;

    const ribbons = graph.selectAll('.ribbon').data(chordData);
    const arcs = graph.selectAll('.arc').data(chordGroupData);

    // Update scales
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
            .attr('stroke', d => colour(d.index))
            .attr('class', 'arc')
            .attr('d', arc);

    ribbons.enter()
        .append('path')
            .attr('fill', d => colour(d.source.index))
            .attr('stroke', d => colour(d.source.index))
            .style('opacity', 0.5)
            .attr('class', 'ribbon')
            .attr('d', ribbon);

    // Other elements
};

update(matrix);