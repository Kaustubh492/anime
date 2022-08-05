import logging
from msg_system import MsgSystem
from threading import Thread
import uvicorn
from sys import stdout
import asyncio
from library import JsonLibrary
import config


def run_api_server(port: int = 8000):
    loop = asyncio.new_event_loop()
    asyncio.set_event_loop(loop)
    print(f"server started on port: {port}")
    uvicorn.run("api:app",  port=port)


if __name__ == "__main__":
    try:
        logging.basicConfig(stream=stdout, level=logging.ERROR)
        p1 = Thread(target=run_api_server, args=(9001, ))
        p1.daemon = True
        p1.start()
        event_loop = asyncio.new_event_loop()  # get new event loop
        asyncio.set_event_loop(event_loop)
        msg_system = MsgSystem(9999)
        msg_system.event_loop = event_loop  # assign event loop
        event_loop.run_until_complete(msg_system.run_server())  # run socket server
    except KeyboardInterrupt:
        JsonLibrary().save()
