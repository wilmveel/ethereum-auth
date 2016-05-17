contract PasswordChallenge is Challenge{

    bytes32 private salt;
    bytes32 private challenge;
    bytes20 private response;

    function PasswordChallenge(bytes20 _response, bytes32 _salt){
        response = _response;
        salt = _salt;
        challenge = sha3(_salt);
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

    function increaseTrust(uint8 v, bytes32 r, bytes32 s, address party, address grant) {
        if(!verify(v, r, s)) return error();
        Party(party).increaseTrust(msg.sender);
        return success();
    }

    function verify(uint8 v, bytes32 r, bytes32 s) returns (bool) {
        var result =  (bytes20(ecrecover(challenge, v, r, s)) == response);
        challenge = sha3(challenge);
        return result;
    }
}