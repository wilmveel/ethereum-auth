contract FacebookDelegate{

    address user;

    bytes32 private salt;
    bytes32 private challenge;
    bytes20 private response;

    event error(string msg);
    event success(string msg);


    function PasswordDelegate(address _user, bytes20 _response, bytes32 _salt){
        user = _user;
        response = _response;
        salt = _salt;
        challenge = sha3(now);
    }

    function getSalt() constant returns(bytes32){
        return salt;
    }

    function getChallenge() constant returns(bytes32){
        return challenge;
    }

    function getResponse() constant returns(bytes20){
        return response;
    }

    function authorize(uint8 v, bytes32 r, bytes32 s, address grant) {
        if(bytes20(ecrecover(challenge, v, r, s)) != response) return error('Incorrect password');
        User(user).authorize(grant);
        challenge = sha3(challenge);
        return success('Authentication successfull');
    }

}