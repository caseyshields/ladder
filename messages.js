/** A Component which renders a set of messages between Agents.
 * 
 */
export default function (selection, timeScale, sourceScale) {

    function messages(data) {

        // cache dataset for refreshes
        selection.datum( data );

        // D3 General Update Pattern
        let arrows = selection.select('.message').data(data)
        arrows.exit().remove();
        arrows = arrows.enter()
            .append('path')
                .attr('message')
            .merge(arrows)
                .each( function(d) {
                    //TODO compute path 
                });
    }

    return messages;
}