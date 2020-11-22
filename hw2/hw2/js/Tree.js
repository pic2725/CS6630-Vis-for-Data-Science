/** Class representing a Tree.
 *
 * Daniel Pak
 * pic2725@gmail.com
 * u0927688
 * */


class Tree {
    /**
     * Creates a Tree Object
     * Populates a single attribute that contains a list (array) of Node objects to be used by the other functions in this class
     * note: Node objects will have a name, parentNode, parentName, children, level, and position
     * @param {json[]} json - array of json objects with name and parent fields
     */
    constructor(json) {

        this.nodes=[];


        for(let i = 0; i < json.length; i++) {

            let node = json[i];

            let temp = new Node(node.name, node.parent);

            this.nodes.push(temp);
        }


    }

    /**
     * Function that builds a tree from a list of nodes with parent refs
     */
    buildTree() {

        this.tempPos = 0;

        let root;
        let current;
        let temp;

        for(let i = 0; i < this.nodes.length; i++){
            current = this.nodes[i];

            //check root
            if(current.parentName === "root") {

                root = current;
            }

            for(let j = 0; j < this.nodes.length; j++){
                temp = this.nodes[j];

                //check parent names
                if(current.parentName === temp.name) {

                    current.parentNode = temp;
                }

                //check names and add to child
                if(current.name === temp.parentName) {

                    current.addChild(temp);
                }
            }
        }

        //assign levels and positions
        this.assignLevel(root, 0);
        this.assignPosition(root, 0);


    }

    /**
     * Recursive function that assign levels to each node
     */
    assignLevel(node, level) {

        node.level = level;

        for(let i = 0; i < node.children.length; i++){

            this.assignLevel(node.children[i], level+1);
        }

    }

    /**
     * Recursive function that assign positions to each node
     */
    assignPosition(node, position) {

        if(position > this.tempPos) {
            this.tempPos = position
        }

        node.position = position;


        if(node.children.length > 0){

            this.assignPosition(node.children[0], position);
        }

        for(let i = 1; i < node.children.length; i++){

            if(this.tempPos < position){

                this.assignPosition(node.children[i], position+1);
            }

            else{

                this.assignPosition(node.children[i], this.tempPos + 1);
            }
        }
    }

    /**
     * Function that renders the tree
     */
    renderTree() {

        let body = d3.select("body");



        let selection = body.append("svg").attr("height", 1200).attr("width", 1200);

        let svg = d3.selectAll("svg");

        //Line
        svg.selectAll("line")
            .data(this.nodes).enter().append("line")

            //set base point
            .attr("x1", function(d, i){return 200*(d.level) + 50;})
            .attr("y1", function(d, i){return 100*(d.position) + 50;})
            .attr("x2", function(d, i) {

                if(d.parentNode){
                    return 200*(d.parentNode.level) + 50;
                }

                return 200*(d.level) + 50;
            })

            .attr("y2", function(d, i) {

                if(d.parentNode){
                    return 100*(d.parentNode.position) + 50;
                }

                return 100*(d.position) + 50;
            })

        let nodes = svg.selectAll('g')
            .data(this.nodes).enter()
            .append('g')
            .attr("class", "nodeGroup");

        //Circle
        nodes.append("circle")
            .attr("cx", function(d, i){return 200*(d.level) + 50;})
            .attr("cy", function(d, i){return 100*(d.position) + 50;})
            .attr("r", 45)

        //Text
        nodes.append("text")
            .text(function(d, i){return d.name;})
            .attr("class", "label")
            .attr("dx", function(d, i){return 200*(d.level) + 50;})
            .attr("dy", function(d, i){return 100*(d.position) + 50;})

    }






}