contract PasswordDelegate{

    address user;

    bytes32 challenge;
    bytes24 response;

    function PasswordDelegate(bytes32 _challenge, bytes24 _response){
        challenge = _challenge;
        response = _response;
    }

    function getChallenge() constant returns(bytes32){
        return challenge;
    }

    function authorize(uint8 v, bytes32 r, bytes32 s ) constant returns(address){
        return ecrecover(challenge, v, r, s);
    }
}