contract Grant {

    address app;
    address user;

    function Grant() {
        app = msg.sender;
    }

    function authorize() {
        user = msg.sender;
    }

    function state() constant returns (address b, address a){
        a = app;
        b = user;
    }

}