contract PasswordDelegate{

    address private user;

    bytes32 private challenge;
    bytes32 private response;


    function PasswordDelegate(address _user, bytes32 _challenge, bytes32 _response){
        user = _user;
        challenge = _challenge;
        response = _response;
    }

    function challenge() constant returns(bytes32 challenge){
        return challenge;
    }

    function response(bytes32 _response, address grant ){
        if(response != _response) throw;
        User(user).authorize(grant);
    }
}