# energy-demo

## Dev environment

A running Docker installation is required.
I'm using:

```sh
docker -v

# > Docker version 20.10.8, build 3967b7d
```

Then:

```
docker compose up
```

and you should have the API running at `localhost:3000`.

If you do not want to use Docker for the API itself, open `./src/db.ts` and change the host.
Or configure a network interface and connect to that from the host machine.

If you want to connect to the database from e.g. a database client, uncomment the `ports` key of Docker compose definition
