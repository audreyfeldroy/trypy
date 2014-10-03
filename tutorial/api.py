from django.http import Http404
from django.shortcuts import get_object_or_404

from rest_framework import status
from rest_framework.decorators import api_view
from rest_framework.response import Response
from rest_framework.views import APIView
from rest_framework.reverse import reverse
from rest_framework import generics

from .models import Level, Challenge
from .serializers import LevelSerializer, ChallengeSerializer

@api_view(('GET',))
def api_root(request, format=None):
    return Response({
        'levels': reverse('level_list', request=request, format=format),
        'challenges': reverse('challenge_list', request=request, format=format)
    })

class LevelList(generics.ListAPIView):
    """
    List all levels.
    """
    queryset = Level.objects.all()
    serializer_class = LevelSerializer

class LevelDetail(generics.RetrieveAPIView):
    """
    Retrieve a level instance.
    """
    queryset = Level.objects.all()
    serializer_class = LevelSerializer

class ChallengeList(generics.ListAPIView):
    """
    List all challenges.
    """
    queryset = Challenge.objects.all()
    serializer_class = ChallengeSerializer

    def get_queryset(self):
        """
        Optionally restricts the returned purchases to a given user,
        by filtering against a `username` query parameter in the URL.
        """
        queryset = Challenge.objects.all()
        level = self.request.QUERY_PARAMS.get('level', None)
        if level is not None:
            queryset = queryset.filter(level__pk=level)
        return queryset

class ChallengeDetail(generics.RetrieveAPIView):
    """
    Retrieve a challenge instance.
    """
    queryset = Challenge.objects.all()
    serializer_class = ChallengeSerializer
    multiple_lookup_fields = ['number', 'level__number']

    def get_object(self):
        queryset = self.get_queryset()
        filter = {}
        for field in self.multiple_lookup_fields:
            filter[field] = self.kwargs[field]

        obj = get_object_or_404(queryset, **filter)
        self.check_object_permissions(self.request, obj)
        return obj
