IMAGE_NAME ?= lottery-front
CONTAINER_NAME ?= lottery-front
PORT ?= 1337
BRANCH ?= main

.PHONY: build run stop restart deploy logs

build:
	docker build -t $(IMAGE_NAME) .

run:
	docker run -d --restart unless-stopped -p $(PORT):80 --name $(CONTAINER_NAME) $(IMAGE_NAME)

stop:
	-docker stop $(CONTAINER_NAME)
	-docker rm $(CONTAINER_NAME)

restart:
	git checkout $(BRANCH)
	git pull
	$(MAKE) stop
	$(MAKE) build
	$(MAKE) run

deploy: restart

logs:
	docker logs -f $(CONTAINER_NAME)
