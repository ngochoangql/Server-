import threading

def print_active_threads():
    for thread in threading.enumerate():
        print("Thread name:", thread.name)
        print("Thread ID:", thread.ident)
        print("Thread is alive:", thread.is_alive())
        print("Thread daemon:", thread.daemon)
        print()

print("Các luồng đang hoạt động:")
print_active_threads()
