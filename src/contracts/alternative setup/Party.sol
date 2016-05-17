contract Party {

    mapping (address => uint) delegates;
    
    mapping(address=>bool) challenges;
    mapping(address=>bool) usedChallenges;

    modifier isTrusted(uint a){
        if(delegates[msg.sender] < a){
            return;
        }
    }
    
    modifier isNewChallenge(){
        if(!challenges[msg.sender]){throw;}
        if(usedChallenges[msg.sender]){throw;}
    }
    /*
     * constructor set sender as first delegate
     */
    function Party () {
        delegates[msg.sender] = 2;
        //TODO add challenges
    }

    /*
     * authorize contract of type grant
     */
    function authorize (address grant) isTrusted(2) {
        
        Grant(grant).authorize();
    }

    /*
     * enroll new address as delegate to the contract
     */
    function enroll (address delegate) isTrusted(2){
        
        delegates[delegate] = 1;
    }
    
    /*
     * increase trustlevel
     */
     function increaseTrust(address delegate) isNewChallenge{
         delegates[delegate] += 1;
         usedChallenges[msg.sender] = true;
     }
     
     /*
      * add challenge
      */
      function addChallenge(address challenge) isTrusted(4){
          challenges[challenge]= true;
          //TODO challenges must be invoked from here.
      }
     
    /*
     * abandon a delegate from the contract
     */
    function abandon (address delegate) isTrusted(2) {
        
        if(delegates[delegate] == 0) throw;
        delete delegates[delegate];
    }

}