/** A Component for visualizing an actor on a timeline.
*/
export default function() {
    
    let identifier = d=>d.id;
    let classifier = d=>d.classy;
    let timeScale;
    let sourceScale;

    /** Render method draws a labled bar with embedded filter controls
     * 
``` json
agent = {
    id: "A unique, concise String",
    classy: "The CSS class of the agent's SVG group"
}
```
    */
    function agents(selection, data) {

        // cache the data for subsequent refreshes
        selection.datum(data);

        // D3 General Update Pattern
        let agency = selection.selectAll('.agent')
                .data(data);

        agency.exit().remove();

        let newagency = agency.enter()
            .append('g');
            // .classed('agent');
            // TODO is the containing layer classed as 'agent'? where do I select it?

        // figure out some dimensions
        let x = timeScale.range()[0];
        let width = timeScale.range()[1] - x;

        let band = sourceScale.bandwidth();
        let pad = sourceScale.paddingInner();
        let font = band * 0.75;
        let b = band / 2.0; // band half-width
        let r = band / 2.0; // rung half-width
        // TODO just center the dang text...

        let bar = newagency.append('rect')
            .attr( 'x', x )
            .attr( 'y', function(d) {return sourceScale(d.id);} )
            .attr( 'width', width )
            .attr( 'height', band );

        let label = newagency.append('text')
            .text( d => d.id )
            .attr( 'font-size', band/2 )
            .attr( 'x', pad )
            .attr( 'y', d=>sourceScale(d.id) );
            // in the CSS don't forget;
            // text-anchor : middle;
            // dominant-baseline : middle;
        

        agency = newagency.merge(agency)
            .attr( 'class', d=>d.classy);
            // TODO should I just use a transform on the group instead of manipulating their attributes directly?
    }

    /** @param {Object} t - Undefined or a D3 LinearScale for the time axis */
    agents.timeScale = function(t) {
        if (arguments.length==0)
            return timeScale;
        timeScale = t;
        return agents;
    }

    /** @param {Object} s - Undefined or a D3 Band Scale for the agent axis  */
    agents.sourceScale = function(s) {
        if (arguments.length==0)
            return sourceScale;
        sourceScale = s;
        return agents;
    }

    return agents;
}
