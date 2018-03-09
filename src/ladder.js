/* Factory function which returns a d3 component for drawing ladder diagrams */
function createLadder( svg, id, left, top, width, height ) {
    
    let time, interval; // the interval of time being plotted
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
    // we may want to customize the axis by selecting and modifying the axis after its creation- though this strikes me as more inefficient...
    
    // Create the source scale
    let sourceScale = d3.scaleBand()
        .range( [height, 0] )
        .round( true )
        .paddingInner( 0.5 );
    // consider making a color scale for a fallback if styling information is missing...

    /** Creates or updates a ladder diagram in the svg supplied at creation.
     * The set of sources will be shown as the annotated legs of the ladder.
     * Events will be represented as ladder rungs.*/
    let ladder = function() { //todo make this accept a selection? 
        
        // draw the time axis
        axis.call( timeAxis );

        // join with the source data set
        legs = legs.data( sources );

        // remove old sources
        legs.exit().remove();

        // Add groups for each source, classed so it can be styled in CSS
        let newLegs = legs.enter()
            .append( 'g' )
            .attr('class', function(d) {return d.class;} );

        // figure out some dimensions
        let band = sourceScale.bandwidth();
        let pad = sourceScale.paddingInner();
        let font = band*0.75;
        let center = band*0.5;

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
            .attr( 'x', left + font )
            .attr( 'y', function(d) {return sourceScale(d.id) + font;} );
        
        // merge the selections back together so it is ready for the next render
        legs = newLegs.merge( legs );
            // .call( d3.drag()
            //     .on('start', started)
            //     .on('drag', dragged)
            //     .on('end', ended)
            // ); // TODO filter or highlight on source selection? Allow re-ordering?

        // Draw rungs for all the messages using the same update pattern above
        rungs = rungs.data( events );

        rungs.exit().remove();

        let newRungs = rungs.enter()
            .append( 'path' )
            .attr( 'class', function(d) {return d.class;} );
        // TODO conditionally add labels with the message id?

        rungs = newRungs.merge( rungs )
            .attr( 'd', function(d) {
                let x = Math.round(timeScale(d.time));
                let y1 = sourceScale(d.source) + center;
                let y2 = sourceScale(d.target) + center;
                return `M ${x},${y1} V ${y2}`;
            } );
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
     * Otherwise sets the events and returns the ladder object for chaining. */
    ladder.events = function( newEvents ) {
        if (!newEvents) return events;
        events = newEvents;

        // update time scale's domain
        if (events.length>0)
            timeScale.domain( [events[0].time, events[events.length-1].time] );
        else
            timeScale.domain( [0.0, 1.0] );

        return ladder;
    }

    /** sets the method used to access sources' ids */
    ladder.id = function(d) { return d.id; }

    /** sets the method used to access events' time */
    ladder.time = function(d) {return d.time; }

    /** if an argument isn't supplied, returns the current time.
     * Otherwise sets the time and returns the ladder object for chaining. */
    ladder.currentTime = function( t ) {
        if (!t) return time;
        time = t;
        // todo remove events which have timed out
    }

    return ladder;
}
