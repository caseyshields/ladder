/** Factory function for a detail pop-up which shows a json serialization of objects it's listening to. */
function createReadout( ) {

    // add a div for the actual tooltip
    let div = d3.select('body').append('div')
        .attr('class', 'readout') // for easy css styling
        .style('position', 'absolute') // the readout is absolutel positioned
        .style('opacity', 0); // hide the div to begin

    /** formats the mapped data  */
    let tohtml = function( d ) {
        return JSON.stringify( d, null, '<br>' );
    }
    
    /** Adds a listener to every item in the selection, which will display a readout on mouse over. */
    function readout( selection ) {
        selection.on('mouseover', function(d) {
            div
                .html( tohtml(d) )
                .style( 'left', d3.event.pageX+"px" )
                .style( 'top', d3.event.pageY+"px" );
                // TODO intelligently position the readout
            div
                .transition()
                .duration(500)
                .style('opacity', 0.75);
        }).on('mouseout', function(d) {
            div
                .transition()
                .duration(250)
                .style('opacity', 0);
        });
    }

    /** sets or returns the function which serializes the component */
    readout.reader = function(d) {
        if (!d)
            return tohtml;
        tohtml = d;
        return readout;
    }

    return readout;
}
/* TODO doing it this way, it becomes necessary to give every interactive 
object the readout a priori, because you need to add the listener to every
entered datum. just reselecting every frame would be wasteful. If we're 
going to do that we might as well have them update a quadtree and thereby
provide generic spatial queries for any component...*/