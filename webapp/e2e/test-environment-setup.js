const { MongoMemoryServer } = require('mongodb-memory-server');
const mongoose = require('mongoose');


module.exports = async () => {

  global.mongoserver = await MongoMemoryServer.create(
      { instance: { dbName: 'userdb', port:5151 } }
  );
  process.env.MONGODB_URI = global.mongoserver.getUri();

  console.log('\n🗣️🗣️MONGODB_URI: '+process.env.MONGODB_URI)


  global.userservice = require("../../users/userservice/user-service");
  global.authservice = require("../../users/authservice/auth-service");
  global.llmservice = require("../../llmservice/llm-service");
  global.gatewayservice = require("../../gatewayservice/gateway-service");
  global.gameservice = require("../../gameservice/gameserver");
};
