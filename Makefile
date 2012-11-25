REPORTER = dot

test:
	mocha

watch:
	mocha --watch

debug:
	mocha debug

server:
	node test/server/server.js

show:
	open http://localhost:3000

.PHONY: test test-w
