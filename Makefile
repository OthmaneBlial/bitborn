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
	node tests/test_encoding.mjs
	node tests/test_linux_encoding.mjs
	node tests/test_byte_order.mjs
	node tests/test_stack_lesson.mjs
	node tests/test_flag_lesson.mjs
	node tests/test_allocator_scope.mjs
	node tests/test_timer_irq_scope.mjs
	node tests/test_paging_scope.mjs
	node tests/test_exception_dispatch_scope.mjs
	node tests/test_memory_encoding.mjs
	node tests/test_elf.mjs
	node tests/test_hex.mjs
	node tests/test_source_locations.mjs
	node tests/test_flags_properties.mjs
	node tests/test_contrast.mjs
	node tests/test_memory_changes.mjs
	node tests/test_history.mjs
	node tests/test_program_link.mjs
	node tests/test_register_mov.mjs
	node tests/test_memory_mov.mjs
	node tests/test_branches.mjs
	node tests/test_branch_encoding.mjs
	node tests/test_carry.mjs
	node tests/test_self_modifying.mjs
	node tests/test_boot_stack.mjs
	node tests/test_vga_bitmap_scope.mjs
	node tests/test_bit_diff.mjs
	node tests/test_builder.mjs
	node tests/test_cpu_lab.mjs
	node tests/test_challenges.mjs
	node tests/test_routes.mjs
	$(PYTHON) -m unittest tests.test_docs -v
