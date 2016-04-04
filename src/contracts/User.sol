contract User {

    mapping (address => bool) delegates;

    function User() {
        delegates[msg.sender] = true;
    }

    function authorize(address grant) {
        if(!delegates[msg.sender]) throw;
        Grant(grant).authorize();
    }

    function createDelegate(address delegate) {
        if(!delegates[msg.sender]) throw;
        delegates[delegate] = true;
    }

    function deleteDelegate(address delegate) {
        if(!delegates[msg.sender]) throw;
        if(!delegates[delegate]) throw;
        delete delegates[delegate];
    }



}