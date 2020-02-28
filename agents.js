/** A Component for visualizing an agent on a timeline.
 * 
*/
export default function(selection, timescale, sourcescale) {

    /** Render method draws a labled bar with embedded filter controls
     * 
``` json
agent = {
    id: "A unique, concise String",
    class: "The class of the "
}
```
    */
    function agents(data) {

        // cache the data for subsequent refreshes
        selection.datam(data);

        // D3 General Update Pattern
        let agency = selection.selectAll('.agent')
                .data(data);

        agency.exit().remove();

        let newagency = agency.enter()
            .append('g')
            .classed('agent');

        let bar = newagency.append('rectangle')
            .attr('x', )
    }

    return agent;
}
