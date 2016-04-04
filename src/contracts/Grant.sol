contract grant {

    address app;
    address user;

    function grant() {
        app = msg.sender
    }

    function authorize(address u) {
        user = u
    }

}