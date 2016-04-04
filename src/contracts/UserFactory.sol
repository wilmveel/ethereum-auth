contract UserFactory {

    User user;

    function createUser(bytes32 name) {
        user = new User();
    }

    function getUser() constant returns (User){
        return user;
    }

}
