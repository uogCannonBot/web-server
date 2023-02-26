const Queue = require("bull");
const { redis } = require("../config");
const { hookMessageProcess } = require("../processes/hookMessage.process");

const NUM_OF_CONCURRENT_JOBS = 5;

const hookMessageQueue = new Queue("Discord Webhook Messaging", {
  redis: {
    host: "localhost",
    port: redis.port,
    password: redis.password,
  }
});

hookMessageQueue.process("new webhook message", NUM_OF_CONCURRENT_JOBS, hookMessageProcess);
hookMessageQueue.on("failed", (job, err) => {
  // todo: modify database to have states for webhooks and DISABLE a webhook upon failure
  // also insert an error to the database giving reason
  console.error("job failed", JSON.stringify(err));
})

const sendNewHookMessage = (webhook, listingToFormat) => {
  hookMessageQueue.add("new webhook message", { webhook, listingToFormat }, {
    attempts: 3,
  });
}

module.exports = {
  sendNewHookMessage,
  hookMessageQueue,
}