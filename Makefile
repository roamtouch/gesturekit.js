dev:
	grunt dev

build:
	grunt dev
	grunt dist

clean:
	rm -rf ./dist/*.js

.PHONY: clean
