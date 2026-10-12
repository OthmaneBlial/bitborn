PYTHON ?= python3
.PHONY: build test verify run clean site site-test
build:
	$(PYTHON) tools/build.py
verify: build
	./tools/bitverify
test: verify
	$(PYTHON) -m unittest discover -s tests -v
run: build
	qemu-system-i386 -machine pc,accel=tcg -drive file=build/boot.img,format=raw,if=floppy -boot a -serial stdio
clean:
	rm -rf build
site: verify
	$(PYTHON) tools/byte_tables.py
	$(PYTHON) tools/site_build.py
site-test: site
	node --check site/app.js
	node --check site/simulator.mjs
	node tests/test_site.mjs
	node tests/test_cpu.mjs
	node tests/test_memory_changes.mjs
	node tests/test_builder.mjs
	node tests/test_cpu_lab.mjs
	node tests/test_challenges.mjs
	node tests/test_routes.mjs
	$(PYTHON) -m unittest tests.test_docs -v
