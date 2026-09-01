import http from "node:http";

const users = [
  { name: "eyad", age: 20 },
  { name: "ahmed", age: 18 },
];

const server = http.createServer((req, res) => {
  const method = req.method;
  const url = req.url;

  // create user
  if (method === "POST" && url === "/users") {
    let body = "";

    req.on("data", (chunk) => {
      body += chunk;
    });

    req.on("end", () => {
      const data = JSON.parse(body);

      users.push(data);
    });

    res.writeHead(201);
  } 
  // get all users
  else if (method === "GET" && url === "/users") {
    res.writeHead(200, { "content-type": "application/json" });
    res.write(JSON.stringify(users));
  } 
  // get a single user by name
  else if (method === "GET" && url.startsWith("/users/")) {

    // /users/eyad
    //   0      1
    /// ["", "eyad"]

    const userName = url.split("/users/")[1]

    const user = users.find(u => u.name === userName)

    if (user) {
      res.writeHead(200, { "content-type": "application/json" });
      res.write(JSON.stringify(user));
    } else {
      res.writeHead(404, { "content-type": "application/json" });
      res.write(JSON.stringify({error: `user ${userName} not found`}));
    }
  

  }
  // update a user 
  else if (method === "PATCH" && url.startsWith("/users/")) {
    // get user name
    const userName = url.split("/users/")[1]
    const user = users.find(u => u.name === userName)

    // check if it doesn't exist
    if (!user) {
        res.writeHead(404, { "content-type": "application/json" });
        res.write(JSON.stringify({error: `user ${userName} not found`}));       
        res.end();
        return;        
    }
    
    // update user
    let body = "";
    req.on("data", chunk => body += chunk);
    req.on("end", () => {
        const modifiedUser = JSON.parse(body);
        Object.assign(user, modifiedUser);
    }); 
    res.writeHead(200, { "content-type": "application/json" });

  }
  // delete a user 
  else if (method === "DELETE" && url.startsWith("/users/")) {
    // get user
    const userName = url.split("/users/")[1]
    const user = users.find(u => u.name === userName)
        
    // check if it doesn't exist
    if (!user) {
        res.writeHead(404, { "content-type": "application/json" });
        res.write(JSON.stringify({error: `user ${userName} not found`}));
        res.end();
        return;
    }
    
    // delete user
    const newUsers = users.filter( u => u.name !== user.name);
    users.splice(0, users.length, ...newUsers);
    res.writeHead(204, { "content-type": "application/json" });
  }
  res.end();
});

server.listen(3000, () => {
  console.log("server started on port 3000");
});