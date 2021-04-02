const express = require("express");

const server = express();
PORT = 5000;
server.listen(PORT, () => {
    console.log(`Listening on port ${PORT}`);
})