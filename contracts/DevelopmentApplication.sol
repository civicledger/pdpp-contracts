pragma solidity 0.5.8;

import './AccessList.sol';

contract DevelopmentApplication {

    AccessList public accessList;
    bytes32 public applicationId;

    bool public approved;
    uint public approvalTime;

    bool public constructionCertificateLodged = false;
    uint public constructionCertificateLodgedTime;
    bool public constructionCertificateApproved = false;
    uint public constructionCertificateApprovedTime;
    string public constructionCertificate;

    bool public subdivisionCertificateLodged = false;
    uint public subdivisionCertificateLodgedTime;
    bool public subdivisionCertificateApproved = false;
    uint public subdivisionCertificateApprovedTime;
    string public subdivisionCertificate;

    event ApplicationApproved(bytes32 indexed _applicationId, address approvedBy);
    event ConstructionCertificateLodged(bytes32 indexed _applicationId, address lodgedBy);
    event ConstructionCertificateApproved(bytes32 indexed _applicationId, address approvedBy);
    event SubdivisionCertificateLodged(bytes32 indexed _applicationId, address lodgedBy);
    event SubdivisionCertificateApproved(bytes32 indexed _applicationId, address approvedBy);
    event DocumentAdded(bytes32 indexed _applicationId, address addedBy, string fileLocation);
    event DocumentModified(bytes32 indexed _applicationId, address modifiedBy, string fileLocation);

    constructor(address _accessListAddress, bytes32 _applicationId) public {
        accessList = AccessList(_accessListAddress);
        applicationId = _applicationId;
    }

    function approveApplication() public canApprove {
        approved = true;
        approvalTime = block.timestamp;

        emit ApplicationApproved(applicationId, msg.sender);
    }

    function lodgeConstructionCertificate() public canLodge {
        require(approved, "Construction Certificate cannot be lodged on unapproved application");
        constructionCertificateLodged = true;
        constructionCertificateLodgedTime = block.timestamp;

        emit ConstructionCertificateLodged(applicationId, msg.sender);
    }

    function approveConstructionCertificate(string memory _certificateUrl) public canApprove {
        require(constructionCertificateLodged, "Construction Certificate cannot be approved when it has not been lodged");
        require(bytes(_certificateUrl).length > 10, "Construction Certificate URL must be provided");
        constructionCertificateApproved = true;
        constructionCertificateApprovedTime = block.timestamp;
        constructionCertificate = _certificateUrl;

        emit ConstructionCertificateApproved(applicationId, msg.sender);
    }

    function lodgeSubdivisionCertificate() public canLodge {
        require(constructionCertificateApproved, "Subdivision Certificate cannot be lodged before a Construction Certificate has been approved");
        subdivisionCertificateLodged = true;
        subdivisionCertificateLodgedTime = block.timestamp;

        emit SubdivisionCertificateLodged(applicationId, msg.sender);
    }

    function approveSubdivisionCertificate(string memory _certificateUrl) public canApprove {
        require(subdivisionCertificateLodged, "Subdivision Certificate cannot be approved when it has not been lodged");
        require(bytes(_certificateUrl).length > 10, "Subdivision Certificate URL must be provided");
        subdivisionCertificateApproved = true;
        subdivisionCertificateApprovedTime = block.timestamp;
        subdivisionCertificate = _certificateUrl;

        emit SubdivisionCertificateApproved(applicationId, msg.sender);
    }

    function addDocument(string memory _fileUrl) public {
        emit DocumentAdded(applicationId, msg.sender, _fileUrl);
    }

    function modifyDocument(string memory _fileUrl) public {
        emit DocumentModified(applicationId, msg.sender, _fileUrl);
    }

    modifier canApprove() {
        require(accessList.hasApproveAccess(msg.sender), "This user does not have approval access.");
        _;
    }

    modifier canLodge() {
        require(accessList.hasLodgeAccess(msg.sender), "This user does not have lodgement access.");
        _;
    }

}
