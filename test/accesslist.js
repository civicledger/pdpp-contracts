const AccessList = artifacts.require("AccessList");

const {assertThrows, signContract} = require('./TestHelpers');

const { providers } = require('ethers');
const web3Provider = new providers.Web3Provider(web3.currentProvider);

let web3Instance = null;
let contractInstance = null;
let nonAdminInstance = null;
contract("Access List", ([ADMIN, COUNCIL, DEVELOPER]) => {

  beforeEach(async () => {
    web3Instance = await AccessList.new();

    nonAdminInstance = signContract(web3Provider, web3Instance, COUNCIL);

    contractInstance = signContract(web3Provider, web3Instance, ADMIN);
    await contractInstance.grantLodgeAccess(DEVELOPER);
    await contractInstance.grantApproveAccess(COUNCIL);
  });

  it("should confirm a valid lodgement user", async () => {
    const hasAccess = await contractInstance.hasLodgeAccess(DEVELOPER);
    assert.isOk(hasAccess);
  });

  it("should deny an invalid lodgement user", async () => {
    const hasAccess = await contractInstance.hasLodgeAccess(COUNCIL);
    assert.isNotOk(hasAccess);
  });

  it("should confirm a valid approval user", async () => {
    const hasAccess = await contractInstance.hasApproveAccess(COUNCIL);
    assert.isOk(hasAccess);
  });

  it("should deny an invalid approval user", async () => {
    const hasAccess = await contractInstance.hasApproveAccess(DEVELOPER);
    assert.isNotOk(hasAccess);
  });

  it("should allow admin to set a lodgement user", async () => {
    const hadAccess = await contractInstance.hasLodgeAccess(COUNCIL);
    await contractInstance.grantLodgeAccess(COUNCIL);
    const hasAccess = await contractInstance.hasLodgeAccess(COUNCIL);
    assert.isNotOk(hadAccess);
    assert.isOk(hasAccess);
  });

  it("should allow admin to revoke a lodgement user", async () => {
    const hadAccess = await contractInstance.hasLodgeAccess(DEVELOPER);
    await contractInstance.revokeLodgeAccess(DEVELOPER);
    const hasAccess = await contractInstance.hasLodgeAccess(DEVELOPER);
    assert.isOk(hadAccess);
    assert.isNotOk(hasAccess);
  });

  it("should not allow non-admin address to set a lodgement user", async () => {
    await assertThrows(nonAdminInstance.grantLodgeAccess(COUNCIL), 'Only the owner may take this action');
  });

  it("should not allow non-admin address to revoke a lodgement user", async () => {
    await assertThrows(nonAdminInstance.revokeLodgeAccess(COUNCIL), 'Only the owner may take this action');
  });

  it("should allow admin to set an approval user", async () => {
    const hadAccess = await contractInstance.hasApproveAccess(DEVELOPER);
    await contractInstance.grantApproveAccess(DEVELOPER);
    const hasAccess = await contractInstance.hasApproveAccess(DEVELOPER);
    assert.isNotOk(hadAccess);
    assert.isOk(hasAccess);
  });

  it("should allow admin to revoke an approval user", async () => {
    const hadAccess = await contractInstance.hasApproveAccess(COUNCIL);
    await contractInstance.revokeApproveAccess(COUNCIL);
    const hasAccess = await contractInstance.hasApproveAccess(COUNCIL);
    assert.isOk(hadAccess);
    assert.isNotOk(hasAccess);
  });

  it("should not allow non-admin address to set an approval user", async () => {
    await assertThrows(nonAdminInstance.grantApproveAccess(DEVELOPER), 'Only the owner may take this action');
  });

  it("should not allow non-admin address to revoke an approval user", async () => {
    await assertThrows(nonAdminInstance.revokeApproveAccess(DEVELOPER), 'Only the owner may take this action');
  });

});