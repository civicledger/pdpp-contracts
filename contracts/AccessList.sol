pragma solidity 0.5.8;

contract AccessList {

    address private owner;

    mapping(address => bool) public lodgeAccess;
    mapping(address => bool) public approveAccess;

    constructor() public {
        owner = msg.sender;
    }

    function hasLodgeAccess(address _checkAddress) public view returns(bool) {
        return lodgeAccess[_checkAddress];
    }

    function hasApproveAccess(address _checkAddress) external view returns(bool) {
        return approveAccess[_checkAddress];
    }

    function grantLodgeAccess(address _grantAddress) public {
        require(msg.sender == owner, 'Only the owner may take this action');
        lodgeAccess[_grantAddress] = true;
    }

    function revokeLodgeAccess(address _revokeAddress) public {
        require(msg.sender == owner, 'Only the owner may take this action');
        lodgeAccess[_revokeAddress] = false;
    }

    function grantApproveAccess(address _grantAddress) public {
        require(msg.sender == owner, 'Only the owner may take this action');
        approveAccess[_grantAddress] = true;
    }

    function revokeApproveAccess(address _revokeAddress) public {
        require(msg.sender == owner, 'Only the owner may take this action');
        approveAccess[_revokeAddress] = false;
    }

}