contract WalletTrust{
    
    struct solvedChallenge{
        uint challengeID;
    }
    address private wallet;
    address private creator;
    
    solvedChallenge[] trust;
    
    
    function WalletTrust(address _wallet){
        creator = msg.sender;
        wallet = _wallet;
    }
    
    modifier isCreator(){
        if(msg.sender != creator){
            throw;
        }
    }
    
    function increaseTrust(uint _challengeID) isCreator {
        for (uint i= 0 ; i <trust.length; i++){
            if (_challengeID == trust[i].challengeID){
                throw;
            }
        }
        trust.push(solvedChallenge({challengeID:_challengeID}));
    }
    
    function getTrustLevel() isCreator constant returns(uint){
        return trust.length;
    }
    function getWallet() isCreator constant returns(address){
        wallet;
    }
}