contract User {

    mapping (address => bool) delegates;

    function User() {
        delegates[msg.sender] = true;
    }

    function authorize(address delegate) {
        if(!delegates[msg.sender]) throw;
        address.authorize();
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