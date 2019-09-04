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

    constructor(AccessList _accessList, bytes32 _applicationId) public {
        accessList = _accessList;
        applicationId = _applicationId;
    }

    function approveApplication() public {
        approved = true;
        approvalTime = block.timestamp;

        emit ApplicationApproved(applicationId, msg.sender);
    }

    function lodgeContructionCertificate() public {
        constructionCertificateLodged = true;
        constructionCertificateLodgedTime = block.timestamp;

        emit ConstructionCertificateLodged(applicationId, msg.sender);
    }

    function approveContructionCertificate(string memory _certificateUrl) public {
        constructionCertificateApproved = true;
        constructionCertificateApprovedTime = block.timestamp;
        constructionCertificate = _certificateUrl;

        emit ConstructionCertificateApproved(applicationId, msg.sender);
    }

    function lodgeSubdivisionCertificate() public {
        subdivisionCertificateLodged = true;
        subdivisionCertificateLodgedTime = block.timestamp;

        emit SubdivisionCertificateLodged(applicationId, msg.sender);
    }

    function approveSubdivisionCertificate(string memory _certificateUrl) public {
        subdivisionCertificateApproved = true;
        subdivisionCertificateApprovedTime = block.timestamp;
        subdivisionCertificate = _certificateUrl;

        emit SubdivisionCertificateApproved(applicationId, msg.sender);
    }

}
