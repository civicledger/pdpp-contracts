const DA = artifacts.require("DevelopmentApplication");
const AccessList = artifacts.require("AccessList");
const {assertThrows, signContract} = require('./TestHelpers');

const { providers } = require('ethers');
const web3Provider = new providers.Web3Provider(web3.currentProvider);

let web3Instance = null;
let web3AccessInstance = null;
let accessInstance = null;
let councilInstance = null;
let developerInstance = null;

var filename = 'd';


contract("Development Application", ([ADMIN, COUNCIL, DEVELOPER]) => {

  beforeEach(async () => {
    web3AccessInstance = await AccessList.new();
    accessInstance = signContract(web3Provider, web3AccessInstance, ADMIN);
    await accessInstance.grantLodgeAccess(DEVELOPER);
    await accessInstance.grantApproveAccess(COUNCIL);

    web3Instance = await DA.new(accessInstance.address, web3.utils.fromAscii('test123'));
    councilInstance = signContract(web3Provider, web3Instance, COUNCIL);
    developerInstance = signContract(web3Provider, web3Instance, DEVELOPER);
  });

  describe("Application approval", () => {

    it('should allow a user to set approval', async () => {
      const stateBefore = await councilInstance.approved();
      await councilInstance.approveApplication();
      const stateAfter = await councilInstance.approved();

      assert.isNotOk(stateBefore, 'Contract not initially unapproved');
      assert.isOk(stateAfter, 'Contract not successfully approved');
    });

    it('should reject approval from incorrect user', async () => {
      const stateBefore = await developerInstance.approved();
      await assertThrows(developerInstance.approveApplication());
      const stateAfter = await developerInstance.approved();

      assert.isNotOk(stateBefore, 'Contract not initially unapproved');
      assert.isNotOk(stateAfter, 'Contract should not be approved');
    });

    it("should reject lodging of a construction certificate for an unapproved application", async () => {
      const stateBefore = await developerInstance.constructionCertificateLodged();
      await assertThrows(developerInstance.lodgeConstructionCertificate());
      const stateAfter = await developerInstance.constructionCertificateLodged();

      assert.isNotOk(stateBefore, 'Construction certificate already lodged');
      assert.isNotOk(stateAfter, 'Construction certificate should not be approved');
    });

  });

  describe("Lodging Construction Certificate", () => {

    beforeEach(async () => {
      await councilInstance.approveApplication();
    });

    it("should allow lodging of construction certificate", async () => {
      const stateBefore = await developerInstance.constructionCertificateLodged();
      await developerInstance.lodgeConstructionCertificate();
      const stateAfter = await developerInstance.constructionCertificateLodged();

      assert.isNotOk(stateBefore, 'Construction Certificate not initially unapproved');
      assert.isOk(stateAfter, 'Construction Certificate not successfully lodged');
    });

    it("should reject lodging of construction certificate from an invalid user", async () => {
      const stateBefore = await councilInstance.constructionCertificateLodged();
      await assertThrows(councilInstance.lodgeConstructionCertificate());
      const stateAfter = await councilInstance.constructionCertificateLodged();

      assert.isNotOk(stateBefore, 'Contract not initially unapproved');
      assert.isNotOk(stateAfter, 'Contract should not be approved');
    });

  });

  describe("Approving Construction Certificate", () => {

    describe("Approve ", () => {

      beforeEach(async () => {
        await councilInstance.approveApplication({gasLimit: 100000});
        await developerInstance.lodgeConstructionCertificate({gasLimit: 100000});
      });

      it("should allow approval of construction certificate", async () => {
        const stateBefore = await councilInstance.constructionCertificateApproved();
        await councilInstance.approveConstructionCertificate("document.docx", {gasLimit: 100000});
        const stateAfter = await councilInstance.constructionCertificateApproved();

        assert.isNotOk(stateBefore, 'Construction Certificate not initially approved');
        assert.isOk(stateAfter, 'Construction Certificate not successfully approved');
      });

      it("should reject approval of construction certificate from an invalid user", async () => {
        const stateBefore = await councilInstance.constructionCertificateApproved();
        await councilInstance.approveConstructionCertificate("document.docx", {gasLimit: 100000});
        const stateAfter = await councilInstance.constructionCertificateApproved();

        assert.isNotOk(stateBefore, 'Construction Certificate not initially approved');
        assert.isOk(stateAfter, 'Construction Certificate not successfully approved');
      });

      it("should reject approval of a construction certificate without a construction certificate document", async () => {
        const stateBefore = await councilInstance.constructionCertificateApproved();
        await assertThrows(
          councilInstance.approveConstructionCertificate("", {gasLimit: 100000}),
          "Construction Certificate URL must be provided"
        );
        const stateAfter = await councilInstance.constructionCertificateApproved();

        assert.isNotOk(stateBefore, 'Contract not initially unapproved');
        assert.isNotOk(stateAfter, 'Contract should not be approved');
      });

    });

    describe("Contruction Certificate not lodged", () => {

      beforeEach(async () => {
        await councilInstance.approveApplication({gasLimit: 100000});
      });

      it("should reject approval of a construction certificate for an unlodged application", async () => {
        const stateBefore = await councilInstance.constructionCertificateApproved();
        await assertThrows(
          councilInstance.approveConstructionCertificate("document.docx", {gasLimit: 100000}),
          "Construction Certificate cannot be approved when it has not been lodged"
        );
        const stateAfter = await councilInstance.constructionCertificateApproved();
        assert.isNotOk(stateBefore, 'Contract not initially unapproved');
        assert.isNotOk(stateAfter, 'Contract should not be approved');
      });

    })

  });

  describe("Lodging Subdivision Certificate", () => {

    describe("Approved Construction Certificate", () => {

      beforeEach(async () => {
        await councilInstance.approveApplication({gasLimit: 100000});
        await developerInstance.lodgeConstructionCertificate({gasLimit: 100000});
        await councilInstance.approveConstructionCertificate("document.docx", {gasLimit: 100000});
      });

      it("should allow lodging of subdivision certificate", async () => {
        const stateBefore = await councilInstance.subdivisionCertificateLodged();
        await developerInstance.lodgeSubdivisionCertificate({gasLimit: 100000});
        const stateAfter = await councilInstance.subdivisionCertificateLodged();

        assert.isNotOk(stateBefore, 'Subdivision Certificate not initially unlodged');
        assert.isOk(stateAfter, 'Subdivision Certificate not successfully lodged');
      });

      it("should reject lodging of subdivision certificate from an invalid user", async () => {
        const stateBefore = await councilInstance.subdivisionCertificateLodged();
        await assertThrows(councilInstance.lodgeSubdivisionCertificate({gasLimit: 100000}));
        const stateAfter = await councilInstance.subdivisionCertificateLodged();

        assert.isNotOk(stateBefore, 'Certificate not initially unlodged');
        assert.isNotOk(stateAfter, 'Certificate should not be successfully lodged');
      });

    });

    describe("Construction Certificate not yet approved", () => {

      beforeEach(async () => {
        await councilInstance.approveApplication({gasLimit: 100000});
        await developerInstance.lodgeConstructionCertificate({gasLimit: 100000});
      });

      it("should reject lodging of a subdivision certificate for DA without an approved construction certificate", async () => {
        const stateBefore = await councilInstance.subdivisionCertificateLodged();
        await assertThrows(councilInstance.lodgeSubdivisionCertificate({gasLimit: 100000}));
        const stateAfter = await councilInstance.subdivisionCertificateLodged();

        assert.isNotOk(stateBefore, 'Certificate not initially unlodged');
        assert.isNotOk(stateAfter, 'Certificate should not be successfully lodged');
      });

    });

  });

  describe("Approval Subdivision Certificate", () => {

    describe("Lodged Subdivision Certificate", () => {

      beforeEach(async () => {
        await councilInstance.approveApplication({gasLimit: 100000});
        await developerInstance.lodgeConstructionCertificate({gasLimit: 100000});
        await councilInstance.approveConstructionCertificate("document.docx", {gasLimit: 100000});
        await developerInstance.lodgeSubdivisionCertificate({gasLimit: 100000});
      });

      it("should allow approval of subdivision certificate", async () => {
        const stateBefore = await councilInstance.subdivisionCertificateApproved();
        await councilInstance.approveSubdivisionCertificate('subdivision_certificate.docx', {gasLimit: 100000});
        const stateAfter = await councilInstance.subdivisionCertificateApproved();

        assert.isNotOk(stateBefore, 'Subdivision Certificate not initially unapproved');
        assert.isOk(stateAfter, 'Subdivision Certificate not successfully approved');
      });

      it("should reject approval of subdivision certificate from an invalid user", async () => {
        const stateBefore = await councilInstance.subdivisionCertificateApproved();
        await assertThrows(developerInstance.approveSubdivisionCertificate('subdivision_certificate.docx', {gasLimit: 100000}))
        const stateAfter = await councilInstance.subdivisionCertificateApproved();

        assert.isNotOk(stateBefore, 'Subdivision Certificate not initially unapproved');
        assert.isNotOk(stateAfter, 'Subdivision Certificate should not have been approved');
      });

      it("should reject approval of a subdivision certificate without a subdivision certificate document", async () => {
        const stateBefore = await councilInstance.subdivisionCertificateApproved();
        await assertThrows(councilInstance.approveSubdivisionCertificate('', {gasLimit: 100000}));
        const stateAfter = await councilInstance.subdivisionCertificateApproved();

        assert.isNotOk(stateBefore, 'Certificate not initially unapproved');
        assert.isNotOk(stateAfter, 'Certificate should not be successfully approved');
      });

    });

    describe("No Subdivision Certificate Lodged", () => {

      beforeEach(async () => {
        await councilInstance.approveApplication({gasLimit: 100000});
        await developerInstance.lodgeConstructionCertificate({gasLimit: 100000});
        await councilInstance.approveConstructionCertificate("document.docx", {gasLimit: 100000});
      });

      it("should reject approval of a subdivision certificate for an unlodged application", async () => {
        const stateBefore = await councilInstance.subdivisionCertificateApproved();
        await assertThrows(councilInstance.approveSubdivisionCertificate("document.docx", {gasLimit: 100000}));
        const stateAfter = await councilInstance.subdivisionCertificateApproved();

        assert.isNotOk(stateBefore, 'Certificate not initially unapproved');
        assert.isNotOk(stateAfter, 'Certificate should not be successfully approved');
      });

    });

  });

});

