contract Party {

    mapping (address => bool) delegates;

    /*
     * constructor set sender as first delegate
     */
    function Party () {
        delegates[msg.sender] = true;
    }

    /*
     * authorize contract of type grant
     */
    function authorize (address grant) {
        if(!delegates[msg.sender]) throw;
        Grant(grant).authorize();
    }

    /*
     * enroll new address as delegate to the contract
     */
    function enroll (address delegate) {
        if(!delegates[msg.sender]) throw;
        delegates[delegate] = true;
    }

    /*
     * abandon a delegate from the contract
     */
    function abandon (address delegate) {
        if(!delegates[msg.sender]) throw;
        if(!delegates[delegate]) throw;
        delete delegates[delegate];
    }

}