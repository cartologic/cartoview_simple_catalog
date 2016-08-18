from django.conf.urls import patterns, url
import views
from . import APP_NAME
from django.views.generic import TemplateView

urlpatterns = patterns('',
    url(r'^(?P<catalog_id>\d+)/view/$',  views.catalog_page, name='%s.view' % APP_NAME),
    url(r'^(?P<catalog_id>\d+)/data/$',  views.catalog_data, name='%s.data' % APP_NAME),
    url(r'^(?P<catalog_id>\d+)/edit/$', views.edit, name='%s.edit' % APP_NAME),
    url(r'^new/$', views.edit, name='%s.new' % APP_NAME),
    url(r'^(?P<catalog_id>\d+)/autocomplete/$',  views.autocomplete, name='%s.autocomplete' % APP_NAME),
    url(r'^resources/all/$',  views.all_resources, name='%s.all_resources' % APP_NAME),
)