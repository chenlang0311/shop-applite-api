all: api

check_env:
	@if [ "$(TARGET_DIR)" = "" ]; then echo "ERROR: TARGET_DIR was not set"; exit 1; fi
	@if [ "$(TAG_VERSION)" = "" ]; then echo "ERROR: TAG_VERSION was not set"; exit 1; fi
	@if [ "$(REGISTRY)" = "" ]; then echo "ERROR: REGISTRY was not set"; exit 1; fi

api:check_env
	test -e node_modules || cnpm install
	gulp build

install:check_env
	rm -rf $(TARGET_DIR)/api
	mkdir -p $(TARGET_DIR)/api/app
	cp -r docker/* $(TARGET_DIR)/api
	cp -r build $(TARGET_DIR)/api/app
	cp -r bin $(TARGET_DIR)/api/app
	cp -r public $(TARGET_DIR)/api/app
	cp package.json $(TARGET_DIR)/api/app
	cp -r node_modules $(TARGET_DIR)/api/app

image:check_env
	cd $(TARGET_DIR)/api && sudo docker build . -t $(REGISTRY)/api:$(TAG_VERSION)

.PHONY: clean
clean:
	rm -rf node_modules