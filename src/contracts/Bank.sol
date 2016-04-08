contract Bank{
    
    address private service;
    
    modifier onlyBanker(){
        if(msg.sender != service) throw;
    }
    
    function Bank(){
        service = msg.sender;
    }
    
    function fund(address person) onlyBanker {
        
        uint price = tx.gasprice;
        person.send(price * 500);
        bankersOath(price);
        
    }
    
    function bankersOath(uint price){
        service.send(price * 500);
    }


}