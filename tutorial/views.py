from django.shortcuts import render
from django.http import JsonResponse
from django.views.decorators.csrf import csrf_exempt
from pprint import pprint
from .trypy import EvalContext

def index(request):

    return render(request, 'tutorial/index.html', {})

@csrf_exempt
def run_code(request):

    if request.POST.get('command', False):
        eval_context = EvalContext()

        trypy_history = request.session.get('trypy_history', [])
        trypy_history.append(request.GET.get('command'))
        request.session['trypy_history'] = trypy_history

        for command in request.session['trypy_history']:
            output = eval_context.exec_expr(command)
    else:
        output = {'error': True, 'text': 'No command'}

    return JsonResponse(output)
