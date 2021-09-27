first: 
docker-compose run --build
then:
attach shell to express container and run:
npm run db:create && npm run db:migrate && npm run db:seed

