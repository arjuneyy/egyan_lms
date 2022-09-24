# Egyan Learning Management System

## Start MongoDB
If you have docker installed, you can use the predefined docker-compose file made for mongodb.
```sh
docker-compose up -d
```

After starting the mongodb docker image, ssh to mongo container to manipulate mongodb.
```sh
docker-compose exec -it mongodb mongosh -u egyan -p egyan123
```

## Start the Application
Execute the following command to start the application;
```sh
npm start
```

Using any browser, navigate to: `localhost:3000/api`.