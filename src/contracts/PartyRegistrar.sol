contract PartyRegistar{
    struct Party {
        
        address partyAddress;
    }
    
    mapping(string => Party) private partyMapping;
    
    function PartyRegistrar(){
        // can invoke standard users
    }
    
    function(){
        // no ether to the registrar
        return;
    }
    
    function isAvailable(string _name) constant returns(bool ){
        Party a = partyMapping[_name];
        if (a.partyAddress != 0x0){
            return true;
        }
        else { return false;}
    }
    
    function setPartyName(string _name, address _address){
        partyMapping[_name].partyAddress = _address;
    }
    
    function getAddress(string _name) constant returns(address){
        partyMapping[_name].partyAddress;
    }

}