import sys

import MonkeyLex
import MonkeyParser
import MonkeyInterpreter

if __name__ == '__main__':
    if len(sys.argv) == 2:
        data = open(sys.argv[1], 'r').read()
        prog = MonkeyParser.parse(data, 1)
        print prog
        mintp = MonkeyInterpreter.MonkeyInterpreter(prog, "Hello.py")
        mintp.translate()
        mintp.save()