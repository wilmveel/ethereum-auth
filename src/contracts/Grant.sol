contract Grant {

    address app;
    address user;

    function Grant() {
        app = msg.sender
    }

    function authorize() {
        user = msg.sender
    }

}