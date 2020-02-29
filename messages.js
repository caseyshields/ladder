/** A Component which renders a set of messages between Agents.
 * 
 */
export default function (selection, timeScale, sourceScale) {
// TODO though hypothetically you could use this with any container that sported a timescale, bandscale and source index, I think I just make it take Timeline as an arg...
    /**
     * 
``` json
message = {
    class: "",
    source: "",
    target: "",
}
```
     */
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