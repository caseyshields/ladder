/** A Container Component for showing the messaging interactions of agents 
 * over time.
*/
export default function() {

    let identifier = d=>d.id;

    let visible = d=>true;

    // An index of layer names to their components
    let components = {};

    let timeScale = d3.scaleLinear();
            // .range( [0,512] )
            // .domain( [0, 1000] );

    let timeAxis = d3.axisBottom( timeScale );
            // .tickSize( 512 );

    let agents = [];

    let agentScale = d3.scaleBand()
        // .range( [512, 0] )
        // .domain( [] )
        .round( true )
        .paddingInner( 0.7 )
        .align( 0.0 );

    // let zoom = d3.zoom()
    //     .on('zoom', resizeBand)
    //     .scaleExtent( [0.1, 0.9] );
    
    function timeline(selection, data) {

        // cache a reference to the dataset
        selection.datum(data);

        let layers = selection
                .selectAll('g')
                .data( data );
        
        // remove layers with no corresponding data
        layers.exit().remove()

        // add new layers in reverse data order so rendering is correct
        layers = layers.enter()
            .insert( 'g', ':first-child' )
            .attr( 'class', (d)=>d.classy )

        // repaint all the other layers
        .merge( layers )
            .each( function(d) {

                // recurse on every component
                let parent = d3.select(this);
                let component = components[d.classy];
                component( parent, d.data)

            });

        // draw the time axis

        // axis.call( timeAxis );
    }

    /** Adds a component to the Timeline which will be used to render layers with the given name.
     * The component must be a function that accepts a D3 Selection followed by an Array.
     * @param {String} name - The name of the layer, will also be used as the class attribute for the layer's SVG group
     * @param {Object} component - The render method of a D3 component
     * @return {Object} The Timeline object for fluent styling
     */
    timeline.addLayer = function(name, component) {
        if (components[name])
            throw new Error(`timeline : layer ${name} already exists`);
        components[name] = component;
        return timeline;
    }

    // trying a few different ways to write the accessors...
    timeline.width = function(w) {
        return (arguments.length)
            ? (timeScale.range([0,w]), timeline)
            : timeScale.range()[1];
    }

    timeline.height = function(h) {
        if (arguments.length==0)
            return agentScale.range()[1];
        agentScale.range([0,h]);
        timeAxis.tickSize(h);
        return timeline
    }

    timeline.interval = function(i) {
        if (arguments.length==0)
            return timeScale.domain();
        timeScale.domain(i);
        return timeline;
    }

    timeline.agents = function(a) {
        if (arguments.length==0)
            return agents;
        agents = a;
        agentScale.domain( agents.filter(visible).map(identifier) );
        return timeline;
    } // TODO provide some search and order changing methods for the agents?...

    timeline.timeScale = function() { return timeScale; }
    timeline.agentScale = function() { return agentScale; }
    return timeline;
}

    // /** Makes the Source visible in the timeline */
    // timeline.showAgent = function(agent) {
    //     let domain = agentScale.domain();
    //     if (domain.includes( agent ))
    //         ;// move to top?
    //     else {
    //         domain.push( agent );
    //         agentScale.domain( domain );
    //     }
    // }

    // /** Hides the source */
    // timeline.hideAgent = function(agent) {
    //     let domain = agentScale.domain();
    //     let n = domain.findIndex( d=>d.id==agent )
    //     if (n>-1) {
    //         domain.copywithin(n, n+1, domain.length);
    //         domain.pop();
    //         agentScale.domain( domain );
    //     }
    // }