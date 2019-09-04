const AccessList = artifacts.require("AccessList");
const DevelopmentApplication = artifacts.require("DevelopmentApplication");

module.exports = deployer => {
  deployer.deploy(AccessList).then(accessListInstance => {
    deployer.deploy(DevelopmentApplication, accessListInstance.address, web3.utils.fromAscii('test123'));
  })
};