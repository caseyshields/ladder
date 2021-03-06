
export default createLadder;

/** Factory function which returns a d3 component for drawing ladder diagrams.
 * Sources are expected to have 'id' and 'class' attributes.
 * Events are expected to have 'class', 'source', and 'target' attributes. */
function createLadder( svg, id, left, top, width, height, readout ) {
    
    let time, duration; // the interval of time being plotted
    let sources = []; // the legs of the ladder
    let events = []; // the rungs of the ladder

    // set up the structure of the ladder svg
    let group = svg.append('g')
        .attr( 'id', id )
        .attr( 'class', 'ladder' );
    
    let axis = group.append( 'g' )
        .attr( 'id', 'axis' );
        
    let legs = group.append( 'g' )
        .attr( 'id', 'legs' )
        .selectAll('g');

    let rungs = group.append( 'g' )
        .attr( 'id', 'rungs' )
        .selectAll('g');

    // create the time axis
    let timeScale = d3.scaleLinear()
        .range( [0, width] );
    let timeAxis = d3.axisBottom( timeScale )
        .tickSize( height );
    // TODO add a high precision time formatter
    
    // Create the source scale
    let sourceScale = d3.scaleBand()
        .range( [height, 0] )
        .round( true )
        .paddingInner( 0.70 )
        .align( 0.0 );
    // consider making a color scale for a fallback if styling information is missing...

    // add ability to scale and pan ladder
    let zoom = d3.zoom()
        .on("zoom", resizeBand)
        .scaleExtent( [0.1, 0.9] );

    /** Creates or updates a ladder diagram in the svg supplied at creation.
     * The set of sources will be shown as the annotated legs of the ladder.
     * Events will be represented as ladder rungs.*/
    let ladder = function() { //TODO make this accept a selection? 
        
        // update time domain
        let expire = time - duration;
        timeScale.domain( [expire, time] );

        // remove expired events
        while (events.length > 0
                && events[0].time < expire)
            events.shift();

        // draw the time axis
        axis.call( timeAxis );

        // join with the source data set
        legs = legs.data( sources );

        // remove old sources
        legs.exit().remove();

        // Add groups for each source, classed so it can be styled in CSS
        let newLegs = legs.enter()
            .append( 'g' )
            .attr('class', function(d) {return d.class;} )
            .style("cursor", "zoom")
            .call( d3.drag()
                .on('start', started)
                .on('drag', dragged)
                .on('end', ended) );

        // figure out some dimensions
        let band = sourceScale.bandwidth();
        let pad = sourceScale.paddingInner();
        let font = band*0.75;
        let b = band / 2.0; // band half-width
        let r = band / 2.0; // rung half-width

        // draw a rectangle for the background of each timeline
        newLegs.append( 'rect' )
            .attr( 'x', left )
            .attr( 'y', function(d) {return sourceScale(d.id);} )
            .attr( 'width', width )
            .attr( 'height', band );

        // add a label for each source
        newLegs.append( 'text' )
            .text( function(d) {return d.id;} )
            .attr( 'anchor', 'start' )
            .attr( 'font-size', font )
            .attr( 'x', left + b )
            .attr( 'y', function(d) {return sourceScale(d.id) + font;} )
            .call( zoom );
        
        // now update dimensions of pre-existing sources
        legs.selectAll( 'rect' )
            .attr( 'x', left )
            .attr( 'y', function(d) {return sourceScale(d.id);} )
            .attr( 'width', width )
            .attr( 'height', band );

        legs.selectAll( 'text' ) // is this nested selecting performant?
            .attr( 'font-size', font )
            .attr( 'x', left + b )
            .attr( 'y', function(d) {return sourceScale(d.id) + font;} );

        // merge the selections back together so it is ready for the next render
        legs = newLegs.merge( legs );
            //.call( d3.drag()
            //     .on('start', started)
            //     .on('drag', dragged)
            //     .on('end', ended)
            //); // TODO filter or highlight on source selection? Allow re-ordering?

        // Draw rungs for all the messages using the same update pattern above
        rungs = rungs.data( events );

        rungs.exit().remove();

        let newRungs = rungs.enter()
            .append( 'path' );

        rungs = newRungs.merge( rungs )
            .attr( 'class', function(d) {return d.class;} )
            .attr( 'd', function(d) {
                let x = Math.round(timeScale(d.time));
                let y1 = sourceScale(d.source);
                let y2 = sourceScale(d.target);
                if (y1<y2) // down
                    return `M${x-r},${y1+band} V${y2} L${x},${y2+b} L${x+r},${y2} V${y1+band} Z`;
                else // up
                    return `M${x-r},${y1} V${y2+band} L${x},${y2+b} L${x+r},${y2+band} V${y1} Z`;
            } ).call( readout ); // might consider id'ing rungs 
    }

    // callbacks for source dragging
    function started(d) {
        let g = d3.select(this);// this is the current DOM element
        g.raise().classed('dragging', true);
        console.log(d);
    }
    function dragged(d) {
        let g = d3.select(this);
        let rect = g.select('rect');
        rect.attr('y', d3.event.y);
    }
    function ended(d) {
        let g = d3.select(this);
        g.classed('dragging', false);
    }

    /** Mouse wheel callback for resizing ladder diagram proportions. */
    function resizeBand( data, index, selection ) {

        // set the padding directly from the zoom transform's scale
        let k = d3.event.transform.k;
        sourceScale.paddingInner( k );
        // proportion will jump when multiple zoom behaviors are combined.
        // console.log( k ); we either need to cache band zooms or go back to manually tracking proportion...

        // re-render
        ladder();
    }

    /** D3 style chaining setter/getter for current time. if an argument isn't supplied, returns the current time.
     * Otherwise sets the time and returns the ladder object for chaining. */
    ladder.currentTime = function( t ) {
        if (!t) return time;
        time = t;
        return ladder;
    }

    /** D3 style chaining, setter/getter for buffered interval duration. */
    ladder.interval = function( i ) {
        if (!i) return duration;
        duration = i;
        return ladder;
    }

    /** If an argument isn't supplied, returns the current set of sources.
     * Otherwise sets the sources and returns the ladder object for chaining. */
    ladder.sources = function( newSources ) {
        // setter / getter
        if (!newSources) return sources;
        sources = newSources;

        // update the source scale's domain
        let ids = [];
        newSources.forEach( function(d){ids.push(d.id);} );
        sourceScale.domain( ids );

        // return the ladder to allow chaining
        return ladder;
    }

    /** if an argument isn't supplied, returns the current set of events.
     * Otherwise sets the events and returns the ladder object for chaining.
     * Sets the time and interval to match the given data. */
    ladder.events = function( newEvents ) {
        if (!newEvents) return events;
        events = newEvents;

        // update time scale's domain
        if (events.length>0) {
            time = events[events.length-1].time;
            duration = time - events[0].time;
        }
        
        return ladder;
    }

    /** Adds the given events to the buffer, updates time, then removes expired events. */
    ladder.add = function( event ) {
        // add the given event
        events.push(event);

        // update the time
        time = event.time;
    } // we might just want to drop this functionality entirely; perhaps another object should be responsible for filtering and sliding time windows...

    // TODO I ought to add some click handlers to the sources and events...
    // the grid nature of the ladder should made hit detection easy too...

    // While ommiting this will make the component less flexible, we control the data so there's no point in this extra indirection for us...
    // /** Sets the method used to access sources' ids. */
    // ladder.id = function(f) {
    //     if (!f) return getId;
    //     else getId = f;
    //     return ladder;
    // }
    // //private default accessor for source id
    // let getId = function(source) { return source.id; }

    // /** sets the method used to access events' time */
    // ladder.time = function(f) {
    //     if (!f) return getTime;
    //     else getTime = f;
    //     return ladder;
    // }
    // // private default accessor for event's time
    // let getTime = function(event) { return event.time; }
    // // TODO should we have similar customizability for event source and target?

    return ladder;
}
