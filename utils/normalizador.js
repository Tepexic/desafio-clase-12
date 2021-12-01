const { normalize, denormalize, schema } = require("normalizr");

const authorSchema = new schema.Entity("author");
const messageSchema = new schema.Entity("message", {
  author: authorSchema,
});
const messagesSchema = new schema.Entity("messages", {
  messages: [messageSchema],
});

const normalizeMessages = (messages) => {
  const normalizedData = normalize(messages, messagesSchema);
  const compressionRate =
    (JSON.stringify(normalizedData).length / JSON.stringify(messages).length) *
    100;
  return {
    normalizedData,
    compressionRate,
  };
};

const denormalizeMessages = (normalizedData) => {
  const denormalizedData = denormalize(normalizedData, messagesSchema);
  return denormalizedData;
};

module.exports = {
  normalizeMessages,
  denormalizeMessages,
};
