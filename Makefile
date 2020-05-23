DEV := nginx
PROD := letsencrypt

dev:
	@docker-compose down --remove-orphans
	@COMPONENT=${DEV} make component-up
	@echo ======= RESTARTED ${DEV} =======

dev-hard:
	@docker-compose kill --remove-orphans
	@docker-compose rm -f
	@COMPONENT=${DEV} make component-up
	@echo ======= FORCE RESTARTED ${DEV} =======

dev-follow:
	@echo "image is $$(docker ps | grep ${DEV} | awk '{ print $$NF }')"
	@docker logs -f $$(docker ps | grep ${DEV} | awk '{ print $$NF }')

prod:
	@docker-compose down --remove-orphans
	@COMPONENT=${PROD} make component-up
	@echo ======= RESTARTED ${PROD} =======

prod-hard:
	@docker-compose kill --remove-orphans
	@docker-compose rm -f
	@COMPONENT=${PROD} make component-up
	@echo ======= FORCE RESTARTED ${PROD} =======

prod-follow:
	@echo "image is $$(docker ps | grep ${PROD} | awk '{ print $$NF }')"
	@docker logs -f $$(docker ps | grep ${PROD} | awk '{ print $$NF }')

component-up:
	@docker-compose up -d $(COMPONENT)

down:
	@docker-compose down --remove-orphans
