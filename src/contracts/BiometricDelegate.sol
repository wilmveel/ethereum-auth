contract BiometricDelegate{

    address private user;

    bytes32 private comparable;
    bytes32 private distance;

    function BiometricDelegate(bytes32 _comparable, address _user){
        comparable = _comparable;
        distance = 10;

        user = _user;

    }

    function matchBiometrics(bytes32 _comparable, address grant){
        if(comparable != _comparable) throw;
        User(user).authorize(grant);
    }

}