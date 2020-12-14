/** A Component which renders a set of messages between Agents over time
 * @param {Object} timeScale - A D3 LinearScale mapping time onto the time axis
 * @param {Object} sourceScale - A D3 Band Scale mapping agents onto the agent axis
 */
export default function () {//(selection, timeScale, sourceScale) {

    let classifier = d=>d.class;
    let timeScale;
    let sourceScale;

    let width = d=>sourceScale.bandwidth()/2.0; // one idea is changing width based on message size?
    let capheight = d=>sourceScale.bandWidth()/2.0;

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
    function messages(selection, data) {

        // cache dataset for refreshes
        selection.datum( data );

        // figure out some dimensions
        let band = sourceScale.bandwidth();
        let b = band / 2.0; // band half-width
        let r = band / 2.0; // rung half-width
        // TODO make this configurable

        // D3 General Update Pattern
        let arrows = selection
                .selectAll('.message')
                .data(data);
        arrows.exit().remove();
        arrows = arrows.enter()
            .append('path')
            .merge(arrows)
                .attr('class', classifier)
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

    messages.timeScale = function(t) {
        if (arguments.length==0)
            return timeScale;
        timeScale = t;
        return messages;
    }

    messages.sourceScale = function(s) {
        if (arguments.length==0)
            return sourceScale;
        sourceScale = s;
        return messages;
    }

    return messages;
}