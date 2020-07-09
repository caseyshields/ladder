/** A Component which renders a set of messages between Agents over time
 * @param {Object} timeScale - A D3 LinearScale mapping time onto the time axis
 * @param {Object} sourceScale - A D3 Band Scale mapping agents onto the agent axis
 */
export default function (selection, timeScale, sourceScale) {
// TODO though hypothetically you could use this with any container that sported a timescale, bandscale and source index, I think I just make it take Timeline as an arg...
    /**
     * 
``` json
message = {
    class: "",
    source: "",
    target: "",
}
```
     */
    function messages(data) {

        // cache dataset for refreshes
        selection.datum( data );

        // D3 General Update Pattern
        let arrows = selection.select('.message').data(data)
        arrows.exit().remove();
        arrows = arrows.enter()
            .append('path')
            .merge(arrows)
                .attr('class', function(d){return d.class;})
                .attr('d', function(d) {
                    let x = Math.round(timeScale(d.time));
                    let y1 = sourceScale(d.source);
                    let y2 = sourceScale(d.target);
                    if (y1<y2) // down
                        return `M${x-r},${y1+band} V${y2} L${x},${y2+b} L${x+r},${y2} V${y1+band} Z`;
                    else // up
                        return `M${x-r},${y1} V${y2+band} L${x},${y2+b} L${x+r},${y2+band} V${y1} Z`;
                });
    }

    return messages;
}