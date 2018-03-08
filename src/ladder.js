/* Factory function which returns a d3 component for drawing ladder diagrams */
function createLadder( svg, id, left, top, width, height ) {
    
    let time, interval;
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
        // todo add a high precision time formatter
    
    // Create the source axis
    let sourceScale = d3.scaleBand()
        .range( [height, 0] )
        .round( true )
        .paddingInner( 0.5 );
    // let sourceAxis = d3.axisRight( soureScale )
    //     .tickSize( width );
    // // we may want to customize the axis by selecting and modifying the axis after its creation- though this strikes me as more inefficient...

    let ladder = function() { //todo make this accept a selection? 
        
        // join with the source data set
        legs = legs.data( sources );

        // remove old sources
        legs.exit().remove();

        // create new timelines for each source
        let entered = legs.enter()
            .append( 'g' )
            .attr('class', function(d) {return d.class;} );

        entered.append( 'rect' )
            .attr( 'x', left )
            .attr( 'y', function(d) {return sourceScale(d.id);} )
            .attr( 'width', width )
            .attr( 'height', sourceScale.bandwidth() );

        entered.append( 'text' )
            .text( function(d) {return d.id;} )
            .attr( 'anchor', 'start' )
            .attr( 'x', left )
            .attr( 'y', function(d) {return sourceScale(d.id);} );
        
        // update all sources
        legs = entered.merge( legs );
            // .call( d3.drag()
            //     .on('start', started)
            //     .on('drag', dragged)
            //     .on('end', ended)
            // ); // TODO filter or highlight on source selection? Allow re-ordering?
    }

    ladder.sources = function( newSources ) {
        if (!newSources) return sources;
        sources = newSources;
        let ids = [];
        newSources.forEach( function(d){ids.push(d.id);} );
        sourceScale.domain( ids );
        return ladder;
    }

    ladder.events = function( newEvents ) {
        if (!newEvents) return events;
        events = newEvents;
        return ladder;
    }

    return ladder;
}
/* the ladder svg will look something like;
<g class="ladder">
<g id="timeAxis"></g>
    <g id="legs">
        <g class="...some ip">
            <rect />
            <text />
        </g>
        ...
    </g>
    <g id="rungs">
        <path class="...some protocol">
        ...
    </g>
</g>*/