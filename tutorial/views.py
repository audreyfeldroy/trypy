from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from pprint import pprint
from .trypy import EvalContext
import json

def index(request):

    return render(request, 'tutorial/index.html', {})

@csrf_exempt
def run_code(request):

    # Angular.js sends data as json:
    data = json.loads(request.body)

    if data.get('command', False):
        eval_context = EvalContext()

        trypy_history = request.session.get('trypy_history', [])
        trypy_history.append(data.get('command'))
        request.session['trypy_history'] = trypy_history

        for command in request.session['trypy_history']:
            output = eval_context.exec_expr(command)
    else:
        output = {'error': True, 'text': 'No command'}

    return JsonResponse(output)
