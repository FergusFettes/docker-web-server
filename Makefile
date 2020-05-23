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

prod:
	@docker-compose down --remove-orphans
	@COMPONENT=${PROD} make component-up
	@echo ======= RESTARTED ${PROD} =======

prod-hard:
	@docker-compose kill --remove-orphans
	@docker-compose rm -f
	@COMPONENT=${PROD} make component-up
	@echo ======= FORCE RESTARTED ${PROD} =======

component-up:
	@docker-compose up $(COMPONENT)
