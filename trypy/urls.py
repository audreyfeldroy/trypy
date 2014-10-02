from django.conf.urls import patterns, include, url
from django.contrib import admin

from rest_framework.urlpatterns import format_suffix_patterns

from tutorial import api

urlpatterns = patterns('',
    url(r'^admin/', include(admin.site.urls)),

    url(r'^$', include('tutorial.urls')),
    url(r'^api/', include('rest_framework.urls', namespace='rest_framework'))
)

api_urlpatterns = patterns('tutorial.api',
    url(r'^api/$', 'api_root', name='api_root'),
    url(r'^api/levels/$', api.LevelList.as_view(), name='level_list'),
    url(r'^api/levels/(?P<pk>[0-9]+)/$', api.LevelDetail.as_view(), name='level_detail'),
    url(r'^api/challenges/$', api.ChallengeList.as_view(), name='challenge_list'),
    url(r'^api/challenges/(?P<pk>[0-9]+)/$', api.ChallengeDetail.as_view(), name='challenge_detail'),
)
api_urlpatterns = format_suffix_patterns(api_urlpatterns)

urlpatterns += api_urlpatterns
