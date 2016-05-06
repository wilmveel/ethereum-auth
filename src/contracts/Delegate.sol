contract Delegate{

    event error();
    event success();

    function authorize(uint8 v, bytes32 r, bytes32 s, address party, address grant){}

}