// This file is for declaring modules which do not have type declaration files
declare module "react-rewards";

// this is a hack. On render, when we build we get an error that this module's types aren't 
// available, so declaring it here. But it has something to do with eslintconfig
// Relevant: https://github.com/facebook/create-react-app/issues/9791
declare module "socket.io-client" 
