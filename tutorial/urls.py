from django.conf.urls import patterns, include, url

from tutorial import views

urlpatterns = patterns('',
    url(r'^$', views.index, name='index'),
    url(r'^run_code/$', views.run_code, name='run_code'),
)
