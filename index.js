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

const update = data => {
    // Update scales

    // Link data
    const chordData = chord(data);
    const chordGroupData = chordData.groups;
    const ribbons = graph.selectAll('.ribbon').data(chordData);
    const arcs = graph.selectAll('.arc').data(chordGroupData);

    // Exit selection

    // Current selection

    // Enter selection
    arcs.enter()
        .append('path')
            .attr('fill', 'purple')
            .attr('stroke', 'purple')
            .attr('class', 'arc')
            .attr('d', arc);

    ribbons.enter()
        .append('path')
            .attr('fill', 'purple')
            .attr('stroke', 'purple')
            .attr('class', 'ribbon')
            .attr('d', ribbon);

    // Other elements
};

update(matrix);