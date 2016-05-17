contract Grant {

    address client;
    address owner;

    function Grant(address _client) {
        client = _client;
    }

    /*
     * authorize the grant contract
     * this can only be done once
     */
    function authorize() {
        if(msg.sender != owner) throw;
        owner = msg.sender;
    }

    /*
     * revoke the grant contract
     * this can be done by the client or owner
     */
    function revoke() {
        if(msg.sender != client &&  msg.sender != owner) throw;
        suicide(msg.sender);
    }

}
