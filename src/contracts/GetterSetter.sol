contract GetterSetter {

    bytes32 name;

    function setName(bytes32 n) {
        name = n;
    }

    function getName() constant returns(bytes32) {
        return name;
    }

}