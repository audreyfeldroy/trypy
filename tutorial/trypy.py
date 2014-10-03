# -*- coding: utf-8 -*-
import sys
import __builtin__
import traceback
from copy import copy
from threading import currentThread
from cStringIO import StringIO

class ThreadedStream(object):

    def __init__(self, orig):
        self._orig = orig
        self._buffer = {}

    def push(self):
        tid = currentThread()
        self._buffer[tid] = StringIO()

    def write(self, d):
        tid = currentThread()
        if tid in self._buffer:
            self._buffer[tid].write(d)
        else:
            self._orig.write(d)

    def release(self):
        tid = currentThread()
        if tid in self._buffer:
            result = self._buffer[tid].getvalue()
            del self._buffer[tid]
        else:
            result = ''
        return result


class FakeInput(object):

    def read(self):
        return ''

    def readline(self):
        return '\n'

    def readlines(self):
        return []


# Fake Streams
main_thread = currentThread()
_old_stdout = sys.stdout
_old_stderr = sys.stderr
_old_stdin = sys.stdin
sys.stdout = ThreadedStream(sys.stdout)
sys.__stdout__ = sys.stdout
sys.stderr = sys.stdout
sys.__stderr__ = sys.stderr
sys.stdin = FakeInput()
sys.__stdin__ = sys.stdin

class EvalContext(object):

    def __init__(self):
        self.namespace = {}

    def _get_builtins(self):
        builtins = {}
        for key in dir(__builtin__):
            try:
                builtins[key] = copy(getattr(__builtin__, key))
            except:
                builtins[key] = getattr(__builtin__, key)
        return builtins

    def exec_expr(self, s):
        if not '__builtins__' in self.namespace:
            self.namespace['__builtins__'] = self._get_builtins()
        error = False
        sys.stdout.push()
        try:
            try:
                code = compile(s, '<stdin>', 'single', 0, 1)
                exec code in self.namespace
            except SystemExit:
                print repr('systemexit')
            except:
                etype, value, tb = sys.exc_info()
                tb = tb.tb_next
                msg = ''.join(traceback.format_exception(etype, value, tb))
                print msg.rstrip()
                error = True
        finally:
            output = sys.stdout.release()
        return {
            'error': error,
            'text': output,
        }
