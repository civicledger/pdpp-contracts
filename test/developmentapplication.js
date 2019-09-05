const DA = artifacts.require("DevelopmentApplication");
const ethers = require('ethers');
let contractInstance = null;

contract("Development Application", accounts => {

  beforeEach(async () => {
    contractInstance = await DA.new(accounts[8], web3.utils.fromAscii('test123'));
  });

  it('should allow a user to set approval', async () => {

    //const approval = await contractInstance.methods.approved().call();
    console.log(contractInstance.methods.approved.call());
    //console.log(contractInstance.methods['approved()']);
    //await contractInstance.approveApplication();
    //const approved = await contractInstance.methods.approved().call();
    //console.log(await contractInstance.methods['approved()'].call());
    // try{
    //   await contractInstance.methods.approved.send();
    // }
    // catch(error) {
    //   console.log(error);
    // }
    // console.log(await contractInstance.methods['approved()'].call());
    //console.log(approved);
    //await contractInstance.methods.approveApplication().send();
  });

  it('should reject approval from incorrect user');
});

