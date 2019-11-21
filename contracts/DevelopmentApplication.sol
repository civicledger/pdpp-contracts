pragma solidity 0.5.8;

import './AccessList.sol';

contract DevelopmentApplication {

    AccessList public accessList;
    bytes32 public applicationId;

    bool public lodged;
    uint public lodgedTime;

    bool public approved;
    uint public approvalTime;
    string public noticeOfDetermination;

    bool public constructionCertificateLodged = false;
    uint public constructionCertificateLodgedTime;
    bool public constructionCertificateIssued = false;
    uint public constructionCertificateIssuedTime;
    string public constructionCertificate;

    bool public subdivisionCertificateLodged = false;
    uint public subdivisionCertificateLodgedTime;
    bool public subdivisionCertificateIssued = false;
    uint public subdivisionCertificateIssuedTime;
    string public subdivisionCertificate;

    event ApplicationLodged(bytes32 indexed _applicationId, address lodgedBy);
    event ApplicationApproved(bytes32 indexed _applicationId, address approvedBy, string noticeOfDetermination);
    event ConstructionCertificateLodged(bytes32 indexed _applicationId, address lodgedBy);
    event ConstructionCertificateIssued(bytes32 indexed _applicationId, address issuedBy, string constructionCertificate);
    event SubdivisionCertificateLodged(bytes32 indexed _applicationId, address lodgedBy);
    event SubdivisionCertificateIssued(bytes32 indexed _applicationId, address issuedBy, string subdivisionCertificate);
    event DocumentAdded(bytes32 indexed _applicationId, address addedBy, string fileLocation);
    event DocumentModified(bytes32 indexed _applicationId, address modifiedBy, string fileLocation);

    constructor(address _accessListAddress, bytes32 _applicationId) public {
        accessList = AccessList(_accessListAddress);
        applicationId = _applicationId;
    }

    function lodgeApplication() public canLodge {
        lodged = true;
        lodgedTime = block.timestamp;

        emit ApplicationLodged(applicationId, msg.sender);
    }

    function approveApplication(string memory _noticeOfDetermination) public canApprove {
        approved = true;
        approvalTime = block.timestamp;

        emit ApplicationApproved(applicationId, msg.sender, _noticeOfDetermination);
    }

    function lodgeConstructionCertificate() public canLodge {
        require(approved, "Construction Certificate cannot be lodged on unapproved application");
        constructionCertificateLodged = true;
        constructionCertificateLodgedTime = block.timestamp;

        emit ConstructionCertificateLodged(applicationId, msg.sender);
    }

    function issueConstructionCertificate(string memory _certificateUrl) public canApprove {
        require(constructionCertificateLodged, "Construction Certificate cannot be issued when it has not been lodged");
        require(bytes(_certificateUrl).length > 10, "Construction Certificate URL must be provided");
        constructionCertificateIssued = true;
        constructionCertificateIssuedTime = block.timestamp;
        constructionCertificate = _certificateUrl;

        emit ConstructionCertificateIssued(applicationId, msg.sender, _certificateUrl);
    }

    function lodgeSubdivisionCertificate() public canLodge {
        require(constructionCertificateIssued, "SC cannot be lodged before a CC has been issued");
        subdivisionCertificateLodged = true;
        subdivisionCertificateLodgedTime = block.timestamp;

        emit SubdivisionCertificateLodged(applicationId, msg.sender);
    }

    function issueSubdivisionCertificate(string memory _certificateUrl) public canApprove {
        require(subdivisionCertificateLodged, "SC cannot be issued when it has not been lodged");
        require(bytes(_certificateUrl).length > 10, "Subdivision Certificate URL must be provided");
        subdivisionCertificateIssued = true;
        subdivisionCertificateIssuedTime = block.timestamp;
        subdivisionCertificate = _certificateUrl;

        emit SubdivisionCertificateIssued(applicationId, msg.sender, _certificateUrl);
    }

    function addDocument(string memory _fileUrl) public {
        require(accessList.hasDocumentAccess(msg.sender), "This user does not have document access.");
        emit DocumentAdded(applicationId, msg.sender, _fileUrl);
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
