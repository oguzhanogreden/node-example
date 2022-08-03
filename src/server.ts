import { app } from "./app";
import { dataSource } from "./db";

dataSource.initialize()
  // Ideally: Server shouldn't receive traffic before database is initialised.
  //          Using a K8s-based infrastructure, we can achieve this with readiness checks.
  .then(() => console.log("Connected to database."))
  .catch(err => console.error(err)) // 

app.listen(3000);
