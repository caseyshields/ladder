/** A Container Component for showing the messaging interactions of agents 
 * over time.
*/
export default function(selection) {

    /** The currently visualized time window. */
    let time, duration;
    
    /** An associative array of all unique agents keyed by name */
    let index = [];
    
    /** The currently visible sources in the order they will visually appear. */
    let agents = [];
    
    // /** The events in the buffered time window */
    // let events = []; // this should be handled seperately

    let timeScale = d3.scaleLinear()
        .range( [0,width] );
    let timeAxis = d3.axisBottom( timeScale )
        .tickSize( height );

    let agentScale = d3.scaleBand()
        .range( [height, 0] )
        .domain( [] )
        .round( true )
        .paddingInner( 0.7 )
        .align( 0.0 );

    let zoom = d3.zoom()
        .on('zoom', resizeBand)
        .scaleExtent( [0.1, 0.9] );
    
    function timeline(data) {

        // update time domain
        let expire = time - duration;
        timeScale.domain( [expire, time] );
    
        // // remove expired events
        // while (events.length > 0
        //     && events[0].time < expire)
        // events.shift();

        // draw the time axis
        axis.call( timeAxis );

        // TODO draw each component layer...
    }

    timeline.timeScale = function(scale) {
        if (scale==undefined)
            return timeScale;
        timeScale = scale;
        return timeline;
    }

    timeline.agentScale = function(scale) {
        if (scale==undefined)
            return agentScale;
        agentScale = scale;
        return timeline;
    }

    /** Makes the Source visible in the timeline */
    timeline.showAgent = function(agent) {
        let domain = agentScale.domain();
        if (domain.includes( agent ))
            ;// move to top?
        else {
            domain.push( agent );
            agentScale.domain( domain );
        }
    }

    /** Hides the source */
    timeline.hideAgent = function(agent) {
        let domain = agentScale.domain();
        let n = domain.findIndex( d=>d.id==agent )
        if (n>-1) {
            domain.copywithin(n, n+1, domain.length);
            domain.pop();
            agentScale.domain( domain );
        }
    }

    return timeline;
}