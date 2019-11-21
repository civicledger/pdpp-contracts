pragma solidity 0.5.8;

contract AccessList {

    address private owner;

    mapping(address => bool) public lodgeAccess;
    mapping(address => bool) public approveAccess;
    mapping(address => bool) public documentAccess;

    constructor() public {
        owner = msg.sender;
    }

    function hasLodgeAccess(address _checkAddress) public view returns(bool) {
        if(msg.sender == owner) return true;
        return lodgeAccess[_checkAddress];
    }

    function hasApproveAccess(address _checkAddress) external view returns(bool) {
        if(msg.sender == owner) return true;
        return approveAccess[_checkAddress];
    }

    function hasDocumentAccess(address _checkAddress) external view returns(bool) {
        return documentAccess[_checkAddress];
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

    function grantDocumentAccess(address _grantAddress) public {
        require(msg.sender == owner, 'Only the owner may take this action');
        documentAccess[_grantAddress] = true;
    }

    function revokeDocumentAccess(address _revokeAddress) public {
        require(msg.sender == owner, 'Only the owner may take this action');
        documentAccess[_revokeAddress] = false;
    }

}