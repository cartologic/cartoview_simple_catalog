import json
from django.shortcuts import render, HttpResponse, render_to_response, HttpResponseRedirect
from geonode.base.models import ResourceBase
from django.core.urlresolvers import reverse
from .models import CatalogConfig
from cartoview.app_manager.models import App, AppInstance
from django.conf import settings
from . import APP_NAME
from guardian.shortcuts import get_objects_for_user
from django.core.paginator import Paginator, EmptyPage, PageNotAnInteger


def edit(request, catalog_id=None):
    context = {
        "catalog_id": catalog_id or 'null'
    }
    return render(request, "%s/edit.html" % APP_NAME, context)


def get_item_data(item):
    urls = dict(details=item.detail_url, )
    item_data = dict(
        id=item.id,
        title=item.title,
        abstract=item.abstract,
        thumbnail=item.thumbnail_url,
        urls=urls,
        type="layer"
    )
    if hasattr(item, 'appinstance'):
        urls["view"] = reverse('%s.view' % item.appinstance.app.name, args=[str(item.appinstance.id)])
        if item.appinstance.map:
            item_data["thumbnail"] = item.appinstance.map.thumbnail_url
        item_data["type"] = "app"
        if item.appinstance.app is not None:
            item_data["app"] = item.appinstance.app.title
    elif hasattr(item, 'document'):
        urls["download"] = reverse('document_download', None, [str(item.id)])
        item_data["type"] = "doc"
    elif hasattr(item, 'map'):
        urls["view"] = reverse('map_view', None, [str(item.id)])
        item_data["type"] = "map"
    return item_data


def catalog_page(request, catalog_id=None):
    context = {
        'catalog_id': catalog_id
    }
    return render(request, "%s/catalog.html" % APP_NAME, context)


def get_qs(request, catalog_obj):
    config = catalog_obj.config_obj
    permitted_ids = get_objects_for_user(request.user, 'base.view_resourcebase').values('id')
    qs = ResourceBase.objects.filter(id__in=permitted_ids)
    qs = qs.filter(title__isnull=False).exclude(id=catalog_obj.id)
    if config["selectionType"] == "onebyone":
        return qs.filter(id__in=config["selectedIds"])

    if not config["layers"]:
        qs = qs.filter(layer__isnull=True)
    if not config["maps"]:
        qs = qs.filter(map__isnull=True)
    if not config["apps"]:
        qs = qs.filter(appinstance__isnull=True)
    if not config["documents"]:
        qs = qs.filter(document__isnull=True)
    if config["featured"]:
        qs = qs.filter(featured=True)
    if len(config["keywords"]) > 0:
        qs = qs.filter(keywords__id__in=config["keywords"])
    search_text = request.GET.get('text', None)
    if search_text is not None:
        qs = qs.filter(title__icontains=search_text)
    return qs


def catalog_data(request, catalog_id):
    catalog_obj = AppInstance.objects.get(pk=catalog_id)
    qs = get_qs(request, catalog_obj)
    config = catalog_obj.config_obj
    items = []
    data = dict(title=catalog_obj.title, abstract=catalog_obj.abstract, items=items, config=config)
    if config["enablePaging"]:
        page = request.GET.get('page', 1)
        paginator = Paginator(qs, config["itemsPerPage"])
        data["pages"] = paginator.num_pages
        data["page"] = page
        try:
            qs = paginator.page(page)
        except PageNotAnInteger:
            # If page is not an integer, deliver first page.
            qs = paginator.page(1)
        except EmptyPage:
            # If page is out of range (e.g. 9999), deliver last page of results.
            qs = paginator.page(paginator.num_pages)
            data["page"] = paginator.num_pages
    for item in qs:
        items.append(get_item_data(item))
    res_json = json.dumps(data)
    return HttpResponse(res_json, content_type="text/json")


def all_resources(request):
    permitted_ids = get_objects_for_user(request.user, 'base.view_resourcebase').values('id')
    qs = ResourceBase.objects.filter(id__in=permitted_ids).filter(title__isnull=False)
    catalog_id = request.GET.get('catalogId', None)
    search_text = request.GET.get('text', None)
    if catalog_id is not None:
        qs = qs.exclude(id=catalog_id)
    if search_text is not None:
        qs = qs.filter(title__icontains=search_text)
    items = []
    for item in qs:
        items.append(get_item_data(item))
    res_json = json.dumps(items)
    return HttpResponse(res_json, content_type="text/json")



def autocomplete(request, catalog_id):
    catalog_obj = AppInstance.objects.get(pk=catalog_id)
    qs = get_qs(request, catalog_obj)
    items = []
    for item in qs:
        items.append({
            "title": item.title,
        })
    res_json = json.dumps(items)
    return HttpResponse(res_json, content_type="text/json")