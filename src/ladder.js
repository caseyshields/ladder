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

    let ladder = function() { //todo make this accept a selection? 
        
        // draw the time axis
        axis.call( timeAxis );

        // join with the source data set
        legs = legs.data( sources );

        // remove old sources
        legs.exit().remove();

        // create new timelines for each source
        let entered = legs.enter()
            .append( 'g' )
            .attr('class', function(d) {return d.class;} );

        let band = sourceScale.bandwidth();
        let pad = sourceScale.paddingInner();
        let font = band*0.75;

        entered.append( 'rect' )
            .attr( 'x', left )
            .attr( 'y', function(d) {return sourceScale(d.id);} )
            .attr( 'width', width )
            .attr( 'height', band );

        entered.append( 'text' )
            .text( function(d) {return d.id;} )
            .attr( 'anchor', 'start' )
            .attr( 'font-size', font )
            .attr( 'x', left + font )
            .attr( 'y', function(d) {return sourceScale(d.id) + font;} );
        
        // update all sources
        legs = entered.merge( legs );
            // .call( d3.drag()
            //     .on('start', started)
            //     .on('drag', dragged)
            //     .on('end', ended)
            // ); // TODO filter or highlight on source selection? Allow re-ordering?

        // TODO draw rungs, labeling them by ID if they are large enough...
    }

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

    ladder.events = function( newEvents ) {
        if (!newEvents) return events;
        events = newEvents;
        return ladder;
    }

    ladder.time = function( t ) {
        if (!t) return time;
        time = t;
        // todo remove events which have timed out
    }
    return ladder;
}
