const width = 960, height = 600;
const url = "https://cdn.freecodecamp.org/testable-projects-fcc/data/tree_map/movie-data.json";
const svg = d3.select("#treemap"), tooltip = d3.select("#tooltip"), legend = d3.select("#legend");

d3.json(url).then(data => {
  const root = d3.hierarchy(data).sum(d => d.value).sort((a, b) => b.value - a.value);
  d3.treemap().size([width, height]).paddingInner(1)(root);

  const categories = [...new Set(root.leaves().map(d => d.data.category))];
  const color = d3.scaleOrdinal().domain(categories).range(d3.schemeCategory10);

  svg.selectAll("g")
    .data(root.leaves())
    .join("g")
    .attr("transform", d => `translate(${d.x0}, ${d.y0})`)
    .each(function(d) {
      d3.select(this).append("rect")
        .attr("class", "tile")
        .attr("data-name", d.data.name)
        .attr("data-category", d.data.category)
        .attr("data-value", d.data.value)
        .attr("width", d.x1 - d.x0)
        .attr("height", d.y1 - d.y0)
        .attr("fill", color(d.data.category))
        .on("mousemove", (event) => tooltip.style("opacity", 1)
          .html(`
            <strong>${d.data.name}</strong><br>
            Category: ${d.data.category}<br>
            Value: $${d.data.value.toLocaleString()}
          `)
          .attr("data-value", d.data.value)
          .style("left", `${event.pageX + 15}px`)
          .style("top", `${event.pageY - 40}px`)
        )
        .on("mouseout", () => tooltip.style("opacity", 0));

      d3.select(this).append("text")
        .attr("class", "tile-text")
        .selectAll("tspan")
        .data(d => {
          const words = d.data.name.split(/\s+/);
          const maxLines = Math.floor((d.y1 - d.y0) / 12);
          return words.slice(0, maxLines);
        })
        .join("tspan")
        .attr("x", 4)
        .attr("y", (d, i) => 12 + i * 10)
        .text(d => d);
    });

  const spacing = 160, legendItemSize = 20;
  legend.selectAll("g")
    .data(categories)
    .join("g")
    .attr("transform", (d, i) => `translate(${(i % 4) * spacing + 10}, ${Math.floor(i / 4) * 30 + 10})`)
    .each(function(d) {
      d3.select(this).append("rect")
        .attr("class", "legend-item")
        .attr("width", legendItemSize)
        .attr("height", legendItemSize)
        .attr("fill", color(d));

      d3.select(this).append("text")
        .attr("x", legendItemSize + 6)
        .attr("y", 15)
        .style("font-size", "0.8rem")
        .text(d);
    });
});
