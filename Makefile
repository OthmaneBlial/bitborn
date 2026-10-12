PYTHON ?= python3
.PHONY: build test verify run clean site
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
