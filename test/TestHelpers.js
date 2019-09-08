const { Contract } = require('ethers');

// Assert that an error is thrown
async function assertThrows(promise, message = 'VM Exception') {
    try {
        await promise;
        assert.fail("Exception was not thrown");
    } catch (e) {
        assert.include(e.message, message);
    }
}

const signContract = (provider, instance, account) => {
  return new Contract(instance.address, instance.abi, provider.getSigner(account));
}

module.exports = {assertThrows, signContract};