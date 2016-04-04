contract UserFactory {

    User user;

    function createUser() {
        user = new User();
    }

    function getUser() constant returns (User){
        return user;
    }

}
