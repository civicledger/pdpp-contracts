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

const eventInLogs = (logs, eventName, eventArgs = {}) => {
    const events = logs.filter(e => e.event === eventName);
    expect(events.length > 0).to.equal(true, `No '${eventName}' events found`);

    const exception = [];
    const event = events.find(function (e) {
      for (const [k, v] of Object.entries(eventArgs)) {
        try {
          contains(e.args, k, v);
        } catch (error) {
          exception.push(error);
          return false;
        }
      }
      return true;
    });

    if (event === undefined) {
      throw exception[0];
    }

    return event;
  }

module.exports = {assertThrows, signContract, eventInLogs};