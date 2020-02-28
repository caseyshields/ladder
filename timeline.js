/** A Container Component for showing the messaging interactions of agents 
 * over time.
``` json
agent = {
    id: "A unique, concise String",
    class: "The class of the "
}
```
*/
export default function(selection) {

    /** The currently visualized time window. */
    let time, duration;
    
    /** An associative array of all unique agents keyed by name */
    let index = [];
    
    /** The currently visible sources in the order they will visually appear. */
    let agents = [];
    
    /** The events in the buffered time window */
    let events = [];

    let timeScale = d3.scaleLinear()
        .range( [0,width] );
    let timeAxis = d3.axisBottom( timeScale )
        .tickSize( height );

    let sourceScale = d3.scaleBand()
        .range( [height, 0] )
        .round( true )
        .paddingInner( 0.7 )
        .align( 0.0 );

    let zoom = d3.zoom()
        .on('zoom', resizeBand)
        .scaleExtent( [0.1, 0.9] );
    
    function timeline(data) {

    }

    timeline.timecale = function(scale) {
        if (scale==undefined)
            return timeScale;
        timeScale = scale;
        return timeline;
    }

    timeline.sourceScale = function(scale) {
        if (scale==undefined)
            return sourceScale;
        sourceScale = scale;
        return timeline;
    }

    /** Makes the Source visible in the timeline */
    timeline.showSource = function(source) {

    }

    /** Hides the source */
    timeline.hidSource = function(source) {

    }

    return timeline;
}