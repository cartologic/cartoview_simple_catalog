from django.conf.urls import patterns, url
import views
from . import APP_NAME
from django.views.generic import TemplateView

urlpatterns = patterns('',
   url(r'^catalog$', views.catalog, name='%s.catalog' % APP_NAME),
   url(r'^(?P<app_id>\d+)/view/$',  views.catalog, name='%s.view' % APP_NAME),
   url(r'^(?P<app_id>\d+)/edit/$', views.edit, name='%s.edit' % APP_NAME),
   url(r'^new/$', views.edit, name='%s.new' % APP_NAME),
   url(r'^save/$', views.save, name='%s.save' % APP_NAME),

)
