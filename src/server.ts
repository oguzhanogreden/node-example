import { app } from "./app";
import { otcDataSource } from "./db";

otcDataSource.initialize()
  // Ideally: Server shouldn't receive traffic before database is initialised.
  //          Using a K8s-based infrastructure, we can achieve this with readiness checks.
  .then(() => console.log("Connected to database."))
  .catch(err => console.error(err)) // 

app.listen(3000);
