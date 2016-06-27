from django.shortcuts import render, HttpResponse, render_to_response, HttpResponseRedirect
from geonode.base.models import ResourceBase
from django.core.urlresolvers import reverse
from .models import CatalogConfig
from cartoview.app_manager.models import App, AppInstance
from django.conf import settings
from . import APP_NAME

# Create your views here.
def edit(request, app_id=None):
    context = {
        "SITEURL": settings.SITEURL[0:-1]
    }
    if app_id is not None:
        context['catalog'] = AppInstance.objects.get(pk=app_id)
    return render(request, "%s/edit.html" % APP_NAME, context)



def get_item_url(item):
    try:
        return reverse('%s.view' % item.appinstance.app.name, args=[str(item.appinstance.id)])
    except:
        try:
            if item.map:
                return reverse('geonode.maps.views.map_view', None, [str(item.id)])
        except:
            pass

    return None


def catalog(request, app_id=None):
    qs = ResourceBase.objects.filter(title__isnull=False).exclude(pk=app_id)
    catalog_obj = None
    if app_id is None:
        config = CatalogConfig(request)
    else:
        catalog_obj = AppInstance.objects.get(pk=app_id)
        config = CatalogConfig(catalog=catalog_obj)

    if config.layers == 'false':
        qs = qs.filter(layer__isnull=True)
    if config.maps == 'false':
        qs = qs.filter(map__isnull=True)
    if config.apps == 'false':
        qs = qs.filter(appinstance__isnull=True)
    if config.documents == 'false':
        qs = qs.filter(document__isnull=True)
    if config.featured == 'true':
        qs = qs.filter(featured=True)
    if len(config.keywords) > 0:
        qs = qs.filter(keywords__slug__in=config.keywords)

    items = []
    for item in qs:
        items.append({
            "title": item.title,
            "url": get_item_url(item),
            "thumbnail": item.thumbnail_url,
            "detail_url": item.detail_url,
            "abstract": item.abstract
        })
    context = {
        'items': items,
        'catalog': catalog_obj
    }
    return render(request, "%s/catalog.html" % APP_NAME, context)


def save(request):
    catalog_id = request.POST.get("id", "")
    if catalog_id == "":
        catalog_obj = AppInstance()
        catalog_obj.app = App.objects.get(name=APP_NAME)
        catalog_obj.owner = request.user
    else:
        catalog_obj = AppInstance.objects.get(pk=catalog_id)

    catalog_obj.title = request.POST.get("title", None)
    catalog_obj.abstract = request.POST.get("abstract", None)
    catalog_obj.config = request.POST.get("config", None)
    print catalog_obj.config
    catalog_obj.save()
    return HttpResponseRedirect(reverse("appinstance_detail", kwargs={'appinstanceid': catalog_obj.id}))